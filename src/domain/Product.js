const crypto = require('crypto');

class Product {
  constructor ({ id, userId, movieId, movieTitle, dias, rentedAt, returnedAt }) {
    this.id         = id;
    this.userId     = userId;
    this.movieId    = movieId;
    this.movieTitle = movieTitle;
    this.dias       = dias;
    this.rentedAt   = rentedAt;
    this.returnedAt = returnedAt ?? null;
  }

  static create ({ userId, movieId, movieTitle, dias }) {
    return new Product({
      id: crypto.randomUUID(),
      userId, movieId, movieTitle, dias,
      rentedAt: new Date(),
      returnedAt: null,
    });
  }

  isActive ()  { return this.returnedAt === null; }
  return ()    { this.returnedAt = new Date(); }
}

module.exports = { Product };
