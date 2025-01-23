// log in nav pop up
const userIcon = document.getElementById('user');
const userPop = document.querySelector('.login-logout-popup');
const popUpText = document.querySelector('.account-info');
const popBtn = document.getElementById('user-btn');

userIcon.addEventListener('click', () => {
    userPop.classList.toggle('hide');
})

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);
    if (user != null) {
        // means user is logged in already
        popUpText.innerHTML = `Logged in as, ${user.name}`;
        popBtn.innerHTML = 'Log out';
        popBtn.addEventListener('click', () => {
            sessionStorage.clear();
            location.reload();
        })
    } else {
        // means user is not logged in
        popUpText.innerHTML = 'log in to place order';
        popBtn.innerHTML = 'Log in';
        popBtn.addEventListener('click', () => {
            location.href = '/login';
        });
    }
}


// Header Menu Functionality
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// search box
const searchBtn = document.querySelector('.search-btn');
const searchBox = document.querySelector('.search-box')

searchBtn.addEventListener('click', () => {
    if (searchBox.value.length) {
        location.href = `/search/${searchBox.value}`
    }
});

searchBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (searchBox.value.length) {
            location.href = `/search/${searchBox.value}`
        }
    }
})

// Navbar cart item count
const updateNavCartCounter = () => {
    let cartCounter = document.querySelector('.cart-item-count');

    let cartItem = JSON.parse(localStorage.getItem('cart'));

    if (cartItem == null) {
        cartCounter.innerHTML = "0"
    } else {
        if (cartItem.length > 9) {
            cartCounter.innerHTML = "9+"
        } else if (cartItem.length <= 9) {
            cartCounter.innerHTML = cartItem.length;
        }
    }
}

updateNavCartCounter();