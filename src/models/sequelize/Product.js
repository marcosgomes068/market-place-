const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Por favor, informe um nome para o produto' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Por favor, informe uma descrição para o produto' }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'O preço deve ser um valor decimal' },
      min: { args: [0], msg: 'O preço não pode ser negativo' }
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Por favor, informe uma categoria' }
    }
  },
  brand: {
    type: DataTypes.STRING
  },
  countInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'A quantidade em estoque não pode ser negativa' }
    }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'A avaliação não pode ser negativa' },
      max: { args: [5], msg: 'A avaliação não pode ser maior que 5' }
    }
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'O número de avaliações não pode ser negativo' }
    }
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: 'images/placeholder.jpg'
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Product;
