// redirect to homepage if user was already loggen in
window.onload = () => {
  if (sessionStorage.user) {
    user = JSON.parse(sessionStorage.user);
    if (compareToken(user.authToken, user.email)) {
      location.replace('/');
    }
  }
}

const loader = document.querySelector('.loader');

// input fields
const eyeicon = document.getElementById("eyeicon");
const password = document.getElementById("password");
const submitBtn = document.querySelector(".submit-btn");
const name = document.getElementById("name") || null;
const email = document.getElementById("email");
const number = document.getElementById("number") || null;
const notification = document.getElementById("notification") || null;

// hiding and unhiding password
eyeicon.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    eyeicon.setAttribute("class", "fi fi-rr-eye-crossed");
  } else {
    password.type = "password";
    eyeicon.setAttribute("class", "fi fi-rr-eye");
  }
});

// toast-notification
const toast = document.querySelector(".toast-alert");
const closeIcon = document.querySelector(".close");
const progress = document.querySelector(".progress");

let handleSubmit = () => {
  if (name != null) { //sign up page
    if (name.value === "" && email.value === "" && number.value === "" && password.value === "") {
      showAlert('Fill in the input fields')
    }
    else if (name.value.length < 3) {
      showAlert('name must be atleast 3 characters long');
    } else if (!email.value.length) {
      showAlert('please enter your email')
    } else if (!Number(number.value) || number.value.length < 10) {
      showAlert('invalid number, please enter a valid number')
    } else if (password.value.length < 8) {
      showAlert('password must be atleast 8 characters long')
    } else {
      // submit the form
      loader.style.display = 'block';
      sendData('/signup', {
        name: name.value,
        email: email.value,
        number: number.value,
        password: password.value,
        notification: notification.checked,
        seller: false,
      })
    }
  } else {
    //login page
    if (!email.value.length || !password.value.length) {
      showAlert('fill in all input fields')
    } else {
      loader.style.display = 'block';
      sendData('/login', {
        email: email.value,
        password: password.value,
      })
    }
  }
}

submitBtn.addEventListener("click", handleSubmit);
document.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleSubmit();
  }
});

