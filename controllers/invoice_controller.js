const Invoice = require('../models/invoice');

const createInvoice = async (req, res) => {
  try {
    const weight = req.body.weight;
    const price = req.body.price;
    const total = weight * price;

    const invoice = new Invoice({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      weight: weight,
      price: price,
      total: total
    });

    const savedInvoice = await invoice.save();
    res.json(savedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findOneInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const invoice = await Invoice.findById(id);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const showInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const invoices = await Invoice.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, phone, weight } = req.body;

    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const price = req.body.price || existingInvoice.price;
    const newWeight = weight !== undefined ? weight : existingInvoice.weight;
    const total = newWeight * price;

    const updateData = {
      username: username || existingInvoice.username,
      phone: phone || existingInvoice.phone,
      weight: newWeight,
      price: price,
      total: total
    };

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchInvoices = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const invoices = await Invoice.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { showInvoices, findOneInvoice, createInvoice, updateInvoice, deleteInvoice, searchInvoices };
