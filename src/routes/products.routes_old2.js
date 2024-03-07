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
                const { page = 1, limit=10 , query, sort }=req.query;
                
                const {
                    docs,
                    totalDocs,
                    limit: limitPag,
                    totalPages,
                    hasPrevPage,
                    hasNextPage,
                    nextPage,
                    prevPage
                }=await productModel.paginate({},{ page, limit, lean:true });
                
                return res.status(200).json({
                    status: true,
                    message: `getAllProducts`,
                    payload: docs,
                    limit: limit,
                    page: parseInt(page),
                    total: totalDocs,
                    totalPages: totalPages,
                    hasPrevPage: hasPrevPage,
                    hasNextPage: hasNextPage,
                    nextPage: nextPage,
                    prevPage: prevPage,
                    prevLink: hasPrevPage ? `/products?page=${prevPage}` : null,
                    nextLink: hasNextPage ? `/products?page=${nextPage}` : null,
                });
    
            }catch(error){
                console.log(error);
            }
        })
        //filtra por categoria y ordena
        this.router.get(`${this.path}/cate`,async(req,res)=>{
            try{
                const { campo, valor, sort }=req.query;
                
                const filter = campo ? { [campo]: valor } : {};
                
                let vsort=1
                if(sort==='ASC'){
                    vsort=1 
                }else{
                    vsort=-1
                };

                const sorted= sort ? { price: vsort} : {};

                const result = await productModel.find(filter).sort(sorted);

                return res.status(200).json({
                    status: true,
                    message: `getProductbyField`,
                    payload: result,
                });
    
            }catch(error){
                console.log(error);
            }
        })

        //retorna un producto por id
        // this.router.get(`${this.path}/:pid`,async(req,res)=>{
        //     try{
        //         const productId=req.params.pid;
        //         console.log(productId);
        //         const product=await this.productManager.getProductById(productId);

        //         if(product.length===0){
        //             return res.status(404).json({
        //                 ok: true,
        //                 message: "the product doesnt exists"
        //             })
        //         }

        //         return res.status(200).json({
        //             ok: true,
        //             message: `getProductById`,product
        //         });
    
        //     }catch(error){
        //         console.log(error);
        //     }
        // })
        // agrego producto
        // this.router.post(`${this.path}`,async(req,res)=>{
        //     try{
        //         const productBody=req.body;

        //         const newProduct=await this.productManager.createProduct(productBody);
        //         if(!newProduct){
        //             return res.json({
        //                 message: `El producto con ID: ${productBody.id} ya se encuentra creado`,
        //             });
        //         }
        //         return res.json({
        //             message: 'producto creado correctamente !',
        //             product: newProduct,
        //         });


        //     }catch(error){
        //         console.log("🚀 ~ ProductsRoutes ~ this.router.post ~ error:", error)
                
        //     }
        // })
        // this.router.put(`${this.path}/:pid`, async (req, res) => {
        //     try {
        //         const productId = req.params.pid;
        //         const updatedData = req.body;
        
        //         const updatedProduct = await this.productManager.updateProduct(productId, updatedData);
        
        //         if (!updatedProduct) {
        //             return res.status(404).json({
        //                 message: `El producto con ID: ${productId} no encontrado`,
        //             });
        //         }
        
        //         return res.json({
        //             message: 'Producto actualizado correctamente!',
        //             updatedProduct,
        //         });
        //     } catch (error) {
        //         console.error("Error al actualizar producto:", error);
        //         return res.status(500).json({
        //             error: "Internal Server Error"
        //         });
        //     }
        // });
        
        this.router.get(`${this.path}/vistaproductos`,async(req,res)=>{
            const { page = 1, limit=10 , query, sort }=req.query;
            
            const {
                docs,
                totalDocs,
                limit: limitPag,
                totalPages,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage
            }=await productModel.paginate({},{ page, limit, lean:true });
            

            return res.render('products', {
                products: docs,
                page: parseInt(page),
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                nextPage: nextPage,
                prevPage: prevPage,
                prevLink: hasPrevPage ? `/products?page=${prevPage}` : null,
                nextLink: hasNextPage ? `/products?page=${nextPage}` : null,
            });  
        });      


    }
}

module.exports=ProductsRoutes;