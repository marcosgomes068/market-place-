const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, adicione um título'],
    trim: true,
    maxlength: [100, 'Título não pode ter mais que 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor, adicione uma descrição'],
    maxlength: [1000, 'Descrição não pode ter mais que 1000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Por favor, adicione um preço'],
    min: [0, 'Preço não pode ser negativo']
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: [0, 'Preço de desconto não pode ser negativo']
  },
  category: {
    type: String,
    required: [true, 'Por favor, selecione uma categoria'],
    enum: [
      'electronics',
      'clothing',
      'books',
      'home',
      'beauty',
      'sports',
      'toys',
      'other'
    ]
  },
  images: {
    type: [String],
    default: ['no-image.jpg']
  },
  stock: {
    type: Number,
    required: [true, 'Por favor, adicione a quantidade em estoque'],
    min: [0, 'Estoque não pode ser negativo'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Avaliação mínima é 0'],
    max: [5, 'Avaliação máxima é 5']
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, 'Número de avaliações não pode ser negativo']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
