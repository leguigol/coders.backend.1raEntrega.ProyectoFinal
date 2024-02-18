const mongoose = require('mongoose');

const collectionName = 'cart';

const productoSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const carritoSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    productos: [productoSchema]
});

const CartModel = mongoose.model(collectionName, carritoSchema);

module.exports=CartModel;
