const express = require('express');
const router = express.Router();
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');

const options = new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  'https://webpay3gint.transbank.cl'
);

// 1. Crear transacción
router.post('/crear-transaccion', async (req, res) => {
    const { monto } = req.body;
  
    try {
      const buyOrder = 'ORD-' + Math.floor(Math.random() * 100000);
      const sessionId = 'SES-' + Math.floor(Math.random() * 100000);
      const returnUrl = 'http://localhost:3000/webpay/retorno';
  
      const transaction = new WebpayPlus.Transaction(options);
      const response = await transaction.create(buyOrder, sessionId, monto, returnUrl);
  
      // FORMULARIO HTML dinámico que redirige a WebPay
      res.send(`
        <html>
          <body>
            <form id="webpay-form" method="POST" action="${response.url}">
              <input type="hidden" name="token_ws" value="${response.token}" />
              <input type="submit" value="Pagar con WebPay" />
            </form>
            <script>document.getElementById('webpay-form').submit();</script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error al crear transacción:', error);
      res.status(500).json({ error: 'Error al crear transacción con WebPay' });
    }
  });
  
  // 2. Ruta de retorno (después del pago)
  router.post('/retorno', async (req, res) => {
    const token = req.body.token_ws;
  
    try {
      const transaction = new WebpayPlus.Transaction(options);
      const result = await transaction.commit(token);
  
      res.send(`
        <html>
          <body>
            <h2>✅ Pago exitoso</h2>
            <p>Orden: ${result.buyOrder}</p>
            <p>Monto pagado: $${result.amount}</p>
            <p>Estado: ${result.status}</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      res.status(500).send(`
        <html>
          <body>
            <h2>❌ Error al confirmar el pago</h2>
            <p>${error.message}</p>
          </body>
        </html>
      `);
    }
});


// Ruta GET para mostrar después del pago (pantalla final)
router.get('/retorno', (req, res) => {
    res.send(`
      <html>
        <body>
          <h2>✅ Pago procesado</h2>
          <p>Gracias por tu compra. Puedes cerrar esta ventana.</p>
        </body>
      </html>
    `);
});

module.exports = router;