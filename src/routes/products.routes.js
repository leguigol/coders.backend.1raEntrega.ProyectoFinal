const {Router}=require('express');
const productsData=require('../init-data/products.data');
const productModel=require('../dao/model/products.model');
const ProductManager=require('../dao/managers/productManager');

class ProductsRoutes {

    path='/products';
    router=Router();
    productManager=new ProductManager();

    constructor(){
        this.initProductsRoutes();
    }

    initProductsRoutes(){
        this.router.get(`${this.path}/insertion`, async(req,res)=>{
            try{
                const products=await productModel.insertMany(productsData);
                return res.json({
                    message: "products massive insert successfully",
                    productsInserted: products,  
                })
            }catch(error){
                console.log(error);
            }
        })

        //retorna todos los productos
        this.router.get(`${this.path}`,async(req,res)=>{
            try{
                const products=await this.productManager.getAllProducts();
                const limit=parseInt(req.query.limit);
                
                const limitedProducts = !isNaN(limit) && limit > 0
                ? products.slice(0, limit)
                : products;
        
                return res.status(200).json({
                    ok: true,
                    message: `getAllProducts`,products
                });
    
            }catch(error){
                console.log(error);
            }
        })

        //retorna un producto por id
        this.router.get(`${this.path}/:pid`,async(req,res)=>{
            try{
                const productId=req.params.pid;
                console.log(productId);
                const product=await this.productManager.getProductById(productId);

                if(product.length===0){
                    return res.status(404).json({
                        ok: true,
                        message: "the product doesnt exists"
                    })
                }

                return res.status(200).json({
                    ok: true,
                    message: `getProductById`,product
                });
    
            }catch(error){
                console.log(error);
            }
        })
        // agrego producto
        this.router.post(`${this.path}`,async(req,res)=>{
            try{
                const productBody=req.body;

                const newProduct=await this.productManager.createProduct(productBody);
                if(!newProduct){
                    return res.json({
                        message: `El producto con ID: ${productBody.id} ya se encuentra creado`,
                    });
                }
                return res.json({
                    message: 'producto creado correctamente !',
                    product: newProduct,
                });


            }catch(error){
                console.log("🚀 ~ ProductsRoutes ~ this.router.post ~ error:", error)
                
            }
        })
        this.router.put(`${this.path}/:pid`, async (req, res) => {
            try {
                const productId = req.params.pid;
                const updatedData = req.body;
        
                const updatedProduct = await this.productManager.updateProduct(productId, updatedData);
        
                if (!updatedProduct) {
                    return res.status(404).json({
                        message: `El producto con ID: ${productId} no encontrado`,
                    });
                }
        
                return res.json({
                    message: 'Producto actualizado correctamente!',
                    updatedProduct,
                });
            } catch (error) {
                console.error("Error al actualizar producto:", error);
                return res.status(500).json({
                    error: "Internal Server Error"
                });
            }
        });
    }
}

module.exports=ProductsRoutes;