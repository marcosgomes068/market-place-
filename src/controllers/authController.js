const { User } = require('../models/sequelize');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Tentando registrar usuário:', { name, email, role });

    const userExists = await User.findOne({ where: { email } });
    
    if (userExists) {
      console.log('Email já cadastrado:', email);
      return res.status(400).json({ success: false, message: 'Email já cadastrado' });
    }

    console.log('Criando usuário no banco de dados SQLite');
    
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    
    console.log('Usuário criado com sucesso:', user.id);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Erro detalhado ao registrar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Informe email e senha' });
    }

    const user = await User.findOne({ 
      where: { email },
      attributes: { include: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao obter dados do usuário' });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
