const cartModel=require('../model/cart.model');

class CartManager {


    getAllCarts=async()=>{
        try {
            const carts=await cartCarts.find({});
            return carts;
        } catch (error) {
        console.log("🚀 ~ CartManager ~ getAllCarts=async ~ error:", error)        
        }
    }
    // getCartById=async(id) =>{
    //     try {
    //         const cart=await cartModel.find({_id: id});
    //         return cart;
    //     } catch (error) {
    //         console.log("🚀 ~ cartManager ~ getcartById=async ~ error:", error)
    //     }
    // }
    // async updateCart(cart) {
    // try {
    //     // Busca el carrito por ID
    //     const existingCart = await cartModel.findOne({ id: cart.id });

    //     if (existingCart) {
    //         existingCart.productos = cart.productos;
    //         await existingCart.save();
    //     } else {
    //         return null
    //     }

    //     console.log('Carrito actualizado correctamente.');
    // } catch (error) {
    //     console.error('Error al actualizar el carrito:', error);
    //     throw new Error('Error al actualizar el carrito.');
    // }
}


module.exports=CartManager;