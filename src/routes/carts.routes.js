const {Router}=require('express');
const cartData=require('../init-data/carts.data');
const cartModel=require('../dao/model/cart.model');
const CartManager=require('../dao/managers/cartManager');

class CartRoutes {

    path='/cart';
    router=Router();

    cartManager=new CartManager();

    constructor(){
        this.initCartRoutes();
    }

    initCartRoutes(){
        this.router.get(`${this.path}/insertion`, async(req,res)=>{
            try{
                const carts=await cartModel.insertMany(cartData);
                return res.json({
                    message: "cart massive insert successfully",
                    cartsInserted: carts,  
                })
            }catch(error){
                console.log(error);
            }
        })

        this.router.get(`${this.path}/:cid`,async(req,res)=>{
            try{
                const cartId=req.params.cid;
                console.log(cartId);
                const cart=await this.cartManager.getCartById(cartId);

                if(cart.length===0){
                    return res.status(404).json({
                        ok: true,
                        message: "the cart doesnt exists"
                    })
                }

                return res.status(200).json({
                    ok: true,
                    message: `getCartById`,cart
                });
    
            }catch(error){
                console.log(error);
            }
        })

        this.router.put(`${this.path}/:cid`, async (req, res) => {
            try {
                const cartId = req.params.cid;
                const {productos} = req.body;
        
                await this.cartManager.updateCart({ id: cartId, productos });
                return res.json({ ok: true, message: 'Carrito actualizado correctamente.' });
            } catch (error) {
                console.error('Error en la ruta de actualización del carrito:', error);
                return res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
            }
                 
        });


    }
}

module.exports=CartRoutes;