const path = require("path");
const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
// const __dirname = path.resolve();  
const viewsRouter = require("./routes/views.router.js");

const productosRoutes=require('./routes/products.routes');
const carritoRoutes=require('./routes/carts.routes');

const ProductManager=require('./dao/managers/productManager.js');

const app=express();
const PORT=8080;
const API_PREFIX='api';

const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", viewsRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(`/${API_PREFIX}/products`,productosRoutes);
app.use(`/${API_PREFIX}/cart`,carritoRoutes);

const allProducts=[];
const pathBase=path.join(__dirname,'./productos.json');
const pM=new ProductManager(pathBase);

io.on('connection', (socket) => {
    console.log("Nuevo cliente conectado: ", socket.id);
    
    setInterval(async () => {
        const products = await pM.getProducts();
        io.emit('set-products', products.productos);
            
    }, 1000); 

    socket.on('eliminar-producto', async(data)=>{
        try
        {
            await pM.deleteProduct(Number(data.id));
        
            console.log('Producto eliminado correctamente:', data);

        }catch(error){
            console.log('error al borrar producto');
        }
    })

    socket.on('agregar-producto', async(data)=>{
        try{
            const newProduct=(data);
            await pM.createProduct(newProduct);
            console.log(newProduct);
        }catch(error){
            console.log('error al agregar el producto');
        }
    })

});    
