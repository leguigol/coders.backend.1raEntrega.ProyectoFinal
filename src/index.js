const App=require("./app");
const BaseRoute=require('./routes/base.routes');
const ProductsRoute=require("./routes/products.routes");
const CartRoute=require("./routes/carts.routes");

const app=new App([new BaseRoute(), new ProductsRoute(), new CartRoute()]);

app.listen();