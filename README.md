# Obsidian Git Tools
Tools for working with Obsidian and Git, mostly managing syncing and merging across your computers and devices.

## How to make this work:
1. install the package
```shell
npm install -g ogt
```
2. Create an `.ogtrc`file in your home directory with the following contents:
```
{
  "externalPath": the file directory for your device(iCloud) vault,
  "vaultPath": where you store your docs vault that sinks to git,
  "message": The commit message, defaults to: 'Updating iDrive Vault Docs',
  "branchName": The branch name, defaults to "icloud_docs_merge"
}
```
3. In your docs folder (where you have the git repo for syncing), run `ogt` to sync your iCloud vault with your 
   other vaults.

## How to dev:
1. Clone this repo
2. Run `npm run init` to make the cli script executable and add the `ogt` command to your path (via `npm link`).
3. Create an `.ogtrc`file in your home directory with the following contents:
```
{
  "externalPath": the file directory for your device(iCloud) vault,
  "vaultPath": where you store your docs vault that sinks to git,
  "message": The commit message, defaults to: 'Updating iDrive Vault Docs',
  "branchName": The branch name, defaults to "icloud_docs_merge"
}
```
