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

## Troubleshooting
If you use `n` to manage your node versions then you might run into an issue where you are prompted to allow incoming connections everytime you start up the server. To fix this do this:
```bash
# remove current entry in firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --remove /usr/local/bin/node && \
# copy current node from n
cp -pf /usr/local/n/versions/node/$(node -v | cut -d 'v' -f 2)/bin/node /usr/local/bin && \
# add to firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
```
###### From: https://github.com/tj/n/issues/394#issuecomment-359570847

Then restart your terminal.

This boilerplate is built using [create-react-app](https://github.com/facebookincubator/create-react-app) so you will want to read the User Guide for more goodies.
