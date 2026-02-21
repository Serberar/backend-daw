const { Product }  = require('../../../domain/Product');
const productRepo  = require('../../../infrastructure/db/productRepo');
const userRepo     = require('../../../infrastructure/db/userRepo');
const emailService = require('../../../infrastructure/email/emailService');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function rent ({ userId, movieId, movieTitle, dias }) {
  const existing = await productRepo.findActiveByUserAndMovie(userId, movieId);
  if (existing) throw err('Ya tienes alquilada esta película', 409);

  const product = Product.create({ userId, movieId, movieTitle, dias });
  await productRepo.create(product);

  const user = await userRepo.findById(userId);
  if (user) {
    await emailService.send(user.email, 'rentConfirmation', {
      movieTitle,
      dias,
      total: dias * 2,
    });
  }

  return { id: product.id, movieId: product.movieId, movieTitle: product.movieTitle, dias: product.dias, rentedAt: product.rentedAt };
};
