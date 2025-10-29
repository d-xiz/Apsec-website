const express = require('express');
const router = express.Router();

const { memberSignup, memberLogin } = require('../Controller/authFunctions');
const { authenticate, authorizeRoles } = require('../Controller/authMiddleware');

// Public routes

router.post('/auth/register-admin', (req, res) => {
  memberSignup(req, res, 'admin');
}); 
router.post('/auth/register-shopowner', (req, res) => {
  memberSignup(req, res, 'ShopOwner');
});

router.post('/auth/register-buyer', (req, res) => {
  memberSignup(req, res, 'buyer');
});

router.post('/auth/register-inventorymanager', (req, res) => {
  memberSignup(req, res, 'inventorymanager');
});
// --------- LOGIN ROUTES ------------
router.post("/auth/login-admin", (req, res) => memberLogin(req, res, "admin"));
router.post("/auth/login-shopowner", (req, res) => memberLogin(req, res, "ShopOwner"));
router.post("/auth/login-buyer", (req, res) => memberLogin(req, res, "buyer"));
router.post("/auth/login-inventorymanager", (req, res) => memberLogin(req, res, "inventorymanager"));


// Role-protected routes examples
router.get('/admin/dashboard', authenticate, authorizeRoles(['admin']), (req, res) => {
  res.send('admin dashboard');
});

router.get('/shopowner/products', authenticate, authorizeRoles(['ShopOwner']), (req, res) => {
  res.send('ShopOwner products');
});

router.get('/buyer/orders', authenticate, authorizeRoles(['buyer']), (req, res) => {
  res.send('buyer orders');
});

router.get('/inventorymanager/tasks', authenticate, authorizeRoles(['inventorymanager']), (req, res) => {
  res.send('inventory manager tasks');
});

module.exports = router;
