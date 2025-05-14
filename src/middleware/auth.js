const jwt = require('jsonwebtoken');
const { User } = require('../models/sequelize');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Não autorizado para acessar esta rota' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura');

    req.user = await User.findByPk(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ success: false, message: 'Não autorizado para acessar esta rota' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `O papel ${req.user.role} não tem permissão para acessar esta rota`
      });
    }
    next();
  };
};
