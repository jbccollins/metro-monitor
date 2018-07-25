## About
A live filterable map of the DC Metro system. Features train positions, station arrival predictions and WMATA alerts all in once place! 

Check it out here: https://www.dcmetromonitor.com

![image of weather monitor](https://i.imgur.com/dnT4Ug7.png)

## Installation

```bash
yarn rebuild
```

## Development

First get a WMATA API Key from here: https://developer.wmata.com/

```bash
API_KEY=<YOUR_WMATA_API_KEY> yarn dev
```

## Scripts
| Script | Description |
|---|---|
| rebuild | Nuke the client and server node_modules then reinstall everything |
| dev | Concurrently run the client and server in development mode |
| start | Default heroku command to run a node app. Not useful when developing |
| postinstall | Default heroku command to build the client. Not useful when developing |

## Publishing

```bash
git push heroku master
```

This boilerplate is built using [create-react-app](https://github.com/facebookincubator/create-react-app) so you will want to read the User Guide for more goodies.
