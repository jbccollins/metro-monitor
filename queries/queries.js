/*
  
  Examples of basic database usage. A typical use case would be importing functions from this file
  into bindEndpoints.js and doing something like this:
  
  import { selectData } from "./queries/queries";
  ...
  app.get(API_GET_DATA, async (req, res) => {
    const { Data } = req.query;
    const { rows } = await selectData(Data);
    res.send(rows);
  })

*/
import { executeQuery } from './common';

const selectData = async AnotherColumn => {
  const sql = `SELECT "SomeColumn" FROM some_table WHERE "AnotherColumn" = $1`;
	const queryResults = await executeQuery(sql, [AnotherColumn]);
	return queryResults;
};

const insertData = async (SomeColumn, AnotherColumn) => {
  const sql = `INSERT INTO some_table ("SomeColumn", "AnotherColumn") VALUES ($1, $2)`;
	let queryResults = await executeQuery(sql, [SomeColumn, AnotherColumn]);
	return queryResults;
};

export {
  selectData,
  insertData,
};