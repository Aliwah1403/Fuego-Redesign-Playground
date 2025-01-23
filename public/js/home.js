const getProducts = (tag) => {
    return fetch('/get-products', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ tag: tag })
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
}

// Similar products container
const productCardContainer = (data, parent, title) => {
    let cardContainer = document.querySelector(`${parent}`);

    cardContainer.innerHTML += `
    <section class="clothing-products">
          <h2 class="category-header">${title}</h2>
          ${createProductCards(data)}
    </section>
    `
}

const createProductCards = (data, parent) => {
    // parent is for search product
    let start = '<div class="product-container">';
    let middle = ''; //will hold the product cards
    let end = '</div>';

    for (let i = 0; i < data.length; i++) {
        if (data[i].id != decodeURI(location.pathname.split('/').pop())) {
            middle += `
        <div class="pro" onclick = "location.href = '/products/${data[i].id}'">
             <img
                 src="${data[i].images[0]}"
                 alt="Product-Image"
             />
          <div class="des">
            <span>FXR</span>
            <h5 class="product-name">${data[i].name}</h5>
            <h4 class="product-price">KES ${data[i].productPrice}</h4>
          </div>
          <a href="#"><i class="fi fi-rr-shopping-bag cart-icon"></i></a>
        </div>
        `
        }

    }
    if (parent) {
        let cardContainer = document.querySelector(parent);
        cardContainer.innerHTML = start + middle + end;
    } else {
        return start + middle + end;
    }
}

// Adding product to cart
const addToCart = (type, product) => {
    updateNavCartCounter();
    let data = JSON.parse(localStorage.getItem(type));
    if (data == null) {
        data = []
    }

    product = {
        item: 1,
        name: product.name,
        price: product.productPrice,
        size: size || null,
        image: product.images[0]
    }

    data.push(product);
    localStorage.setItem(type, JSON.stringify(data));
    return 'added to cart';
}