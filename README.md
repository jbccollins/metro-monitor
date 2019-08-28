## About

A live filterable map of the DC Metro system. Features train positions, station arrival predictions and WMATA alerts all in once place! 

Check it out here: https://www.dcmetromonitor.com

![image of metro monitor](https://i.imgur.com/dnT4Ug7.png)

Bootstrapped from [my-personal-starter-react-setup](https://github.com/jbccollins/my-personal-starter-react-setup).
Read the docs there about more scripts and goodies you can use when developing this project.

## Installation

```bash
yarn rebuild
```

## Development

First get a WMATA API Key from here: https://developer.wmata.com/

```bash
API_KEY=<YOUR_WMATA_API_KEY> yarn dev
```

## Publishing

```bash
git push -f heroku master
```