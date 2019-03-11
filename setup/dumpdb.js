import { exec } from 'child_process';
import { getVersionedDumpPath, getVersion, incrementVersion, VERSION_PATH } from './paths';
import chalk from 'chalk';
const argv = require("yargs").argv;

const dbname = argv.dbname;

if (!dbname || dbname === "") {
  console.log(chalk.red(`[dbname] not specified. Usage: yarn dumpdb --dbname my-database\n`));
  process.exit();
}

const VERSIONED_DUMP_PATH = getVersionedDumpPath(getVersion());

exec(`pg_dump --schema-only --no-owner ${dbname} > ${VERSIONED_DUMP_PATH}`, (err, stdout, stderr) => {
  if (err) {
    console.log(chalk.red(`${err}\n`));
    return;
  }
  console.log(chalk.green(`Database successfully dumped to ${VERSIONED_DUMP_PATH}\n`));
  incrementVersion();
  return 0;
});