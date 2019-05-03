## About

I use the same basic set of stuff in almost all my React projects. So here's my bootstrapped thing for them.

### Notable Dependencies/Features
* [Redux](https://redux.js.org/) (Application state management)
* [react-router](https://github.com/ReactTraining/react-router) (Single page app with url management)
* [DirectoryNamedWebpackPlugin](https://github.com/shaketbaby/directory-named-webpack-plugin) (A personal pet peeve of mine is using index.js for every component)
* [babel-preset-react-app](https://www.npmjs.com/package/babel-preset-react-app) (Enable all those juicy ES6 features)
* Concurrent Server and Client in the same project with no configuration bullshit
* Hot reloading
* [Material UI](https://github.com/mui-org/material-ui) (God it's so nice)
* Configured to work by default with the free tier of heroku
* A basic component/container CLI generation. (See the CLI section for more details)
* Basic db structure dump/initialization scripts for postgres

## Installation

```bash
yarn rebuild
```

## Get started

```bash
yarn dev
```

## Scripts
#### Common
| Script | Description |
|---|---|
| dev | Concurrently run the client and server in development mode. Most common command |
| rebuild | Delete both server and client node_modules, then reinstall everything |
| <span style="color: red">dangerously-rebuild</span> | Delete both server and client node_modules <span style="color: red">and lock files</span>, then reinstall everything |
| generate | Invoke my custom CLI. See the CLI section below for details |
| force-build | Trigger a build of the client. Useful for testing webpack changes |
| initdb | Restore a database schema from the latest backup. See the database section below. |
| dumpdb | Backup a database schema. See the database section below. |
| <span style="color: red">force-publish</span> | Reset remote heroku database and publish to heroku master. See the database section below |

#### Helper scripts
You should rarely, if ever, need to run these scripts directly.

| Script | Description |
|---|---|
| client | Runs the client react app. You should never need to run this directly |
| start | Default heroku command to run a node app. Not useful when developing |
| server | Runs the node express server. You should never need to run this directly |
| postinstall | Default heroku command to build the client. Not useful when developing |
| <span style="color: red">nuke-dependencies</span> | Delete both server and client node_modules <span style="color: red">and lock files</span>. You should never need to run this directly |
| delete-dependencies | Delete both server and client node_modules. You should never need to run this directly |

## CLI
The command line interface is a work in progress but for now there are two options:

| Script | Description |
|---|---|
| `yarn generate --type container --name CoolContainer` | Generates a new Redux wrapped container in `client/src/containers` |
| `yarn generate --type component --name CoolComponent` | Generates a new component in `client/src/components` |

In the future I plan to add action/reducer generation as well

## Database
[PostgreSQL](https://www.postgresql.org/) is what I usually use for my database stuff. I've written a few scripts to mitigate the annoying stuff that you need to do to make heroku and postgres work together.

| Script | Description | Usage |
|---|---|---|
| dumpdb | Dumps the schema (NOT THE DATA) of a database to a `.sql` file | `yarn dumpdb --dbname my-db` |
| initdb | Reads the latest dumped schema `.sql` file and initializes a database. | `yarn initdb --dbname my-db` |
| <span style="color: red">force-publish</span> | Reset remote heroku database and publish to heroku master. <br>Your remote postgres db will be wiped and set to whatever your development db contains. <br> <span style="color: red">NEVER DO THIS TO A PRODUCTION SITE!</span> | `yarn force-publish` |

As of now I have no production sites using postgres. When I inevitably need one I will make more scripts to manage that stuff in a safer manner.

## Syncing Up a Clone

```bash
git remote add upstream https://github.com/jbccollins/my-personal-starter-react-setup.git
git fetch upstream
git checkout master
git rebase upstream/master
```

## Troubleshooting
Heroku builds will sometimes fail because Heroku likes to cache your node_modules. You can force Heroku to reinstall your node_modules using

```bash
heroku config:set NODEMODULESCACHE=false
git push heroku master
heroku config:unset NODEMODULESCACHE
```


## Acknowledgement

This boilerplate for the client is built using an ejected [create-react-app](https://github.com/facebookincubator/create-react-app) so you will want to read the User Guide for more goodies.
