const alertElem = document.querySelector('.success-alert');
const closeIcon = document.querySelector('.close');
const progress = document.querySelector('.progress');

const successAlert = (message) => {
    let toastInvoice = document.querySelector('.text-1')
    let toastMsg = document.querySelector('.text-2');
    toastInvoice.innerHTML = `Hello ${JSON.parse(sessionStorage.user).name}`;
    toastMsg.innerHTML = message;
    progress.classList.add('active');
    alertElem.classList.add('active');
    setTimeout(() => {
        alertElem.classList.remove("active");
    }, 5000);

    setTimeout(() => {
        progress.classList.remove("active");
    }, 5000)

    closeIcon.addEventListener('click', () => {
        alertElem.classList.remove("active");
    })
}

setTimeout(() => {
    successAlert("Your order has been placed, we will contact you when it is ready to be delivered")
}, 2000)

// Getting date and time order was made
const getDateTime = () => {
    let date = new Date();

    let currentTime = new Date(date.getTime());

    // Extract the date components (day, month, year)
    let day = currentTime.getDate().toString().padStart(2, '0');
    let month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
    let year = currentTime.getFullYear().toString();

    // Extract the time components (hours, minutes, seconds)
    let hours = currentTime.getHours().toString().padStart(2, '0');
    let minutes = currentTime.getMinutes().toString().padStart(2, '0');
    let seconds = currentTime.getSeconds().toString().padStart(2, '0');

    // Format the date and time
    let formattedDateTime = `${day}-${month}-${year} - ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;

}

// Order route activated after /success route goes through
fetch('/order', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
        order: JSON.parse(localStorage.cart),
        email: JSON.parse(sessionStorage.user).email,
        name: JSON.parse(sessionStorage.user).name,
        number: JSON.parse(sessionStorage.user).number,
        address: JSON.parse(sessionStorage.getItem('address')),
        time: getDateTime(),
    })
}).then(res => {
    window.location.href = '/success';

}).catch(err => {
    console.log(err);
})

// Deleting the order from cart after successful payment
const successOrder = () => {
    delete localStorage.cart;
}

window.addEventListener('load', () => {
    successOrder();
})