# A Google Photos Exit Strategy
tags: backup, bash, rsync, localhost

For a while now I've been more closely examining my online digital footprint. Part of that has been weighing the benefits of various services with the personal data I hand over to them. In the case of Google Photos, they act as my offsite backup for all the photos and videos I take on my phone. If my phone were to drown in the river today, I wouldn't have to worry about losing any memories, that's a nice peace of mind to have. As a platform, though, Google Photos offers much more than that: automatic creating of albums for people and pets, searching by picture content, a print store, and some AI enhancement tools. I've hardly touched those in the many years I've been using the service. So is it really worth it? I think not. Today, I'm beginning the process of removing my dependency on Google Photos, starting at the most basic of solutions. Eventually, we'll work up to some full-blown Photos alternatives.

## Preface

If you are thinking about doing this, don't be like me and wait until you get the Google storage message of doom!

> *Almost out of storage (95% used). If you run out, you can’t back up photos, or send and receive email in Gmail.*

The last thing you want is to have to rush through this stuff without fully understanding it.

## Personal Requirements

The plan outlined here is pretty specific to me. You might need a more robust Google Photos alternative like Immich or Synology Photos. We'll explore those in a future post. For now, I only seek an to answer the question: "What is the minimal solution I need to backup the photos on my phone to somewhere else on my network?". My criteria were simple:

- Must be able to copy photos from device(s) to another device
- Must be relatively hands off and low-friction
- Must use tech that I already have

## Core Components

At a minimum, the core components are:

- A server to act as the backup destination
- A client application to initiate a backup from client to server
- A transfer mechanism utilized by the client and server

### The Server (Photo Backup Destination)

Given these minimal requirements the server can basically be anything: an old Android phone, a Raspberry Pi, a Mini-PC, a NAS. I was fortunate enough to have a small Synology NAS that I wasn't utilizing for much. Since they are built to either be always-on or follow a power schedule, it would be more than robust enough. The NAS software also makes it trivial to setup things like SMB, SSH, and external USB backups. Since these things are common among many different NAS OSes, I'll describe what I configured in general.

- Proper users and groups for better security
- A folder for the backups e.g. `/backups/photos/`
- SMB - For easy access while on the network
- SSH - For rsync to use, customized for security and limited access
- An external USB backup, so that I can make occasional backups to it and take them off-site somewhere

### The Client (Phone Application)

A quick search pointed me toward [PhotoSync](https://www.photosync-app.com/home), a well known player in this space. I initially went this route, opting to utilize SMB as the transfer method between PhotoSync and the NAS, since I already had that set up, but performance was abysmal. At this point, I should have attempted SFTP, but combined with the general clunkiness of the PhotoSync app experience, I searched elsewhere. One method that was sure to provide speed would be `rsync`. This is where [Termux](https://termux.dev/en/) comes in. The Termux environment is as close to a full Linux experience as you can get on Android, and the best part is that it doesn't require root. In this case, a quick `pkg install rsync` in the Termux terminal got me what I needed. The next section will detail the exact `rsync` command that we need.

Right now, its a bit involved to execute a backup. You have to open the Termux app, then hand type out the path to the executable Bash script with the rsync command. Which this works, its far from hands-off. In order to make this a hands-off process I use another app that I already have installed: [Tasker](https://tasker.joaoapps.com/) as well as the [Termux Tasker Plugin](https://github.com/termux/termux-tasker) to bridge the two. To summarize, Tasker is an immensely powerful automation app. There are few things not solvable with Tasker, hence why I've had it on all my phones for about a decade now. The Termux Tasker Plugin simply adds an Action to Tasker to be able to execute scripts automatically. With that in place I created a simple profile that boils down to something like this pseudo-code:

```python
if wifi_network == "MyHomeNetwork" and time == '21:00':
  execute_termux_script('backup_phone.sh')
```

Note: There are some limitations to the scripts that can get executed by the Termux plugin from Tasker. As a result I had to create a wrapper script in a special Termux folder for Tasker to call. The script that Tasker executes cannot have a shebang like `#!usr/bin/env bash` and must instead have the direct path to Termux Bash. For example:

```bash
#!/data/data/com/termux/files/usr/bin/bash
set -euo pipefail
bash ~/path/to/backup_phone.sh
```

With that in place, the only part remaining is the actual content of the script.

### Rsync Script

I want a one-way sync from the phone to the server, meaning any photo or video on the phone and not on the server will be copied up. In other words, anything that exists on the phone, will exist on the server (but not always vice versa). This is the Bash code that does this:

```bash
# Fill in variables with your own values, for example:
NAS_PORT='22'
LOCAL_DIRS_ARR=( ~/storage/shared/DCIM ~/storage/shared/another-folder )
NAS_HOST='192.168.0.123'
REMOTE_DIR='/backups/photos/phone-name/'

rsync -avh --partial \
  -e "ssh -p $NAS_PORT" \
  "${LOCAL_DIRS_ARR[@]}" \
  "$NAS_USER@$NAS_HOST:$REMOTE_DIR/"
```

There are numerous enhancements you could do here. For example, loading values from .env files instead of hardcoding them, or adding a dry-run flag. You can see the modifications I made on [GitHub](https://github.com/dthigpen/localhosting/blob/dev/backup/backup_phone.sh).

## Time for Takeout

With that in place and tested a few times, the last thing we need to do is perform a [Google Takeout](https://takeout.google.com/) with all our existing Google Photos content. For me this was around 13GB and could be downloaded in several 2GB zip files. Once downloaded, I copied them over to the NAS, unzipped, and merged their folders all together before putting them in their `backups/photos/phone_name/` home.

With a backup system in place and all existing photos exported, its now safe to delete the Google Photos app. 🎉

## Limitations

This approach is very obviously a "Phase 1" (or zero) solution. One glaring aspect is that the syncing is limited to a dumb one-way sync. Meaning that if you want to delete a few old photos, you are stuck doing it twice, once on the phone to prevent it from being copied over to the NAS, and again on the NAS since there will be an already copied version over there. Alternatively, you can delete them from the phone before the sync hits.

## Next Steps

Even with its trade-offs, this is not a bad solution in the short term. We were able to cobble something together with very simple components and understand each detail about it. There's something extremely valueable about being able to fully understand a system in the complexity of today's software. That being said, some added complexity would give us a few niceties. For myself, my next step is to look into more robust self-hosted Photos alternative. Whenever that happens, I'll make a follow up post detailing the results.
