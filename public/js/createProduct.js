const createProduct = (data) => {
  let productContainer = document.querySelector('.product-container')
  productContainer.innerHTML += `
           <div class="pro">
        <img
          src="${data.images[0]}"
          alt="Tote-bag"
        />

        <button class="card-action-btn edit-btn" title="Edit" onclick = "location.href = '/add-product/${data.id}'">
          <i class="fi fi-rr-edit"></i>
        </button>
        <button class="card-action-btn open-btn" title="Open" onclick = "location.href = '/products/${data.id}'">
          <i class="fi fi-sr-redo"></i>
        </button>
        <button class="card-action-btn delete-btn" title="Delete" onclick = "openDeletePopup('${data.id}')">
          <i class="fi fi-sr-trash"></i>
        </button>

        <div class="des">
          <span>FXR</span>
          <h5 class="product-brand">${data.name}</h5>
          <h4 class="product-price">Ksh ${data.productPrice}</h4>
        </div>
        <a href="#"><i class="fi fi-rr-shopping-bag cart-icon"></i></a>
      </div>
    `
}

const openDeletePopup = (id) => {
  let deleteAlert = document.querySelector('.delete-alert');
  deleteAlert.style.display = "flex";

  let closeBtn = document.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => deleteAlert.style.display = null);

  let deleteBtn = document.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteItem(id))
}

const deleteItem = (id) => {
  fetch('/delete-product', {
    method: 'post',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id: id })
  }).then(res => res.json())
    .then(data => {
      if (data == 'success') {
        location.reload();
      } else {
        showAlert('an error occurred while deleting the product. Try Again');
      }
    })
}