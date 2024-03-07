const productModel=require('../model/products.model');

const ProductManager= {

    getAllProducts: async()=>{
        try {
            const products=await productModel.find({});
            return products;
        } catch (error) {
            console.log("🚀 ~ ProductManager ~ getAllProducts=async ~ error:", error)
            
        }
    },
    getProductById: async(id) =>{
        try {
            const product=await productModel.find({_id: id});
            return product;
        } catch (error) {
            console.log("🚀 ~ ProductManager ~ getProductById=async ~ error:", error)
        }
    },
    createProduct: async(bodyProduct)=>{
        console.log(bodyProduct)
        try{
            const productDetail=await productModel.findOne({
                id: bodyProduct.id,
            });
            if(productDetail && Object.keys(productDetail).length !==0){
                return null;
            }

            const newProduct=await productModel.create(bodyProduct);
        }catch(error){
            console.log(error);
        }

    },
    async updateProduct(id, product) {
        try {
            const existingProduct = await productModel.findOne({ _id: id });

            if (!existingProduct) {
                return null; // Producto no encontrado
            }


            existingProduct.title = product.title || existingProduct.title;
            existingProduct.description = product.description || existingProduct.description;
            existingProduct.code = product.code || existingProduct.code;
            existingProduct.price = product.price || existingProduct.price;
            existingProduct.status = product.status || existingProduct.status;
            existingProduct.stock = product.stock || existingProduct.stock;
            existingProduct.category = product.category || existingProduct.category;
            existingProduct.thumbnail = product.thumbnail || existingProduct.thumbnail;

            const updatedProduct = await existingProduct.save();
            return updatedProduct;
        } catch (error) {
            console.error("Error en updateProduct:", error);
            throw error;
        }
    }

}

module.exports=ProductManager;