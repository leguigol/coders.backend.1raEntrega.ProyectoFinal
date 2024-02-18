const {Router}=require('express');

class BaseRoute{

    path="/legui";
    router=Router();

    constructor(){
        this.initBaseRoutes()
    }

    initBaseRoutes(){
        this.router.get(`${this.path}`,(req,res)=>{
            return res.status(200).json({
                ok: true,
                message: `IM AN API, UP AND RUNNING`
            });
        })
        this.router.get('/chat',(req,res)=>{
            res.render('chat');
        })
    }
}

module.exports=BaseRoute;