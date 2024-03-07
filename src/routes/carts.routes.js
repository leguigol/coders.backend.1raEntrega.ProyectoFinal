const {Router}=require('express');
const cartData=require('../init-data/carts.data');
const cartModel=require('../dao/model/cart.model');
const CartManager=require('../dao/managers/cartManager');
const router=Router();
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

    // cartManager=new CartManager();
        router.get('/insertion', async (req, res) => {
            try {
                // console.log('cartData:', cartData);
                const carts = await cartModel.insertMany(cartData);
                return res.json({
                    message: "cart massive insert successfully",
                    cartsInserted: carts,
                });
            } catch (error) {
                console.log(error.code);
                return res.status(500).json({
                    ok: false,
                    error: 'Internal server error',
                });
            }
        });

        router.delete('/carts/:cid/products/:pid', async (req, res) => {
            try {
                const cartId = new ObjectId(req.params.cid);
                const productId = req.params.pid;
        
                // Verificar si el carrito existe
                const existingCart = await cartModel.findOne({_id: cartId});
                if (!existingCart) {
                    return res.status(404).json({
                        ok: false,
                        message: 'El carrito no existe.',
                    });
                }
        
                // Filtrar los productos del carrito excluyendo el producto a eliminar
                existingCart.productos = existingCart.productos.filter(item => {
                    return item.producto.toString() !== productId;
                });
        
                // Guardar el carrito actualizado
                await existingCart.save();
        
                return res.json({
                    ok: true,
                    message: 'Producto eliminado del carrito exitosamente.',
                });
            } catch (error) {
                console.error('Error al eliminar producto del carrito:', error);
                return res.status(500).json({
                    ok: false,
                    error: 'Error interno del servidor.',
                });
            }
        });

        router.get('/', async (req, res) => {
            try {
                const Cart = await cartModel.find();
                
                return res.json({
                    status: true,
                    message: 'todos los carritos',
                    Cart
                });
            } catch (error) {
                console.error('Error al actualizar el carrito:', error);
                return res.status(500).json({
                    ok: false,
                    error: 'Error interno del servidor.',
                });
            }
        });

        router.put('/carts/:cid', async (req, res) => {
            try {
                const cartId = req.params.cid;
                const { productos } = req.body;
        
                // Verificar si el carrito existe
                const existingCart = await cartModel.findById(cartId);
                if (!existingCart) {
                    return res.status(404).json({
                        ok: false,
                        message: 'El carrito no existe.',
                    });
                }
        
                // Actualizar los productos del carrito con el nuevo arreglo
                existingCart.productos = productos;
        
                await existingCart.save();
        
                return res.json({
                    ok: true,
                    message: 'Carrito actualizado exitosamente.',
                });
            } catch (error) {
                console.error('Error al actualizar el carrito:', error);
                return res.status(500).json({
                    ok: false,
                    error: 'Error interno del servidor.',
                });
            }
        });

        router.put('/carts/:cid/products/:pid', async (req, res) => {
            try {
                const cartId = req.params.cid;
                const productId = req.params.pid;
                const { quantity } = req.body;
        
                // Verificar si el carrito existe
                const existingCart = await cartModel.findById(cartId);
                if (!existingCart) {
                    return res.status(404).json({
                        ok: false,
                        message: 'El carrito no existe.',
                    });
                }
        
                // Buscar el índice del producto en el carrito
                const productIndex = existingCart.productos.findIndex(item => item.producto.toString() === productId);
        
                // Verificar si el producto está en el carrito
                if (productIndex === -1) {
                    return res.status(404).json({
                        ok: false,
                        message: 'El producto no está en el carrito.',
                    });
                }
        
                // Actualizar la cantidad de ejemplares del producto
                existingCart.productos[productIndex].quantity = quantity;
        
                // Guardar el carrito actualizado
                await existingCart.save();
        
                return res.json({
                    ok: true,
                    message: 'Cantidad de ejemplares actualizada exitosamente.',
                });
            } catch (error) {
                console.error('Error al actualizar la cantidad de ejemplares del producto:', error);
                return res.status(500).json({
                    ok: false,
                    error: 'Error interno del servidor.',
                });
            }
        });

        router.delete('/carts/:cid', async (req, res) => {
            try {
                const cartId = req.params.cid;
        
                // Verificar si el carrito existe
                const existingCart = await cartModel.findById(cartId);
                if (!existingCart) {
                    return res.status(404).json({
                        ok: false,
                        message: 'El carrito no existe.',
                    });
                }
        
                // Eliminar todos los productos del carrito
                existingCart.productos = [];
        
                // Guardar el carrito actualizado
                await existingCart.save();
        
                return res.json({
                    ok: true,
                    message: 'Todos los productos del carrito han sido eliminados.',
                });
            } catch (error) {
                console.error('Error al eliminar todos los productos del carrito:', error);
                return res.status(500).json({
                    ok: false,
                    error: 'Error interno del servidor.',
                });
            }
        });
        
        router.get('/vercarrito/:cid',async(req,res)=>{
            try {
                const cartId=req.params.cid;

                const {carrito}=await cartModel.find({_id: cartId}).populate("productos.producto",{ title:1, description:1, price:1});
                return res.json({
                    message: 'carrito list',
                    carrito,
                });
            } catch (error) {
                console.log("🚀 ~ CartRoutes ~ this.router.ger ~ error:", error)
                
            }
        });

        // this.router.post(`${this.path}/addToCartProduct`,async(req,res)=>{
        //     try {
        //         const { productId, cartId }=req.body;
        //         let carrito=await cartModel.findOne({ _id: cartId });

        //     } catch (error) {
        //         console.log("🚀 ~ CartRoutes ~ this.router.post ~ error:", error)
                
        //     }

        //     carrito.productos.push({ producto: productId });

        //     await cartModel.updateOne({ _id: cartId }, carrito);
        //     return res.json({
        //         message: `el carrito ${cartId} tiene un nuevo producto`,
        //     })
        // })

        // this.router.get(`${this.path}/:cid`,async(req,res)=>{
        //     try{
        //         const cartId=req.params.cid;
        //         console.log(cartId);
        //         const cart=await this.cartManager.getCartById(cartId);

        //         if(cart.length===0){
        //             return res.status(404).json({
        //                 ok: true,
        //                 message: "the cart doesnt exists"
        //             })
        //         }

        //         return res.status(200).json({
        //             ok: true,
        //             message: `getCartById`,cart
        //         });
    
        //     }catch(error){
        //         console.log(error);
        //     }
        // })

        // this.router.put(`${this.path}/:cid`, async (req, res) => {
        //     try {
        //         const cartId = req.params.cid;
        //         const {productos} = req.body;
        
        //         await this.cartManager.updateCart({ id: cartId, productos });
        //         return res.json({ ok: true, message: 'Carrito actualizado correctamente.' });
        //     } catch (error) {
        //         console.error('Error en la ruta de actualización del carrito:', error);
        //         return res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
        //     }
                 
        // });



module.exports=router;