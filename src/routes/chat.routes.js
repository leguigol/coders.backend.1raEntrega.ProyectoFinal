const {Router}=require('express');


class ChatRoutes {

    path='/chat';
    router=Router();

    constructor(){
        this.initChatRoutes();
    }

    initChatRoutes(){
        this.router.get(`${this.path}`,(req,res)=>{
            res.render('chat');
        })
    }
    
}
module.exports=ChatRoutes;