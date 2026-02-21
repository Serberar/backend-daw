const { db }      = require('./client');
const { Product } = require('../../domain/Product');

const toProduct = (r) => new Product(r);

module.exports = {
  findById: (id) =>
    db.product.findUnique({ where: { id } }).then(r => r ? toProduct(r) : null),

  findActiveByUserAndMovie: (userId, movieId) =>
    db.product.findFirst({ where: { userId, movieId, returnedAt: null } }).then(r => r ? toProduct(r) : null),

  findAllByUser: (userId) =>
    db.product.findMany({ where: { userId }, orderBy: { rentedAt: 'desc' } }).then(rs => rs.map(toProduct)),

  findAllActive: () =>
    db.product.findMany({ where: { returnedAt: null } }).then(rs => rs.map(toProduct)),

  create: (product) => db.product.create({
    data: {
      id: product.id, userId: product.userId,
      movieId: product.movieId, movieTitle: product.movieTitle,
      dias: product.dias, rentedAt: product.rentedAt, returnedAt: product.returnedAt,
    },
  }),

  update: (product) => db.product.update({
    where: { id: product.id },
    data:  { returnedAt: product.returnedAt },
  }),
};
