window.onload = () => {
    if (!sessionStorage.user) {
        location.replace('/login');
    }
}

// Delivery dropdown
const dropdown = document.getElementById('deliveryDropdown');
dropdown.addEventListener('change', () => {
    deliveryOption = dropdown.value;
    updateBill()
})


// Delivery zone dropdown
const zonesHead = document.querySelectorAll('.zones-head');

zonesHead.forEach((item) => {
    item.addEventListener('click', function () {
        this.nextElementSibling.classList.toggle('show-zones-content');
        const icon = this.querySelector('span i').className;

        if (icon === 'fi fi-br-plus') {
            this.querySelector('span').innerHTML = '<i class="fi fi-br-minus"></i>';
        } else {
            this.querySelector('span').innerHTML = '<i class="fi fi-br-plus"></i>';
        }
    });
});


const buyBtn = document.querySelector('.buy-btn');

// Disabling button when checkbox is unticked
const checkbox = document.getElementById('notification')

checkbox.addEventListener('change', function () {
    if (this.checked) {
        buyBtn.disabled = false;
    } else {
        buyBtn.disabled = true;
    }
});

if (!checkbox.checked) {
    buyBtn.disabled = true;
}

buyBtn.addEventListener('click', () => {
    let address = getAddress();

    // send data to backend
    if (address.address.length) {
        fetch('/intasend-checkout', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: address.address,
                city: address.city,
                zipcode: address.postcode,
                email: JSON.parse(sessionStorage.user).email,
                first_name: JSON.parse(sessionStorage.user).name,
                phone_number: JSON.parse(sessionStorage.user).number,
                amount: finalPrice,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Network response failed')
                }
            })
            .then((data) => {
                const url = data.url;
                window.location.href = url;
                // console.log(url);
            })
        sessionStorage.setItem('address', JSON.stringify(address));
    }
})

const getAddress = () => {
    let address = document.getElementById('address').value;
    let location = document.getElementById('location').value;
    let city = document.getElementById('city').value;
    let delivery = document.getElementById('deliveryZone').value;
    let postcode = document.getElementById('postcode').value;
    let deliveryMessage = document.getElementById('deliverymessage').value;

    if (!address.length || !city.length || !delivery.length || !postcode.length) {
        return showAlert("fill in delivery address inputs")
    } else {
        return { address, location, city, delivery, postcode, deliveryMessage };
    }
}