// import { Router } from "express";
const { Router } = require("express");
const path = require("path");

const router = Router();

const ProductManager = require('../productManager');
const pathBase = path.join(__dirname, '../productos.json');
const pM = new ProductManager(pathBase);


router.get("/", async (req, res) => {
  try {
      const products = await pM.getProducts();
      res.render("index", { productos: products.productos });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get("/realtimeproducts", async(req, res) => {
  const products = await pM.getProducts();
  res.render("realTimeProducts", { productos: products.productos });
});

module.exports= router;