# Obsidian Git Tools
Tools for working with Obsidian and Git, mostly managing syncing and merging across your computers and devices.

## How to make this work:
1. install the package
```shell
npm install -g @cameronolivier/ogt
```
2. Create an `.ogtrc`file in your home directory
3. In your docs folder (where you have the git repo for syncing), run `ogt` to sync your iCloud vault with your 
   other vaults.

## How to dev:
1. Clone this repo
2. Run `npm run init`. This makes the cli script executable and adds the `ogt` command to your path (via `npm link`).
3. Create an `.ogtrc`file in your home directory.

## Creating an `.ogtrc` file
Create an `.ogtrc` file in your home directory with the following contents:
```
{
  "externalPath": the file directory for your device(iCloud) vault,
  "vaultPath": where you store your docs vault that sinks to git,
  "message": (Optional) The commit message, defaults to: 'Updating iDrive Vault Docs',
  "branchName": (Optional) The branch name, defaults to "icloud_docs_merge",
  "verbose": (Optional) true or false, defaults to false for whether to log out progress to the console.
}
```
