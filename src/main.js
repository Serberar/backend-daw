
const { port } = require('./config');
const app        = require('./infrastructure/http/app');
const productRepo = require('./infrastructure/db/productRepo');
const userRepo    = require('./infrastructure/db/userRepo');
const emailService = require('./infrastructure/email/emailService');

async function autoReturn () {
  const activos = await productRepo.findAllActive()
  const now = Date.now()
  for (const rental of activos) {
    const expiry = new Date(rental.rentedAt).getTime() + rental.dias * 24 * 60 * 60 * 1000
    if (expiry <= now) {
      rental.return()
      await productRepo.update(rental)
      const user = await userRepo.findById(rental.userId)
      if (user) {
        const fecha = new Date(rental.returnedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
        await emailService.send(user.email, 'returnConfirmation', { movieTitle: rental.movieTitle, returnedAt: fecha })
      }
    }
  }
}

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
  autoReturn()
  setInterval(autoReturn, 24 * 60 * 60 * 1000)
});
