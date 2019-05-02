import express from 'express';
import path from 'path';
import find from 'find-process';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const DEFAULT_PORT = 5001;
const port = process.env.PORT || DEFAULT_PORT;
let portConflictResolutionAttempted = false;

const runApp = () => {
  app.listen(port, () => console.log(chalk.green(`[server] Listening on port ${port}`)))
      .on('error', e => {
        if (!portConflictResolutionAttempted) {
          console.log(chalk.yellow(`[server] Encountered a port conflict. Attempting to clear port ${port}.`))
          killConflictingApps();
        } else {
          console.log(chalk.red(`[server] Unable to listen on port ${port}:`));
          console.log(chalk.red(e));
        }
      });
}
const killConflictingApps = async () => {
  portConflictResolutionAttempted = true;
  if (process.env.NODE_ENV !== "production") {
    const list = await find('port', port);
    if (!list.length) {
      console.log(chalk.green(`[server] Port ${port} is free :)`));
    } else {
      list.forEach(({pid, name}) => {
        if (pid !== process.pid) {
          console.log(chalk.cyan(`[server] Killing process ${name} due to conflict on port ${port}.`));
          process.kill(pid);
        }
      })
    }
    // process.kill does not happen immediately so we need to wait just a bit before
    // actually trying to run again.
    setTimeout(runApp, 100);
  } else {
    console.log(chalk.red('[server] Not killing conflicting apps because in production mode.'));
  }
}

runApp();

app.use(express.static(__dirname + '/client/build'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});