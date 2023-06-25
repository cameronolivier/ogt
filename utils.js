const { messageFallback } = require("./constants");

const cleanupOnError = (branchName) => () => {
  try {
    execSync(`git checkout main`);
    execSync(`git branch -D ${branchName}`);
  } catch (e) {
    log.error(
      `Could not remove branch '${branchName}'. It probably does not exist.`
    );
  }
};

const init = (vaultPath, externalPath) => {
  if (!vaultPath) {
    throw new Error(
      `No vault path provided. Please provide the path to your vault docs. See https://github.com/cameronolivier/ogt for more information`
    );
  }
  if (!externalPath) {
    throw new Error(
      `No external path provided. Please provide the path to your iCloud docs. See https://github.com/cameronolivier/ogt for more information`
    );
  }
};

const logConfig = (config) => {
  log.info(`Configuration from "${config.config}":`);
  log.info(config);
  log.info("-----------------------------------");
};

const createBranch = (branchName) => {
  log.info(`Running: git checkout -b ${branchName}`);
  execSync(`git checkout -b ${branchName}`);
  log.info("Branch created successfully.");
  log.info("-----------------------------------");
};

const copyFiles = (externalPath, vaultPath) => {
  const sourceDir = `"${externalPath}/."`;
  const destinationDir = `"${vaultPath}"`;
  const copyCommand = `cp -R ${sourceDir} ${destinationDir}`;

  log.info(`Running: ${copyCommand}`);
  execSync(copyCommand, (error, stdout, stderr) => {
    if (error) {
      log.error(`exec error: ${error}`);
      return;
    }
    log.info(`stdout: ${stdout}`);
    log.error(`stderr: ${stderr}`);
  });
  log.info("Files copied successfully.");
  log.info("-----------------------------------");
};

const addAndCommitChanges = (message) => {
  log.info(`Running: git add .`);
  execSync("git add .");

  const commitCommand = `git commit -a -m "${message || messageFallback}"`;
  log.info(`Running: ${commitCommand}`);
  execSync(commitCommand);
  log.info("Changes committed successfully.");
  log.info("-----------------------------------");
};

module.exports = {
  cleanupOnError,
  init,
  logConfig,
  createBranch,
  copyFiles,
  addAndCommitChanges,
};
