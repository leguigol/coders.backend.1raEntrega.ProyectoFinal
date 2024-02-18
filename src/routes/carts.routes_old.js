const { Router }=require('express');
const CartManager=require('../cartManager');
const path = require('path');
const pathBase=path.join(__dirname,'../carrito.json');

const cM = new CartManager(pathBase);

const router=Router();

router.get(`/`, async(req,res)=>{
    try{

        const carrito=await cM.getCarts();
        return res.json({
            carrito
        })
    }catch(error){
        console.log(error);
    }
});

router.get(`/:cid`, async(req,res)=>{
    try {

        const cartId = parseInt(req.params.cid);
        
        if (isNaN(cartId)) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número válido.' });
        }

        const cart = await cM.getCartById(cartId);

        if(!cart){
            return res.json({
                ok: true,
                message: `no existe el carrito con el id ${cartId}`,
                cart,
                queryParams: req.query,
            });
        }

        const productsInCart = cart.productos || []

        return res.json({
            ok: true,
            message: `carrito id: ${cartId}`,
            products: productsInCart
        });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

router.post('/:cid/product/:pid', async (req, res) => {
    try {

        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        
        if (isNaN(cartId) || isNaN(productId)) {
            return res.status(400).json({ error: 'Los IDs del carrito y del producto deben ser números válidos.' });
        }

        const cart = await cM.getCartById(cartId);

        if (!cart) {
            return res.status(404).json({ error: `No se encontró ningún carrito con el ID ${cartId}.` });
        }

        const existingProductIndex = cart.productos.findIndex(product => product.id === productId);

        if (existingProductIndex !== -1) {
            // El producto ya existe en el carrito, incrementar la cantidad
            cart.productos[existingProductIndex].quantity++;
        } else {
            // El producto no existe en el carrito, agregarlo
            const newProductEntry = {
                id: productId,
                quantity: 1
            };
            cart.productos.push(newProductEntry);
        }

        // Actualizar carrito
        await cM.updateCart(cart);

        res.json({
            ok: true,
            message: `Producto con ID ${productId} agregado al carrito con ID ${cartId}`,
            cart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports=router;