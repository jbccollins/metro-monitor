## About

I use the same basic set of stuff in almost all my React projects. So here's my bootstrapped thing for them.

### Notable Dependencies/Features
* Redux (Application state management)
* react-router (I don't usually use this but it's useful sometimes)
* DirectoryNamedWebpackPlugin (A personal pet peeve of mine is using index.js for every component)
* babel-preset-react-app (Enable all those juicy ES6 features)
* Concurrent Server and Client in the same project with no configuration bullshit
* Hot reloading
* Configured to work by default with the free tier of heroku

## Installation

```bash
yarn rebuild
```

## Get started

```bash
yarn dev
```

## Scripts
| Script | Description |
|---|---|
| rebuild | Nuke the client and server node_modules then reinstall everything |
| dev | Concurrently run the client and server in development mode |
| start | Default heroku command to run a node app. Not useful when developing |
| postinstall | Default heroku command to build the client. Not useful when developing |

This boilerplate is built using [create-react-app](https://github.com/facebookincubator/create-react-app) so you will want to read the User Guide for more goodies.