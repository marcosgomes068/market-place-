const { Order, Product, User } = require('../models/sequelize');

exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'Não há itens no pedido' });
    }

    const order = await Order.create({
      userId: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar pedido' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar pedidos' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id }
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Erro ao listar meus pedidos:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar meus pedidos' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }

    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para visualizar este pedido'
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar pedido' });
  }
};

exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar pagamento' });
  }
};

exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Erro ao atualizar entrega:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar entrega' });
  }
};