const loader = document.querySelector('.contact-loader')
const contactForm = document.querySelector('.messageForm');
const name = document.getElementById('name');
const email = document.getElementById('email');
const reason = document.getElementById('reason');
const message = document.getElementById('message');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    loader.style.display = "block";

    let formData = {
        name: name.value,
        email: email.value,
        reason: reason.value,
        message: message.value
    }

    fetch('/formData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(res => {
        if (res.status === 200) {
            alert('Message sent successfully')
            location.reload();
        } else {
            alert('Error sending email, please try again later')
        }
    }).catch(err => {
        console.log(err);
    })

})