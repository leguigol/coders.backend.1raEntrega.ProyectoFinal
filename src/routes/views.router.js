// import { Router } from "express";
const { Router } = require("express");
const path = require("path");

const router = Router();

const ProductManager = require('../dao/managers/productManager');
const productModel=require('../dao/model/products.model');
const CartModel = require("../dao/model/cart.model");
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// const pathBase = path.join(__dirname, '../productos.json');
// const pM = new ProductManager(pathBase);


router.get("/", async (req, res) => {
  try {
      const products = await ProductManager.getAllProducts();
      res.render("home", products );
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get("/realtimeproducts", async(req, res) => {
  const products = await productModel.find();
  res.render("realTimeProducts", { productos: products.productos });
});

router.get("/products", async(req, res) => {
  try{
    const { page = 1, limit=10 , campo, valor, sort }=req.query;

    const filter = campo ? { [campo]: valor } : {};
    let vsort = sort === 'ASC' ? 1 : -1;
    const options= { page: parseInt(page), limit: parseInt(limit), sort: { price: vsort }, lean: true};

    const {
      docs,
      totalDocs,
      limit: limitPag,
      totalPages,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage
    }=await productModel.paginate(filter,options);

    res.render('products', {
        products: docs,
        page: parseInt(page),
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

});

router.get('/products/cate',async(req,res)=>{
  try{
      const { campo, valor, sort,page = 1, limit = 10 }=req.query;
      
      const filter = campo ? { [campo]: valor } : {};
    
      let vsort = sort === 'ASC' ? 1 : -1;
  
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { price: vsort },
      };
  
      const {
        docs,
        totalDocs,
        limit: limitPag,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
      }= await productModel.paginate(filter,{ options, lean:true });
  
      res.render('productsCate', {
        products: docs,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        nextPage: nextPage,
        prevPage: prevPage,
        prevLink: hasPrevPage ? `/products/cate?page=${prevPage}` : null,
        nextLink: hasNextPage ? `/products/cate?page=${nextPage}` : null,
      });

  }catch(error){
      console.log(error);
  }
})


router.get('/product/:pid',async(req,res)=>{
  try{
    // console.log((req.params.pid).toString())
    const xvar=(req.params.pid).trim();
    
    const productId =(new ObjectId(xvar));
    if(ObjectId.isValid(productId)){
      const doc=await productModel.findOne({_id: productId});
      return res.render('productDetail', doc);
    }else{
      console.log('no es un objectId de mongoose')
    }

  }catch(error){
      console.log(error);
  }
})

router.get('/carts/:cid', async (req, res) => {
  try {
    const cartId =new ObjectId((req.params.cid).trim());

    const carrito = await CartModel.findOne({_id: cartId}).populate('productos.producto').lean();

    //console.log(carrito)
    // const totalProducts = carrito.productos.length;

    return res.render('cart', carrito);
  } catch (error) {
      console.error('Error al obtener el carrito con productos y paginación:', error);
      return res.status(500).json({
          ok: false,
          error: 'Error interno del servidor.',
      });
  }
});

router.get('/carts', async (req, res) => {
  try {
      const cart = await CartModel.find().lean();
      console.log(cart)
      return res.render('carts', cart);
  } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      return res.status(500).json({
          ok: false,
          error: 'Error interno del servidor.',
      });
  }
});

module.exports= router;