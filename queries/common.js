const { Client } = require('pg');

const DEV_CONNECTION_OPTIONS = {
  database: 'my-database',
};

const PRODUCTION_CONNECTION_OPTIONS = {
  // You can find this by running `heroku pg:credentials:url DATABASE` and checking the "Connection URL:" output 
  connectionString: "postgres://a-long-string-of-characters.compute-n.amazonaws.com:PORT/more-characters",
}

const OPTIONS = process.env.NODE_ENV === "production" ? PRODUCTION_CONNECTION_OPTIONS : DEV_CONNECTION_OPTIONS;

const executeQuery = async (sql, params=[], options=OPTIONS) => {
  try {
    const client = new Client(options)
    await client.connect()
    const res = await client.query(sql, params)
    await client.end()
    return ({success: true, rows: res.rows});
  } catch (e) {
    console.log(">>>>>>>>ERROR<<<<<<<<<")
    console.log(e);
    // console.log(">>>>>>>>>SQL<<<<<<<<<<")
    // console.log(sql);
    return ({
      //error: e
      error: true
    });
  }
};

export {
  executeQuery,
};