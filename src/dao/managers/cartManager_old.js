const fs=require('fs').promises;

class CartManager {
    constructor(path){
        this.pathDB=path;
        this.carts=[];
    }

    async getCarts(){
        try{
            const allCarts=await fs.readFile(this.pathDB);
            return JSON.parse(allCarts);
        }catch(error){
            console.log(error);
        }
    }

    async getCartById(cartId) {
        try {
            const allCarts = await this.getCarts();
            const cart = allCarts.carrito.find(cart => cart.id === cartId);
            
            return cart || null; 
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener el carrito por ID.');
        }
    }

    async updateCart(cart) {
        try {
            const allCarts = await this.getCarts();

            // Encuentra el índice del carrito actual en el arreglo
            const existingCartIndex = allCarts.carrito.findIndex(c => c.id === cart.id);

            if (existingCartIndex !== -1) {
                // Si el carrito ya existe, actualiza la información
                allCarts.carrito[existingCartIndex] = cart;
            } else {
                // Si el carrito no existe, agrégalo al arreglo
                allCarts.carrito.push(cart);
            }

            // Escribe la información actualizada en el archivo
            await fs.writeFile(this.pathDB, JSON.stringify(allCarts));
        } catch (error) {
            throw new Error('Error al actualizar el carrito.');
        }
    }

  
}

module.exports=CartManager;