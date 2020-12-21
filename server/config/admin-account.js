const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const initAdminAccount = async () => {
  const axiosConfig = {
    baseURL: `http://localhost:${process.env.PORT}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  };

  const adminAccount = await loadAccountDetails();

  axios
    .get('/users/count', axiosConfig)
    .then(res => {
      if (res.status === 200 && res.data.body.length === 0) return;
      else throw 'admin account init is not available';
    })
    .then(() => {
      return axios.post('/users', adminAccount, axiosConfig);
    })
    .then(res => console.log(res.data.msg))
    .catch(error => console.log(error));
};

async function loadAccountDetails() {
  let data, contents;
  try {
    contents = fs.readFileSync(path.join(process.cwd(), 'admin-account.yml'), 'utf8');
    data = yaml.safeLoad(contents);
  } catch (e) {
    return console.log('unable to read admin account config file ', e);
  }
  return data.administrator;
}

module.exports = { initAdminAccount };
