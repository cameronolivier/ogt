# Obsidian Git Tools
Tools for working with Obsidian and Git, mostly managing syncing and merging across your computers and devices.

## How to make this work:
1. Clone this repo
2. Run `npm run init` to make the cli script executable and add the `ogt` command to your path (via `npm link`).
3. Create an `.obsidian-git-toolsrc`file in your home directory with the following contents:
```
{
  "externalPath": the file directory for your device(iCloud) vault,
  "vaultPath": where you store your docs vault that sinks to git,
  "message": The commit message, defaults to: 'Updating iDrive Vault Docs',
  "branchName": The branch name, defaults to "icloud_docs_merge"
}
```
