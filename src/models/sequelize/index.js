const { sequelize } = require('../../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Modelos sincronizados com o banco de dados SQLite');
    
    if (force) {
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      
      console.log('Dados iniciais adicionados ao banco de dados');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Product,
  Order
};
