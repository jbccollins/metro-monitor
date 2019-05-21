import find from 'find-process';
import chalk from 'chalk';
// Hot reloading after recovering from a broken build (most commonly triggered by saving a file that has invalid jsx in it) does not
// kill the previous node app that crashed. Most of the code in here exists to gracefully kill the crashed app so that the
// terminal isn't constantly spammed with meaningless errors.
const runApp = (app, port) => {
  let portConflictResolutionAttempted = false;
  const start = () => {
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
      setTimeout(start, 100);
    } else {
      console.log(chalk.red('[server] Not killing conflicting apps because in production mode.'));
    }
  }
  start();
}

export default runApp;