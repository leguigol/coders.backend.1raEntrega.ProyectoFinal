const { Router }=require('express');
const ProductManager=require('../dao/managers/productManager');
const path = require('path');
const pathBase=path.join(__dirname,'../productos.json');

// const pM=new ProductManager(pathBase);

const router=Router();

router.get(`/`, async(req, res)=>{
    try{
        const pM=new ProductManager(pathBase);

        let products=await pM.getProducts();
        
        let limitedProducts;
        const limit=parseInt(req.query.limit);
        
        if (!isNaN(limit) && limit > 0) {
            // Validar y aplicar el límite si es proporcionado
            limitedProducts = products.productos.slice(0, limit);
        } else {
            // Si no hay límite o el límite no es válido, devolver todos los productos
            limitedProducts = products;
        }

        return res.json({
            ok: true,
            productos: limitedProducts,
        });
    }catch(error){
        res.status(500).json({error: error.message});        
    }
});

router.get(`/:productId`, async(req,res)=>{
    try {
        const pM=new ProductManager(pathBase);
        const productId = parseInt(req.params.productId);

        if (isNaN(productId)) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número válido.' });
        }

        const product = await pM.getProductById(productId);

        if(!product){
            return res.json({
                ok: true,
                message: `no existe el producto con el id ${productId}`,
                producto,
                queryParams: req.query,
            });
        }
    
        return res.json({
            ok: true,
            message: `producto id: ${productId}`,
            product
        });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

router.post(`/`, async(req,res)=>{
    try{
        const pM=new ProductManager(pathBase);
        const product=req.body

        const {title,description,code,price,status,stock,category}=product;
     
        if (!title || !description || !code || !price || !status || !stock || !category){
            res.status(400).json({
                ok: false,
                error: `falta campo obligatorio`
            })
        }
        
        const newProduct = await pM.createProduct(product);
    
        res.json({
            ok: true,
            message: "producto creado",
            usuario: newProduct
        });    
    }catch(error){
        res.status(500).json({ error: error.message });       
    }
});

router.put(`/:pid`, async(req, res)=>{

    try{
        const pM=new ProductManager(pathBase);

        const productId=Number(req.params.pid);
        
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número válido.' });
        }

        const existingProduct = await pM.getProductById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: `No se encontró ningún producto con el ID ${productId}.` });
        }  

        const updatedProduct = { ...existingProduct, ...req.body };

        await pM.updateProduct(productId, updatedProduct);

        res.json({
            ok: true,
            message: `Producto con ID ${productId} actualizado`,
            producto: updatedProduct
        });
    }catch(error){
        res.status(500).json({ error: error.message });       
    }


})

router.delete(`/:pid`, async(req,res)=>{
    try{
        const pM=new ProductManager(pathBase);

        const productId=Number(req.params.pid);
        
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número válido.' });
        }

        const existingProduct = await pM.getProductById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: `No se encontró ningún producto con el ID ${productId}.` });
        }  

        await pM.deleteProduct(productId);

        res.json({
            ok: true,
            message: `Producto con ID ${productId} eliminado`
        });

    }catch(error){
        res.status(500).json({ error: error.message });       
    }
})
module.exports=router;