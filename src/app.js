const express=require('express');

const productosRoutes=require('./routes/products.routes');
const carritoRoutes=require('./routes/carts.routes');

const app=express();
const PORT=8080;
const API_PREFIX='api';

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(`/${API_PREFIX}/products`,productosRoutes);
app.use(`/${API_PREFIX}/cart`,carritoRoutes);


app.listen(PORT,()=>{
    console.log(`RUNNING SERVER ON PORT: ${PORT}`);
})
