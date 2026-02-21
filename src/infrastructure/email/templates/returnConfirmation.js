module.exports = ({ movieTitle, returnedAt }) => ({
  subject: `Devolución confirmada — ${movieTitle}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#222;">
      <h2 style="color:#e94560;">Devolución confirmada</h2>
      <p>Hemos registrado la devolución de tu alquiler:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr>
          <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Película</td>
          <td style="padding:8px;border:1px solid #ddd;">${movieTitle}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Fecha de devolución</td>
          <td style="padding:8px;border:1px solid #ddd;">${returnedAt}</td>
        </tr>
      </table>
      <p style="color:#555;font-size:13px;">
        Solo se te cobrarán los días que disfrutaste de la película.
      </p>
      <p style="color:#555;font-size:13px;">¡Esperamos verte pronto!</p>
    </div>
  `,
});
