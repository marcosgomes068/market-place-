const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getOrders);

router.get('/myorders', protect, getMyOrders);

router.get('/:id', protect, getOrderById);

router.put('/:id/pay', protect, updateOrderToPaid);

router.put('/:id/deliver', protect, authorize('admin'), updateOrderToDelivered);

module.exports = router;
