const productRepo  = require('../../../infrastructure/db/productRepo');
const userRepo     = require('../../../infrastructure/db/userRepo');
const emailService = require('../../../infrastructure/email/emailService');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function returnProduct ({ userId, productId }) {
  const product = await productRepo.findById(productId);
  if (!product)                    throw err('Alquiler no encontrado', 404);
  if (product.userId !== userId)   throw err('No autorizado', 403);
  if (!product.isActive())         throw err('Esta película ya fue devuelta', 400);

  product.return();
  await productRepo.update(product);

  const user = await userRepo.findById(userId);
  if (user) {
    const fecha = new Date(product.returnedAt).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
    await emailService.send(user.email, 'returnConfirmation', {
      movieTitle: product.movieTitle,
      returnedAt: fecha,
    });
  }

  return { id: product.id, movieTitle: product.movieTitle, returnedAt: product.returnedAt };
};
