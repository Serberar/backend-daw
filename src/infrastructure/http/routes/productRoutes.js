const { Router }    = require('express');
const rent          = require('../../../application/use-cases/product/rent');
const returnProduct = require('../../../application/use-cases/product/return');
const productRepo   = require('../../db/productRepo');
const authMiddleware = require('../authMiddleware');

const fail = (err, res) => res.status(err.status || 500).json({ error: err.message });

const router = Router();

router.post('/rent', authMiddleware, async (req, res) => {
  const { movieId, movieTitle, dias } = req.body ?? {};
  if (!movieId || !movieTitle || !dias)
    return res.status(400).json({ error: 'movieId, movieTitle y dias son requeridos' });
  try { return res.status(201).json(await rent({ userId: req.userId, movieId, movieTitle, dias })); }
  catch (err) { return fail(err, res); }
});

router.patch('/:id/return', authMiddleware, async (req, res) => {
  try { return res.json(await returnProduct({ userId: req.userId, productId: req.params.id })); }
  catch (err) { return fail(err, res); }
});

router.get('/history', authMiddleware, async (req, res) => {
  try { return res.json(await productRepo.findAllByUser(req.userId)); }
  catch (err) { return fail(err, res); }
});

module.exports = router;
