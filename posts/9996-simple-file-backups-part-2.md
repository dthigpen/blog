# Simple File Backups Part 2: Custom Strategies
tags: bash, backup

A while ago I made a [post](https://dthigpen.github.io/blog/simple-file-backups) where I built a simple Bash script to compress and encrypt files for making backups. After using it sporadically, and changing compression/encryption schemes a few times I've made a few updates that I wanted to share (Or skip to the final result on [GitHub](https://github.com/dthigpen/backup)).

Now it's easy to implement a new backup "strategy" using different encryption and compression algorithms. A strategy (or bundle of functions for encryption and compression) can be added to the script, then specified when making backups. For example if I want to use the `targz_gpg` strategy.

```bash
$ ./backup_tool.sh backup /input/dir -d ~/backups -s targz_gpg
$ ./backup_tool.sh restore ~/backups/foo.tar.gz -d ~/output/dir -s targz_gpg
```

## How it Works

As a refresher, the core logic of the script is quite simple. It's only a a two step process for creating a backup file:

1. original file -> `compress()` -> compressed file
2. compressed file -> `encrypt()` -> encrypted file (backup file)

And for restoring a backup its the reverse:

1. backup file -> `decrypt()` -> compressed file
2. compressed file -> `decompress()` -> original file

These operations: compress, decompress, encrypt, decrypt always do the same thing, the difference lies in the algorithms used for that operation. While the original script is simple enough to update with a different set of compression and encryption algorithms, it wasn't baked into the design (or as much as you can design in a Bash script anyway).

Now, its as simple as registering a new strategy with functions each of the four operations. From there the strategy can be called out as an argument to the script. Let's go over how it works.

Strategies are registered like this:

```bash
# unix tar.gz and gpg strategy
register_strategy "targz_gpg" targz_compress targz_decompress gpg_encrypt gpg_decrypt ".tar.gz.gpg"
# universal zip and enc zip strategy
register_strategy "zip_zipenc" zip_compress zip_decompress zip_encrypt zip_decrypt ".zip"
```

The `register_strategy` function takes in an identifier for the strategy, e.g. `targz_gpg`, the four operation functions, and a file extension (appended when creating backups). In terms of Bash data structures, it's simply a bunch of associative arrays for each argument:

```bash
declare -A COMPRESS_FUNCS
declare -A DECOMPRESS_FUNCS
declare -A ENCRYPT_FUNCS
declare -A DECRYPT_FUNCS
declare -A EXTENSIONS

# Register a strategy (compression + encryption)
# usage: register_strategy name compress decompress encrypt decrypt extension
function register_strategy() {
  local name=$1
  shift
  COMPRESS_FUNCS["$name"]=$1
  shift
  DECOMPRESS_FUNCS["$name"]=$1
  shift
  ENCRYPT_FUNCS["$name"]=$1
  shift
  DECRYPT_FUNCS["$name"]=$1
  shift
  EXTENSIONS["$name"]=$1
}
```
Once stored, we can now index into them by the name of the strategy to perform our operations. Now the compression and encryption functions become simple wrappers for executing the strategy passed into the script and stored under `$BACKUP_STRATEGY`.

```bash
function compress() { ${COMPRESS_FUNCS[$BACKUP_STRATEGY]} "$@"; }
function decompress() { ${DECOMPRESS_FUNCS[$BACKUP_STRATEGY]} "$@"; }
function encrypt() { ${ENCRYPT_FUNCS[$BACKUP_STRATEGY]} "$@"; }
function decrypt() { ${DECRYPT_FUNCS[$BACKUP_STRATEGY]} "$@"; }
function get_ext() { echo "${EXTENSIONS[$BACKUP_STRATEGY]}"; }
```

## What's Next

There isn't much more I plan to add since this tool already meets my specific needs but if I get the itch, I might expand it in these areas:

- Allow adding strategies from Bash session or environment: Useful so others would not need to modify the code of the backup tool to use their own strategies.
- Adding a "convert" command to convert backup files from one strategy to another without having to manually restore and re-backup each of them.

See the full changes on [GitHub](https://github.com/dthigpen/backup) and feel free to add an issue or pull request with your own suggestions!
