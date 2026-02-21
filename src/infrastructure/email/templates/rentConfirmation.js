module.exports = ({ movieTitle, dias, total }) => ({
  subject: `Confirmación de alquiler — ${movieTitle}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#222;">
      <h2 style="color:#e94560;">¡Alquiler confirmado!</h2>
      <p>Gracias por tu alquiler. Aquí tienes el resumen:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr>
          <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Película</td>
          <td style="padding:8px;border:1px solid #ddd;">${movieTitle}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Días contratados</td>
          <td style="padding:8px;border:1px solid #ddd;">${dias} días</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Total</td>
          <td style="padding:8px;border:1px solid #ddd;">${total}€</td>
        </tr>
      </table>
      <p style="color:#555;font-size:13px;">
        💡 Si devuelves la película antes de que finalice el periodo contratado,
        solo se te cobrarán los días de disfrute.
      </p>
      <p style="color:#555;font-size:13px;">¡Disfruta de la película!</p>
    </div>
  `,
});
