const socket = io();

console.log('entre')

socket.on('set-products',(data)=>{
    console.log('a ver la data:',data);

    const productList = document.getElementById('productList');
    
    productList.innerHTML = '';

    data.forEach(product => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.title} - ${product.description} - ${product.price}`;
        productList.appendChild(listItem);

    })
});

