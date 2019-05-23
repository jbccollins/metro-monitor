/*
  I find that handling requests from the client ends up cluttering up server.js and making it a hot unreadable mess.
  To help deal with that I've pulled that stuff out into this file. If you don't have any endpoints you can safetly
  remove the import/usage of bindEndpoints from server.js :)
*/
import bodyParser from 'body-parser';
import {
  API_GET_DATA,
  API_SET_DATA,
} from './common/constants/urls';

const useBodyParser = app => {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
};

// For simplicity's sake I'm not building out a full database example here.
// Check queries/queries.js for an example of how you would actually store data in a db.
let APP_DATA = "A string of data";

const bindEndpoints = app => {
  useBodyParser(app);

  app.post(API_SET_DATA, (req, res) => {
    const { Data } = req.body;
    APP_DATA = Data;
    res.send({status: "success"});
  });

  app.get(API_GET_DATA, (req, res) => {
    res.send({data: APP_DATA});
  });
};

export default bindEndpoints;