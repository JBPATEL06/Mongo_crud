const express = require('express');
const router = express.Router();
const {
  showInvoices,
  createInvoice,
  deleteInvoice,
  findOneInvoice,
  updateInvoice,
  searchInvoices,
  getUserInvoices
} = require('../controllers/invoice_controller');

router.get('/searchInvoices', searchInvoices);
router.get('/invoices', showInvoices);
router.get('/userInvoices/:email', getUserInvoices);
router.get('/findOneInvoice/:id', findOneInvoice);
router.post('/createInvoice', createInvoice);
router.put('/updateInvoice/:id', updateInvoice);
router.delete('/deleteInvoice/:id', deleteInvoice);

module.exports = router;
