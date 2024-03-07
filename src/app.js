const express=require('express')
const handlebars=require('express-handlebars');
const mongoose = require("mongoose");
const displayRoutes=require('express-routemap');
const viewsRoutes=require('./routes/views.router');
const productsRoutes=require('./routes/products.routes');
const cartRoutes=require('./routes/carts.routes');

const { mongoDBconnection } = require('./db/mongo.config');
const { Server } = require("socket.io");
const path = require('path');

const PORT=5000;
//const DB_HOST='localhost';
// const DB_HOST='mongodb+srv:';
// url: `mongodb+srv://leguigol:Lancelot1014@cluster0.pz68o51.mongodb.net/`;
const DB_PORT=27017
const DB_NAME='ecommerce'

const API_VERSION='v1';
const API_PREFIX='api';
const viewsPath = path.resolve(__dirname, '../views');
// const staticPath=path.resolve(__dirname,'public');

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const connection = mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
// const connection = mongoose.connect(`${DB_HOST}:${DB_PORT}/${DB_NAME}`)
mongoDBconnection()
    .then((conn)=>{
        console.log('CONNECTION MONGO OK !')
    })
    .catch((err)=>{
        console.log('ERROR EN LA CONECCION A MONGO!');
    })


app.engine("handlebars", handlebars.engine());
// app.set("views", __dirname + "/views");
app.set("views", viewsPath);
app.set("view engine", "handlebars");

app.use(`/static`, express.static(__dirname + "/public"));
// this.app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(`/${API_PREFIX}/${API_VERSION}/views`, viewsRoutes);
app.use(`/${API_PREFIX}/${API_VERSION}/cart`, cartRoutes);
app.use(`/${API_PREFIX}/${API_VERSION}/products`, productsRoutes);

app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Listening on ${PORT}`);
});


