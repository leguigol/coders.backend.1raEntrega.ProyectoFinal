
const socket = io();

socket.on('set-products',(data)=>{
    // console.log('a ver la data:',data);

    const productList = document.getElementById('productList');
    
    if(productList){
        productList.innerHTML = '';

        data.map(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.id} - ${product.title} - ${product.description} - ${product.price}`;
            return listItem;
        }).forEach(item => {
            productList.appendChild(item);
        });
    
    }
});

function eliminarProducto() {
    const productIdInput = document.getElementById('productId');
    if (productIdInput && productIdInput.value.trim() !== '') {
        const productId = productIdInput.value.trim();
        socket.emit('eliminar-producto', { id: productId });
    } else {
        console.error('ID del producto no válido');
    }
}

function agregarProducto(){
    const title=document.getElementById('title').value;
    const description=document.getElementById('description').value;
    const code=document.getElementById('code').value;
    const price=document.getElementById('price').value;
    const stock=document.getElementById('stock').value;
    const category=document.getElementById('category').value;

    //console.log({title,description,code,price,stock,category});
    socket.emit('agregar-producto', {title: title, description: description,code: code, price: price, stock: stock, category: category, status: true, thumbnail: ''})

}