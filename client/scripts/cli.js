#!/usr/bin/env node	

 // USAGE: yarn generate --type container|component --name CoolContainer	

 const chalk = require("chalk");	
const argv = require("yargs").argv;	
const fs = require("fs");	

 const COMPONENT = "component";	
const CONTAINER = "container";	
const COMPONENT_PATH = "./src/components/";	
const CONTAINER_PATH = "./src/containers/";	

 const name = argv.name;	
const type = argv.type;	

 console.log(chalk.cyan(`Generating ${type} ${name}...\n`));	

 const componentString = `	
import React from "react";	
import PropTypes from "prop-types";	
import "./${name}.scss";	
 class ${name} extends React.Component {	
  render() {	
    return (	
      <div className="${name}">	
        ${name}	
      </div>	
    );	
  }	
}	
 ${name}.propTypes = {	
  	
};	
 export default ${name};	
`.trim();	

 const cssString = `	
.${name} {	
 }	
`.trim();	

 const containerString = `	
import React from "react";	
import PropTypes from "prop-types";	
import { bindActionCreators } from "redux";	
import { connect } from "react-redux";	
import "./${name}.scss";	
 class ${name} extends React.Component {	
  render() {	
    return (	
      <div className="${name}">	
        ${name}	
      </div>	
    );	
  }	
}	
 ${name}.propTypes = {	
  	
};	
 const mapStateToProps = state => ({	
 });	
 const mapDispatchToProps = dispatch =>	
  bindActionCreators(	
    {	
      	
    },	
    dispatch	
  );	
 export default connect(	
  mapStateToProps,	
  mapDispatchToProps	
)(${name});	
`.trim();	

 if (type === COMPONENT) {	
  const dir = `${COMPONENT_PATH}${name}`;	

   if (!fs.existsSync(dir)) {	
    fs.mkdirSync(dir);	
  }	
  fs.writeFile(`${dir}/${name}.js`, componentString, function(err) {	
    if (err) {	
      return console.log(chalk.red(err));	
    }	
    fs.writeFile(`${dir}/${name}.scss`, cssString, function(err) {	
      if (err) {	
        return console.log(chalk.red(err));	
      }	
      console.log(chalk.green(`Finished!`));	
    });	
  });	
} else if (type === CONTAINER) {	
  const dir = `${CONTAINER_PATH}${name}`;	

   if (!fs.existsSync(dir)) {	
    fs.mkdirSync(dir);	
  }	
  fs.writeFile(`${dir}/${name}.js`, containerString, function(err) {	
    if (err) {	
      return console.log(chalk.red(err));	
    }	
    fs.writeFile(`${dir}/${name}.scss`, cssString, function(err) {	
      if (err) {	
        return console.log(chalk.red(err));	
      }	
      console.log(chalk.green(`Finished!`));	
    });	
  });	
}