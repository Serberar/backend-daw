
const { Router } = require('express');
const register    = require('../../../application/use-cases/user/register');
const login       = require('../../../application/use-cases/user/login');
const verifyEmail = require('../../../application/use-cases/user/verifyEmail');
const updateUser  = require('../../../application/use-cases/user/updateUser');
const userRepo       = require('../../db/userRepo');
const authMiddleware = require('../authMiddleware');

const fail = (err, res) => res.status(err.status || 500).json({ error: err.message });

const router = Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, dni, phone, address, cardNumber, email, password } = req.body ?? {};
  if (!firstName || !lastName || !dni || !phone || !address || !cardNumber || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try { return res.status(201).json(await register({ firstName, lastName, dni, phone, address, cardNumber, email, password })); }
  catch (err) { return fail(err, res); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'Email y contrasena requeridos' });
  try { return res.json(await login({ email, password })); }
  catch (err) { return fail(err, res); }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token requerido' });
  try { return res.json(await verifyEmail({ token })); }
  catch (err) { return fail(err, res); }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await userRepo.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, dni: user.dni, phone: user.phone, address: user.address, email: user.email, isEmailVerified: user.isEmailVerified });
  } catch (err) { return fail(err, res); }
});

router.patch('/me', authMiddleware, async (req, res) => {
  const { firstName, lastName, phone, address } = req.body ?? {};
  try { return res.json(await updateUser({ userId: req.userId, firstName, lastName, phone, address })); }
  catch (err) { return fail(err, res); }
});

module.exports = router;
