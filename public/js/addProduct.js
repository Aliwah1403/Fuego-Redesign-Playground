let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector(".loader");

// checking if user is logged in or not
window.onload = () => {
    if (user) {
        if (!compareToken(user.authToken, user.email)) {
            location.replace("/login");
        }
    } else {
        location.replace("/login");
    }
};

// price input
const productPrice = document.getElementById('price');

// upload images handler
let uploadImages = document.querySelectorAll(".fileupload");
let imagePaths = []; //this will store all our image paths

uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];

        let imageUrl;

        if (file.type.includes('image')) {
            // means user uploaded image
            fetch('/s3url').then(res => res.json())
                .then(url => {
                    fetch(url, {
                        method: 'PUT',
                        headers: new Headers({ 'Content-Type': 'multipart/form-data' }),
                        body: file
                    }).then(res => {
                        imageUrl = url.split("?")[0];
                        imagePaths[index] = imageUrl;
                        let label = document.querySelector(`label[for=${fileupload.id}]`);
                        label.style.backgroundImage = `url(${imageUrl})`;
                        let productImage = document.querySelector('.product-image');
                        productImage.style.backgroundImage = `url(${imageUrl})`;
                    })
                })
        } else {
            showAlert('upload images only')
        }
    })
})


// Form Submission
const productName = document.getElementById("product-name");
const des = document.getElementById("des");

let sizes = [] //this will store the picked sizes

const tags = document.getElementById("tags");

const addProductBtn = document.getElementById("add-btn");

// function to store sizes
const storeSizes = () => {
    sizes = [];
    let sizeCheckBox = document.querySelectorAll(".size-checkbox");
    sizeCheckBox.forEach((item) => {
        if (item.checked) {
            sizes.push(item.value);
        }
    });
};

const validateForm = () => {
    if (!productName.value.length) {
        return showAlert("enter product name");
    } else if (!des.value.length) {
        return showAlert("enter a  description about the product");
    } else if (!imagePaths.length) {
        return showAlert("upload atleast one product image");
    } else if (!productPrice.value.length) {
        return showAlert("you must add pricing for your product");
    } else if (!tags.value.length) {
        return showAlert(
            "enter a few tags to help when viewing your product in search"
        );
    }
    return true;
}

const productData = () => {
    let tagArr = tags.value.split(',');
    tagArr.forEach((item, i) => tagArr[i] = tagArr[i].trim());
    return (data = {
        name: productName.value,
        des: des.value,
        images: imagePaths,
        sizes: sizes,
        productPrice: productPrice.value,
        tags: tagArr,
        email: user.email,
    });
};

addProductBtn.addEventListener('click', () => {
    storeSizes()

    // validating the form
    if (validateForm()) {
        // validateForm() returns true or false while doing validation
        loader.style.display = 'block';
        let data = productData();
        if (productId) {
            data.id = productId;
        }
        sendData("/add-product", data);
    }
})

// Handling an already existing product

const setFormsData = (data) => {
    productName.value = data.name;
    des.value = data.des;
    productPrice.value = data.productPrice;
    tags.value = data.tags

    // set up images data
    imagePaths = data.images;
    imagePaths.forEach((url, i) => {
        let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
        label.style.backgroundImage = `url(${url})`;
        let productImage = document.querySelector('.product-image');
        productImage.style.backgroundImage = `url(${url})`;
    })

    // set up sizes data
    sizes = data.sizes;

    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if (sizes.includes(item.value)) {
            item.setAttribute('checked', '');
        }
    })

}

const fetchProductData = () => {
    fetch('/get-products', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ email: user.email, id: productId })
    })
        .then(res => res.json())
        .then(data => {
            setFormsData(data);
        })
        .catch(err => {
            console.log(err);
        })
}

let productId = null;
if (location.pathname != '/add-product') {
    productId = decodeURI(location.pathname.split('/').pop());

    fetchProductData();
}