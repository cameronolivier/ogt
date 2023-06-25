#!/usr/bin/env node

const { execSync } = require('node:child_process');
const messageFallback = 'Updating iDrive Vault Docs';
const config = require('rc')('ogt', {
  externalPath: null,
  vaultPath: null,
  message: messageFallback,
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
  console.log(`Running: git checkout -b ${config.branchName}`)
  execSync(`git checkout -b ${config.branchName}`);
  console.log('Branch created successfully.');

  // Copy all files from the iCloud drive Obsidian folder to the iDriveVault directory
  console.log(`Running: cp -R "${config.vaultPath}/" "${config.externalPath}/*"`)
  execSync(`cp -R "${config.vaultPath}/" "${config.externalPath}/*"`);
  console.log('Files copied successfully.')

  // Stage and commit the changes
  console.log(`Running: git add .`)
  execSync('git add .');
  console.log(`Running: git commit -m "${config.commitMessage || messageFallback}"`)
  execSync(`git commit -m "${config.commitMessage || messageFallback}"`);
  console.log('Changes committed successfully.');

  // Checkout the main branch
  console.log('Running: git checkout main');
  execSync('git checkout main');
  console.log('Checked out main branch successfully.');

  // Merge the new branch into the main branch, overwriting any changes
  console.log(`Running: git merge -X theirs ${config.branchName}`);
  execSync(`git merge -X theirs ${config.branchName}`);
  console.log('Branch merged successfully.')

  // Delete the temporary branch
  console.log(`Running: git branch -D ${config.branchName}`);
  execSync(`git branch -D ${config.branchName}`);
  console.log('Branch deleted successfully.');

  // Push the changes to the remote repository
  console.log('Running: git push');
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
