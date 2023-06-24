#!/usr/bin/env node

const { execSync } = require('node:child_process');
const config = require('rc')('obsidian-git-tools', {
  externalPath: null,
  vaultPath: null,
  message: 'Updating iDrive Vault Docs',
  branchName: 'icloud_docs_merge',
})

try {
  // Create and checkout a new git branch
  execSync(`git checkout -b ${config.branchName}`);

  // Navigate to the iDriveVault directory
  process.chdir(config.externalPath);

  // Copy all files from the source path to the iDriveVault directory
  execSync(`cp -R ${config.vaultPath}/* .`);

  // Go back to the root directory (parent of iDriveVault)
  process.chdir('..');

  // Stage and commit the changes
  execSync('git add .');
  execSync(`git commit -m "${config.commitMessage}"`);

  // Checkout the main branch
  execSync('git checkout main');

  // Merge the new branch into the main branch, overwriting any changes
  execSync(`git merge -X theirs ${config.config.branchName}`);

  // Delete the temporary branch
  execSync(`git branch -D ${config.config.branchName}`);

  // Push the changes to the remote repository
  execSync('git push');
  console.log('Script completed successfully.');
} catch (error) {
  console.error(`Error: ${error.message}`);
  //Cleanup
  // Delete the temporary branch
  execSync(`git branch -D ${config.config.branchName}`);
}
