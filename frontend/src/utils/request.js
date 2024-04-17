import { message } from 'antd';

const BaseHost = 'http://localhost:5005';

const defaultOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

function get (url) {
  return (
    fetch(`${BaseHost}${url}`, {
      ...defaultOptions,
      headers: {
        ...defaultOptions.headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        message.error(error.message);
      }));
}

function post (url, data) {
  return (
    fetch(`${BaseHost}${url}`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        ...defaultOptions.headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        message.error(error.message);
      }));
}

function put (url, data) {
  return (
    fetch(`${BaseHost}${url}`, {
      ...defaultOptions,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        ...defaultOptions.headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        message.error(error.message);
      }));
}

const http = {
  get,
  post,
  put,
};
export default http;
