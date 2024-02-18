const App=require("./app");
const BaseRoute=require('./routes/base.routes');
const ProductsRoute=require("./routes/products.routes");
const CartRoute=require("./routes/carts.routes");
const { Server }=require('socket.io');

const app=new App([new BaseRoute(), new ProductsRoute(), new CartRoute()]);

const httpServer=app.listen();

const io = new Server(httpServer);


const messages=[];

io.on('connection', (socket)=>{
  console.log('Nuevo cliente conectado;', socket.id);

  socket.emit("messageLogs",messages);
  
  socket.on("new-user", (data)=>{
    socket.broadcast.emit("new-user", data);
  })
  
  socket.on("message", (data)=>{
    messages.unshift(data);
    io.emit("messageLogs", messages)
  })
})