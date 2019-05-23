
import fetch from "isomorphic-fetch";

import {
	API_GET_DATA,
	API_SET_DATA,
} from "common/constants/urls";

const GET_REQUEST_PARAMS = {
  method: "GET",
  headers: {
    Accept: "application/json"
  }
};

const POST_REQUEST_PARAMS = {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json"
	}
};

const getData = async () => {
  let res = await fetch(API_GET_DATA, GET_REQUEST_PARAMS);
  res = await res.json();
  return res;
};

const setData = async Data => {
	const params = {
		...POST_REQUEST_PARAMS,
		body: JSON.stringify({ Data })
	};
	let res = await fetch(API_SET_DATA, params);
	res = await res.json();
	return res;
};

export {
	getData,
	setData,
};