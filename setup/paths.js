import fs from 'fs';
import chalk from 'chalk';
const DUMP_PATH = 'setup/db-version-dumps/dump';
const VERSION_PATH = 'setup/version.txt';

const getVersion = () => {
  const versionString = fs.readFileSync(VERSION_PATH, "utf8");
  const version = Number(versionString); 
  return version;
}

const getLastVersion = () => {
  return getVersion() - 1;
}

const getVersionedDumpPath = version => {
  return `${DUMP_PATH}-${version}.sql`;
};

const incrementVersion = () => {
  const version = getVersion();
  fs.writeFile(VERSION_PATH, `${version + 1}`, function(err) {
    if(err) {
      console.log(chalk.red(`${err}\n`));
    }
    console.log(chalk.green("Version file was updated successfully.\n"));
  }); 
}

export { DUMP_PATH, VERSION_PATH, getVersionedDumpPath, getVersion, getLastVersion, incrementVersion };