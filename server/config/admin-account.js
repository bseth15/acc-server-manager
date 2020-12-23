const axios = require('axios').default;

const { APP_INIT_ADMIN_ACCOUNT, APP_INIT_ADMIN_PASSWORD, APP_INIT_ADMIN_EMAIL } = process.env;

const initAdminAccount = async () => {
  if (APP_INIT_ADMIN_ACCOUNT && APP_INIT_ADMIN_PASSWORD && APP_INIT_ADMIN_EMAIL) {
    const axiosConfig = {
      baseURL: `http://localhost:${process.env.PORT}`,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    };

    // check if any users already exist
    axios
      .get('/users/count', axiosConfig)
      .then(res => {
        if (res.status !== 200) throw 'unable to contact admin account init';
        else if (res.data.body.length !== 0)
          throw 'admin account init is unavailable, a user account already exists';
        else return;
      })
      .then(() => {
        return axios.post(
          '/users',
          {
            username: APP_INIT_ADMIN_ACCOUNT,
            password: APP_INIT_ADMIN_PASSWORD,
            email: APP_INIT_ADMIN_EMAIL,
            role: 'administrator',
            authorized: true,
          },
          axiosConfig
        );
      })
      .then(() => console.log(`successfully created account for ${APP_INIT_ADMIN_ACCOUNT}`))
      .catch(error => console.log(error));
  } else {
    console.log('admin account details not set, skipping initialization');
  }
};

module.exports = { initAdminAccount };
