const { Product, User } = require('../models/sequelize');
const { Op } = require('sequelize');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy } = req.query;
    
    const whereClause = {};
    
    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`
      };
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (minPrice) {
      whereClause.price = {
        ...whereClause.price,
        [Op.gte]: parseFloat(minPrice)
      };
    }
    
    if (maxPrice) {
      whereClause.price = {
        ...whereClause.price,
        [Op.lte]: parseFloat(maxPrice)
      };
    }
    
    const orderOptions = [];
    if (sortBy === 'price-asc') {
      orderOptions.push(['price', 'ASC']);
    } else if (sortBy === 'price-desc') {
      orderOptions.push(['price', 'DESC']);
    } else if (sortBy === 'newest') {
      orderOptions.push(['createdAt', 'DESC']);
    } else if (sortBy === 'rating') {
      orderOptions.push(['rating', 'DESC']);
    }
    
    const products = await Product.findAll({
      where: whereClause,
      order: orderOptions,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar produtos' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar produto' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    req.body.sellerId = req.user.id;
    
    const product = await Product.create(req.body);
    
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar produto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    if (product.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para atualizar este produto'
      });
    }
    
    product = await product.update(req.body);
    
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar produto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    if (product.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para excluir este produto'
      });
    }
    
    await product.destroy();
    
    res.status(200).json({ success: true, message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir produto' });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Erro na busca de produtos:', error);
    res.status(500).json({ success: false, message: 'Erro na busca de produtos' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        stock: {
          [Op.gt]: 0
        }
      },
      limit: 6,
      order: [['rating', 'DESC']],
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos em destaque' });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    
    const products = await Product.findAll({
      where: {
        category: categoryName
      },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos por categoria' });
  }
};