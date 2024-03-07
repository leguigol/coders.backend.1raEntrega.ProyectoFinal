const mongoose = require('mongoose');
const mongoosePaginateV2=require('mongoose-paginate-v2');
const ObjectId = mongoose.Types.ObjectId

const collectionName = 'Products';

const productSchema=new mongoose.Schema({
    // _id: ObjectId,
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    }
});

productSchema.plugin(mongoosePaginateV2);

const productModel=mongoose.model(collectionName,productSchema);

module.exports=productModel;
