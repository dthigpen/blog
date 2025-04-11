#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# This is the site output dir
BUILD_DIR="build"
# Temp commit message that will be removed after
TMP_COMMIT_MSG="Temporary commit for subtree"

# Build the site
# "${SCRIPT_DIR}/bic" .

if [[ ! -d "${BUILD_DIR}" ]]
then
	echo "Output dir does not exist: ${BUILD_DIR}"
	exit 1
fi

# Force-add the ignored folder
git add -f build

# Commit if needed (you can do this on a throwaway branch or stash it afterward)
git commit -m "${TMP_COMMIT_MSG}"

# Push using subtree
if git subtree split --prefix "${BUILD_DIR}" -b gh-pages-temp
then
	ret=$?
	# Force push it to the gh-pages branch on origin
	git push -f origin gh-pages-temp:gh-pages
	
	# Clean up local temp branch
	git branch -D gh-pages-temp
else
	ret=$?
fi
last_msg="$(git log -1 --pretty=format:%B)"

if [[ "${last_msg}" == "${TMP_COMMIT_MSG}" ]]
then
	echo 'Undoing last temporary commit'
	git reset HEAD~
else
    echo "Something failed. Last commit was not temporary deploy commit"
fi

exit $ret


