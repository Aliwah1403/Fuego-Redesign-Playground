const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', () => {
  window.history.back();
})

// create card product cards here
const createCartCards = (data) => {
  return `
       <div class="sm-product">
          <button class="sm-delete-btn">
            <i class="fi fi-rr-trash"></i>
          </button>
          <img src="${data.image}" alt="product-image"
            class="sm-product-img" />

          <div class="sm-text">
            <p class="sm-product-name">${data.name}</p>
            <p class="sm-size">Size: <span>${data.size}</span></p>
          </div>

          <div class="item-counter">
            <button class="counter-btn decrement">-</button>
            <p class="item-count">${data.item}</p>
            <button class="counter-btn increment">+</button>
          </div>

          <p class="sm-price" data-price="${data.price}">KES ${data.price * data.item}</p>
        </div>
    `;
}

let totalBill = 0;
let deliveryOption = 0;

const setProducts = (name) => {
  let checkoutBtn = document.querySelector('.checkout-btn');
  const element = document.querySelector(`.${name}`);
  let data = JSON.parse(localStorage.getItem(name));
  if (data == null || !data.length) {
    element.innerHTML = `
         <div class="no-items">
          <h1>No items in cart</h1>
          <button class="action-btn shop-btn" onclick = window.location.href='/shop'>
            go to shop
          </button>
        </div>
        `;
    checkoutBtn.disabled = true;
  } else {
    for (let i = 0; i < data.length; i++) {
      element.innerHTML += createCartCards(data[i]);
      if (name == 'cart') {
        totalBill += Number(data[i].price * data[i].item);
      }
      updateBill();
    }
  }

  setupEvents(name);
}

let finalPrice = 0;
const updateBill = () => {
  // updateNavCartCounter();
  let billPrice = document.querySelector('.subtotal-bill__price');

  switch (parseInt(deliveryOption)) {
    case 1:
      finalPrice = totalBill;
      break;

    case 2:
      finalPrice = totalBill + 100;
      break;

    case 3:
      finalPrice = totalBill + 200;
      break;

    case 4:
      finalPrice = totalBill + 250;
      break;

    case 5:
      finalPrice = totalBill + 300;
      break;

    case 6:
      finalPrice = totalBill + 350;
      break;

    case 7:
      finalPrice = totalBill + 400;
      break;

    case 8:
      finalPrice = totalBill + 450;
      break;

    case 9:
      finalPrice = totalBill + 500;
      break;

    case 10:
      finalPrice = totalBill + 600;
      break;

    case 11:
      finalPrice = totalBill + 700;
      break;

    case 12:
      finalPrice = totalBill + 800;
      break;

    default:
      finalPrice = totalBill;
      break;
  }
  billPrice.innerHTML = `KES ${finalPrice}`;
}

// const dropdown = document.getElementById('deliveryDropdown');
// dropdown.addEventListener('change', ()=>{
//   deliveryOption = dropdown.value;
//   updateBill()
// })

// Showing final price depending on how much of each item you have
const setupEvents = (name) => {
  const counterMinus = document.querySelectorAll(`.${name} .decrement`);
  const counterPlus = document.querySelectorAll(`.${name} .increment`);
  const counts = document.querySelectorAll(`.${name} .item-count`);
  const price = document.querySelectorAll(`.${name} .sm-price`);
  const deleteBtn = document.querySelectorAll(`.${name} .sm-delete-btn`);

  let product = JSON.parse(localStorage.getItem(name));

  counts.forEach((item, i) => {
    let cost = Number(price[i].getAttribute('data-price'));

    counterMinus[i].addEventListener('click', () => {
      if (item.innerHTML > 1) {
        item.innerHTML--;
        totalBill -= cost;
        price[i].innerHTML = `KES ${item.innerHTML * cost}`;
        if (name == 'cart') {
          updateBill();
        }
        product[i].item = item.innerHTML;
        localStorage.setItem(name, JSON.stringify(product));
      }
    })

    counterPlus[i].addEventListener('click', () => {
      if (item.innerHTML < 9) {
        item.innerHTML++;
        totalBill += cost;
        price[i].innerHTML = `KES ${item.innerHTML * cost}`;
        if (name == 'cart') {
          updateBill();
        }
        product[i].item = item.innerHTML;
        localStorage.setItem(name, JSON.stringify(product));
      }
    })
  })

  deleteBtn.forEach((item, i) => {
    item.addEventListener('click', () => {
      product = product.filter((data, index) => index != i);
      localStorage.setItem(name, JSON.stringify(product));
      location.reload()
    })
  })
}

setProducts('cart');