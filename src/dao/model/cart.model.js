const mongoose = require('mongoose');
const mongoosePaginateV2=require('mongoose-paginate-v2');

const collectionName = 'Carts';

// const productoSchema = new mongoose.Schema({
//     id: { type: Number, required: true },
//     quantity: { type: Number, required: true }
// });

const carritoSchema = new mongoose.Schema({
    // id: { type: Number, required: true},
    // productos: [productoSchema]
    productos: {
        type: [
            {
                producto: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                },
                quantity: { type: Number }
            },
        ],
        default: []    
    },
});

carritoSchema.pre("find",function(){
    this.populate("productos.producto");
});

carritoSchema.plugin(mongoosePaginateV2);

const CartModel = mongoose.model(collectionName, carritoSchema);

module.exports=CartModel;
