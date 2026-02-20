module.exports = ({ url }) => ({
  subject: 'Verifica tu email',
  html: `
    <h2>Bienvenido</h2>
    <p>Haz clic en el enlace para verificar tu cuenta. Caduca en 24h.</p>
    <a href="${url}">Verificar email</a>
  `,
});
