// Product Image Selector
const productImages = document.querySelectorAll('.product-images img');
const productImageSlider = document.querySelector('.image-slider');

let activeImageSlide = 0;

productImages.forEach((item, i) => {
    item.addEventListener('click', () => {
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        productImageSlider.style.backgroundImage = `url('${item.src}')`;
        activeImageSlide = i;
    })
})

// Product image zoom on hover
productImageSlider.addEventListener('mousemove', function (e) {
    const magnifyingGlass = this.querySelector('.image-slider-glass');
    if (magnifyingGlass) {
        const x = e.clientX - this.offsetLeft;
        const y = e.clientY - this.offsetTop;

        const magnifiedX = (x / this.clientWidth) * 100;
        const magnifiedY = (y / this.clientHeight) * 100;

        magnifyingGlass.style.backgroundImage = this.style.backgroundImage;
        magnifyingGlass.style.backgroundPosition = `${magnifiedX}% ${magnifiedY}%`;
        magnifyingGlass.style.left = `${x}px`;
        magnifyingGlass.style.top = `${y}px`;
    }
});

// Toggling the size buttons
const sizeBtns = document.querySelectorAll('.size-radio-btn');
let checkedBtn = 0;
let size;

sizeBtns.forEach((item, i) => {
    item.addEventListener('click', () => {
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check');
        checkedBtn = i;
        size = item.innerHTML;
    })
})

const setData = (data) => {
    let title = document.querySelector('title')

    // setting the images
    productImages.forEach((img, i) => {
        if (data.images[i]) {
            img.src = data.images[i]
        } else {
            img.style.display = 'none'
        }
    })
    productImages[0].click();

    // setting up size buttons
    const noSize = document.querySelector('.no-size');

    sizeBtns.forEach(item => {
        if (!data.sizes.includes(item.innerHTML)) {
            item.style.display = 'none';
            // noSize.classList.toggle('active');
            // noSize.classList.add('active');
        }
    })

    // setting up texts - ie(product description etc)
    const name = document.querySelector('.product-name');
    const des = document.querySelector('.des');

    title.innerHTML += name.innerHTML = data.name;
    des.innerHTML = data.des;

    // Setting price data
    const productPrice = document.querySelector('.product-price')

    productPrice.innerHTML = `KES ${data.productPrice}`;

    // cart button
    const cartBtn = document.querySelector('.cart-btn');

    // Checking if product has set sizes
    if (data.sizes && data.sizes.length > 0) {
        cartBtn.addEventListener('click', () => {
            if (!size) {
                // What to do if product has sizes but none is selected
                showAlert("please select a size")
            } else {
                updateNavCartCounter();
                cartBtn.innerHTML = addToCart('cart', data);

                setTimeout(() => {
                    cartBtn.innerHTML = 'Add to Cart';
                }, 2000);
            }
        })
    } else {
        // Default for when product has no sizes set
        cartBtn.addEventListener('click', () => {
            updateNavCartCounter();
            cartBtn.innerHTML = addToCart('cart', data);

            setTimeout(() => {
                cartBtn.innerHTML = 'Add to Cart';
            }, 2000);
        })
    }
}

// fetching data
const fetchProductData = () => {
    fetch('/get-products', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: productId })
    })
        .then(res => res.json())
        .then(data => {
            setData(data);
            getProducts(data.tags[1]).then(data => productCardContainer(data,
                '.container-for-product-card', 'similar products'))
        })
        .catch(err => {
            location.replace('/404');
        })
}

let productId = null;
if (location.pathname != '/products') {
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}

// Policies dropdown
const policiesHead = document.querySelectorAll('.policies-head');

policiesHead.forEach((item) => {
    item.addEventListener('click', function () {
        this.nextElementSibling.classList.toggle('show-policies-content');
        const icon = this.querySelector('span i').className;

        if (icon === 'fi fi-sr-angle-down') {
            this.querySelector('span').innerHTML = '<i class="fi fi-sr-angle-up"></i>';
        } else {
            this.querySelector('span').innerHTML = '<i class="fi fi-sr-angle-down"></i>';
        }
    });
});