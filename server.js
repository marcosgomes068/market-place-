const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const uploadRoutes = require('./src/routes/upload');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production' && process.env.USE_MONGODB === 'true') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace')
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log('Erro na conexão com MongoDB:', err));
} else {
  console.log('Usando SQLite como banco de dados');
  
  const { testConnection } = require('./src/config/database');
  const db = require('./src/models/sequelize');
    testConnection()
    .then(connected => {
      if (connected) {
        // Forçar recriação do banco para resolver problemas de esquema
        db.syncDatabase(true)
          .then(() => {
            console.log('Banco de dados SQLite recriado e sincronizado');
          })
          .catch(err => {
            console.error('Erro ao sincronizar SQLite:', err);
          });
      }
    });
}

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
