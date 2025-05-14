const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com SQLite estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Não foi possível conectar ao SQLite:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};
