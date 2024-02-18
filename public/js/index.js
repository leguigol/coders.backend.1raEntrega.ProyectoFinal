const socket = io();

let user;
const chatBox=document.getElementById("chat-box");

Swal.fire({
    title: 'Ingresa tu nombre',
    input: "text",
    text: 'ingresa el usuario para identificarse en el chat !',
    icon: 'success',
    inputValidator: (value)=>{
        return !value && "Necesitas escribir un nombre de usuario para continuar";
    },
    allowOutsideClick: false
}).then((result)=>{
    user=result.value
    socket.emit("new-user", user)
})


chatBox.addEventListener("keyup", (e)=>{
    if(e.key==="Enter"){
        if(chatBox.value.trim().length){
            socket.emit("message", { user, message: chatBox.value})
            chatBox.value="";
        }
    }
})

socket.on("messageLogs", (data)=>{
    console.log(data);
    const logs=document.getElementById("message-logs");
    let messages="";
    data.forEach(element => {
        messages+=`<p>${element.user} dice: ${element.message}</p>`
    });

    logs.innerHTML=messages;
})

socket.on("new-user", (user)=>{
    Swal.fire({
        text: `${user} se ha unido al chat`,
        toast: true,
        position: "top-right"
    })
})