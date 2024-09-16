module.exports = {
    development: {
      client: 'mysql',
      debug: true,
      connection: {
        host : process.env.MYSQL_CLOUD_HOST,
        port : process.env.MYSQL_PORT,
        user : process.env.MYSQL_CLOUD_USER,         // change to local user
        password : process.env.MYSQL_CLOUD_PASS, // change to local password
        database : process.env.MYSQL_DB
      }
    }
  };