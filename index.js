#!/usr/bin/env node

const { execSync } = require('node:child_process');
const config = require('rc')('ogt', {
  externalPath: null,
  vaultPath: null,
  message: 'Updating iDrive Vault Docs',
  branchName: 'icloud_docs_merge',
})

try {
  if (!config.vaultPath) {
    throw new Error(`No vault path provided. Please provide the path to your vault docs. See https://github.com/cameronolivier/ogt for more information`);
  }
  if (!config.externalPath) {
    throw new Error(`No external path provided. Please provide the path to your iCloud docs. See https://github.com/cameronolivier/ogt for more information`);
  }

  const currentDir = process.cwd();

  // Create and checkout a new git branch
  execSync(`git checkout -b ${config.branchName}`);

  // Copy all files from the iCloud drive Obsidian folder to the iDriveVault directory
  execSync(`cp -R "${config.vaultPath}/" "${config.externalPath}/*"`);

  // Stage and commit the changes
  execSync('git add .');
  execSync(`git commit -m "${config.commitMessage}"`);

  // Checkout the main branch
  execSync('git checkout main');

  // Merge the new branch into the main branch, overwriting any changes
  execSync(`git merge -X theirs ${config.branchName}`);

  // Delete the temporary branch
  execSync(`git branch -D ${config.branchName}`);

  // Push the changes to the remote repository
  execSync('git push');
  console.log('Script completed successfully.');
} catch (error) {
  console.error(`Error: ${error.message}`);
  //Cleanup
  // Delete the temporary branch
  try {
    execSync(`git checkout main`);
    execSync(`git branch -D ${config.branchName}`);
  }
  catch (e) {
    console.error(`Could not remove branch '${config.branchName}'. It probably does not exist.`)
  }
}
