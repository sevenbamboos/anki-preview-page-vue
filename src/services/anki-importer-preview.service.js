import * as axios from 'axios';

const BASE_URL = 'http://localhost:8080';

function upload(formData) {

  const url = `${BASE_URL}/upload`;

  return axios.post(url, formData)
    .catch(err => {
      if (err.request && err.request.response) {
        const response = JSON.parse(err.request.response);
        if (response && response.status && response.message) {
          const status = response.status;
          if (status === 404 || status === 500) {
            throw response.message;
          }
        }
      }
      throw err;
    });
}

function list() {

  const url = `${BASE_URL}/files`;

  return axios.get(url)
    .then(x => x.data)
    .catch(err => {
      throw err;
    });
}

function getGroups(fileName, question) {

  const url = `${BASE_URL}/groups`;

  return axios.get(url, { params: {fileName, question} })
    .then(x => x.data)
    .catch(err => {
      throw err;
    });
}

function output(fileName, question) {

  const url = `${BASE_URL}/output`;

  return axios.get(url, { params: {fileName, question} })
    .then(x => x.data)
    .catch(err => {
      throw err;
    });
}

function clear() {

  const url = `${BASE_URL}/clear`;

  return axios.get(url)
    .then(x => x.data)
    .catch(err => {
      throw err;
    });
}
export { upload, list, getGroups, clear, output }