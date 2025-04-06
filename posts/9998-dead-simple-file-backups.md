# Dead Simple File Backups
tags: bash, backup

## Introduction

I like to make backups of important records, photos I have taken over the years and generally anything I think might be useful. It's an easy task: compress, encrypt, and copy to a hard drive, USB, or cloud storage. When I started doing this I would forget the commands when it was time to make a backup again, forcing me to scour my Bash history for clues. This post attempts to make a simple Bash script to automate the annoying bits and allow us to make file backups in seconds.

## Why Not Use ...

There are plenty of good backup solutions out there, offering things like incremental backups (Restic), cloud integration, etc. For my own use cases, I don't need any of those features, and requiring specific binaries or a complex setup is just not worth it. As an exercise in determining what I need, I ask myself if I had to restore my backups to brand new computer or phone, how complicated would it be? So today, we'll be going back to basics with our own script and learn some Unix commands in the process.

## Compression

Compressing the file or directory will not only save on space, but in the case of a directory consolidate it into a single file. There are numerous compression algorithms out there with various tradeoffs between compression ratio and speed, but for my purposes I just want something well supported with a reasonable compression ratio. Candidates include **tar.gz** and **zip**. I like tar.gz because it is ubiquitous with Linux but on the other hand zip is ubiquitous to Windows and probably more common overall. It's simple to create bash functions with either one.

```bash
function targz_compress {
	local input_path="${1?Must provide an input path to compress}"
	local output_path="${2?Must provide an output file path}"
	tar -czvf "${output_path}" "${input_path}"
}

function targz_decompress {
	local input_path="${1?Must provide an input path}"
	local output_path="${2?Must provide an output path}"
	tar -xzvf "${input_path}" -C "${output_path}"
}
```
**Note 1:** The zip versions of these functions will be available in the full script at the end and in the repository. 

## Encryption

Encrypting the compressed file will make it unreadable without the specified key. Again, there are numerous algorithms out there that could work depending on your threat model. Many linux distributions have `gpg` built-in and but even `zip` has a password encryption feature (AES-256).

```bash
function targz_encrypt {
	local input_path="${1?Must provide an input path}"
	local output_path="${2?Must provide an output path}"
	
	gpg --symmetric --cipher-algo AES256 --output "${output_path}" "${input_path}"
}

function targz_decrypt {
	local input_path="${1?Must provide an input path}"
	local output_path="${2?Must provide an output path}"

	gpg --output "${output_path}" --decrypt "${input_path}"
	
}
```

**Note 1:** Make sure to use a strong high-entropy password here. A good way to do this is with a password manager.

**Note 2:** When using password protected zip files, the file paths are not encrypted! This is because each of the files themselves are encrypted within the zip, not the zip data itself. However, this doesn't actually matter here since we put everything into a single archive file in the first step!


## Backup and Restore

At this point we have a few bash functions that can do some solid compression and encryption operations, but its far from useful. Let's make it a little more manageable by linking the operations together into backup and restore functions.

```bash
function make_backup {
	local input_path="${1?Must provide an input path}"
	local output_path="${2?Must provide an output path}"

	local tmp_path="tmp.tar.gz"
	rm -f "${tmp_path}"
	targz_compress "${input_path}" "${tmp_path}"
	targz_encrypt "${tmp_path}" "${output_path}"
	rm -f "${tmp_path}"
}

function restore_backup {
	local input_path="${1?Must provide an input path}"
	local output_path="${2?Must provide an output path}"
	
	local tmp_path="tmp.tar.gz"
	rm -rf "${tmp_path}"
	targz_decrypt "${input_path}" "${tmp_path}"
	targz_decompress "${tmp_path}" "${output_path}"
	rm -rf "${tmp_path}"
}

```
**Note 1:** Currently, these functions put the temp file in the working directory, but that's not great. To make this more robust it should be moved to a real temp file location (using `mktemp`) and removed upon any exit signal so that no lingering unencrypted data is left around. That will be done in the final version of the script.

## Argument Parsing

Next we need a way of interacting with the script. We want it to be as simple as possible, both for our future self to remember what to pass the script and our current self writing the parser.

For example, creating a backup in a specific directory might look like:
```bash
$ backup_tool backup media/ -d ~/backups
```

Similarly, restoring files to a directory from a backup might look like:
```bash
$ backup_tool restore ~/backups/media.tar.gz.gpg -d ~/restored-files
```

We can use familiar Bash constructs to break out the positional arguments and read the option values. This is also a good chance to work in s few improvements. First, batch processing by taking in an array of directories or backup files. Second, a passphrase entry so that it on ly needs to be input once instead of for each item in the batch.

```bash
function parse_args {
	POSITIONAL_ARGUMENTS=()
	CUSTOM_OUTPUT_DIR=''
	ACTION=''
	FILES_TO_PROCESS=()
	ENC_PASSWD=''
	USE_ENC_PASSWD='false'
	while [[ $# -gt 0 ]]; do
		msg "ARG: ${1-}"
	    case "${1-}" in
		    -h | --help) usage ;;
		   	-d | --destination)
		 		CUSTOM_OUTPUT_DIR="${2-}"
		    	shift
		    	if [[ ! -d "${CUSTOM_OUTPUT_DIR}" ]]
		    	then
					msg "${CUSTOM_OUTPUT_DIR} must be an existing directory"
					exit 1
		    	fi
		    	;;
	    	-p) USE_ENC_PASSWD='true';;
		    -?*) die "Unknown option: $1" ;;
		    *) POSITIONAL_ARGUMENTS+=( "${1-}" ) ;;
	    esac
	    shift
  	done
  	if [[ ${#POSITIONAL_ARGUMENTS[@]} -lt 2 ]]
  	then
		die "Must provide more arguments. See usage with --help"
  	fi

	if [[ "${USE_ENC_PASSWD}" == 'true' ]]
	then
  		local tmp_input=''
  		# TODO add logic to handle verifying password AND looping for non matching or empty input
  		read -s -p 'Enter encryption password: ' ENC_PASSWD
  		msg ''
	fi
  	ACTION="${POSITIONAL_ARGUMENTS[0]}"
	FILES_TO_PROCESS=( "${POSITIONAL_ARGUMENTS[@]:1}" )
}
```

## Bringing it all Together

Now that we have our backup functions and argument parsing we can put it all together in the main function. 

```bash
function main {
	if [[ "${ACTION}" != 'backup' && "${ACTION}" != 'restore' ]]
	then
		die 'First argument must be either "backup" or "restore"'
	fi
	for f in "${FILES_TO_PROCESS[@]}"
	do
		if [[ ! -e "${f}" ]]
		then
			msg "${f} must be an existing file or directory"
			exit 1
		fi
		local input_path="${f}"
		local input_filename="$(basename "${input_path}")"
		local input_dir="$(dirname "${input_path}")"
		local output_dir="${CUSTOM_OUTPUT_DIR:-${PWD}}"
		mkdir -p "${output_dir}"
		local timestamp="$(date +"%Y%m%d%H%M" )"
		if [[ "${ACTION}" == 'backup' ]]
		then
			msg "Reading file or directory to archive at: ${input_path}"
			local backup_output_filename="${input_filename}.backup_${timestamp}${BACKUP_EXTENSION}"
			local backup_output_path="${output_dir}/${backup_output_filename}"
			make_backup "${input_path}" "${backup_output_path}"
		   	msg "Backup file created at: ${backup_output_path}"
		elif [[ "${ACTION}" == 'restore' ]]
		then
			restore_backup "${input_path}" "${output_dir}"
			msg "Restored ${input_path} to directory ${output_dir}"
		fi
	done
}
```
That's really all there is to it, in under 250 lines of Bash we have a stellar file backup utility! Check out the [source code](https://github.com/dthigpen/backup) on GitHub for the full script.
