const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  items: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('items') || '[]');
    },
    set(value) {
      this.setDataValue('items', JSON.stringify(value));
    }
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    get() {
      return JSON.parse(this.getDataValue('shippingAddress') || '{}');
    },
    set(value) {
      this.setDataValue('shippingAddress', JSON.stringify(value));
    }
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'creditCard'
  },
  paymentResult: {
    type: DataTypes.TEXT,
    get() {
      return JSON.parse(this.getDataValue('paymentResult') || '{}');
    },
    set(value) {
      this.setDataValue('paymentResult', JSON.stringify(value));
    }
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'O preço total não pode ser negativo' }
    }
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deliveredAt: {
    type: DataTypes.DATE
  }
});

module.exports = Order;
