let char = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+{}[]:;'<>,.
=/?${'`'}{|}~`;

const generateToken = (key) => {
    let token = '';
    for (let i = 0; i < key.length; i++) {
        let index = char.indexOf(key[i]) || char.length / 2;
        let randomIndex = Math.floor(Math.random() * index);
        token += char[randomIndex] + char[index - randomIndex];
    }
    return token;
}

const compareToken = (token, key) => {
    let string = '';
    for (let i = 0; i < token.length; i += 2) {
        let index1 = char.indexOf(token[i]);
        let index2 = char.indexOf(token[i + 1]);
        string += char[index1 + index2];
    }

    if (string === key) {
        return true;
    }
    return false;
}

// common functions
// send data
const sendData = (path, data) => {
    fetch(path, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then(response => {
            processData(response);
        })
}

const processData = (data) => {
    loader.style.display = null;
    if (data.alert) {
        showAlert(data.alert);
    } else if (data.name) {
        //  creating an authToken
        data.authToken = generateToken(data.email);
        sessionStorage.user = JSON.stringify(data);
        location.replace('/');
    } else if (data == true) {
        let user = JSON.parse(sessionStorage.user);
        user.seller = true;
        sessionStorage.user = JSON.stringify(user);
        location.reload();
    } else if (data.product) {
        location.href = "/seller";
    }
}



// alert function
const showAlert = (message) => {
    let toast = document.querySelector('.toast-alert')
    let progress = document.querySelector('.progress');
    let closeIcon = document.querySelector('.close');
    let toastMsg = document.querySelector('.text-2');
    toastMsg.innerHTML = message;
    progress.classList.add('active');
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove("active");
    }, 3000);

    setTimeout(() => {
        progress.classList.remove("active");
    }, 3300)

    closeIcon.addEventListener('click', () => {
        toast.classList.remove("active");
    })
    return false;
    // setTimeout(() => {
    //   progress.classList.remove("active");
    // }, 300)

}
