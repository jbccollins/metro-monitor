import { exec } from 'child_process';
import { getLastVersion, getVersionedDumpPath } from './paths';
import chalk from 'chalk';
const argv = require("yargs").argv;

const dbname = argv.dbname;

if (!dbname || dbname === "") {
  console.log(chalk.red(`[dbname] not specified. Usage: yarn initdb --dbname my-database\n`));
  process.exit();
}

const version = getLastVersion();
const VERSIONED_DUMP_PATH = getVersionedDumpPath(version);
exec(`psql -f ${VERSIONED_DUMP_PATH} -d ${dbname}`, (err, stdout, stderr) => {
  if (err) {
    console.log(chalk.red(`${err}\n`));
    return;
  }
  console.log(chalk.green(`Database restored from version ${version}`));
})