const express = require('express');
const router = express.Router();
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');

const options = new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  'https://webpay3gint.transbank.cl'
);

router.post('/crear-transaccion', async (req, res) => {
  const { monto } = req.body;

  try {
    const buyOrder = 'ORD-' + Math.floor(Math.random() * 100000);
    const sessionId = 'SES-' + Math.floor(Math.random() * 100000);
    const returnUrl = 'http://localhost:3000/webpay/retorno';

    const response = await new WebpayPlus.Transaction(options).create(
      buyOrder,
      sessionId,
      monto,
      returnUrl
    );

    res.json({
      url: response.url,
      token: response.token
    });
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ error: 'Error al crear transacción con WebPay' });
  }
});

module.exports = router;