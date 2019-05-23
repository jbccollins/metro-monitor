import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import "./DemoComponent.scss";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    margin: theme.spacing.unit,
    width: '400px',
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class DemoComponent extends React.Component {
  state = {
    tempData: ""
  }
  handleChange = e => {
    this.setState({tempData: e.target.value})
  }
  render() {
    const { classes, data, onClick } = this.props;
    const { tempData } = this.state;
    console.log(data);
    return (
      <div className="DemoComponent">
        <div className="input-container">
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="h5" component="h3">
              Simple Reducer Example:
            </Typography>
            <Button
              className={classes.button}
              variant="contained"
              onClick={onClick}
              color="secondary"
            >
              Change Background Color
            </Button>
          </Paper>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="h5" component="h3">
              Complex Reducer Example:
            </Typography>
            <Typography component="p">
              Current Data From Server:
            </Typography>
            {data && !data.fetching && !data.error &&
              <Typography>
                {data.data}
              </Typography>
            }
            <TextField
              label="Set New Data"
              value={tempData}
              onChange={this.handleChange}
              multiline
              rowsMax="20"
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <div>
              <Button
                className={classes.button}
                variant="contained"
                onClick={this.props.onClick}
                color="secondary"
              >
                Set Data
              </Button>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

DemoComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default withStyles(styles)(DemoComponent);