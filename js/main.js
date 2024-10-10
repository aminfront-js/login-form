let formContainer = document.getElementById('formContainer');
let loader = document.getElementById('loader');
let inputs = document.getElementsByTagName('input');
let spinLoader = document.getElementById('spinLoader');
let successfAlert = document.getElementById('successfAlert');
let errorAlert = document.getElementById('errorAlert');
let errorMessage = document.getElementById('errorMessage')
let newUser;

// =====================check cookies
const loading = async function (user, action, callback) {
    let result = await action(user)
    callback(result)
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
function delete_cookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}



if (getCookie('userInformation') && getCookie('token')) {

    newUser = JSON.parse(getCookie('userInformation'))
    loader.style.display = 'flex'
    loading(newUser, login, function getResponde(responde) {
        if (responde.code == 200) {
            document.cookie = 'userInformation=' + JSON.stringify(newUser);
            window.location.assign(window.location.href + 'product-page.html')
        } else {
            delete_cookie('userInformation')
            delete_cookie('token')
        }
    })
}
// --------load form
function loadDoc(form) {
    loader.style.display = 'none'
    errorAlert.style.display = 'none'
    spinLoader.style.display = 'none';
    successfAlert.style.display = 'none'
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        formContainer.innerHTML = this.responseText;
    }
    xhttp.open("GET", `${form}.html`);
    xhttp.send();
}
// --------check user
// ====================== sign up
function setInformation() {

    let inputsArr = Array.from(inputs);
    let userNameInp = inputsArr.find(x => x.type === 'text');
    let passwordInp = inputsArr.find(x => x.type === 'password')

    if (userNameInp.value === '' && passwordInp.value === '') {
        userNameInp.style.border = '1px solid red'
        passwordInp.style.border = '1px solid red'
    } else if (userNameInp.value === '') {
        userNameInp.style.border = '1px solid red'
    } else if (passwordInp.value === '') {
        passwordInp.style.border = '1px solid red'
    } else {
        loader.style.display = 'flex'
        spinLoader.style.display = 'flex'
        newUser = {
            userName: userNameInp.value,
            password: passwordInp.value
        };
        loading(newUser, signup, function getResponde(responde) {
            userNameInp.value = '';
            passwordInp.value = '';
            if (responde.code == 200) {
                spinLoader.style.display = 'none';
                successfAlert.style.display = 'flex'
            } else {
                errorMessage.innerHTML = 'Account already exists'
                spinLoader.style.display = 'none';
                errorAlert.style.display = 'flex'
            }
        })
    }
}

function signup(user) {
    loader.style.display = 'flex';
    spinLoader.style.display = 'felx';
    return new Promise((resolve, reject) => {
        fetch('http://apitest.piepa.ir/SignUp', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('have error!')
                }
            })
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                errorMessage.innerHTML = "Something is wrong"
                spinLoader.style.display = 'none';
                errorAlert.style.display = 'flex'
                console.log(error);
            })
    })

}





// ====================== log in
function checkInformation() {

    let inputsArr = Array.from(inputs);
    let userNameInp = inputsArr.find(x => x.type === 'text');
    let passwordInp = inputsArr.find(x => x.type === 'password')

    if (userNameInp.value === '' && passwordInp.value === '') {
        userNameInp.style.border = '1px solid red'
        passwordInp.style.border = '1px solid red'
    } else if (userNameInp.value === '') {
        userNameInp.style.border = '1px solid red'
    } else if (passwordInp.value === '') {
        passwordInp.style.border = '1px solid red'
    } else {
        loader.style.display = 'flex'
        spinLoader.style.display = 'flex'
        newUser = {
            userName: userNameInp.value,
            password: passwordInp.value
        };
        loading(newUser, login, function getResponde(responde) {
            userNameInp.value = '';
            passwordInp.value = '';
            if (responde.code == 200) {
                spinLoader.style.display = 'flex';
                let rememberCheck = Array.from(inputs).find(x => x.type === 'checkbox');
                // console.log(rememberCheck.checked);
                if (rememberCheck.checked) {
                    document.cookie = 'userInformation=' + JSON.stringify(newUser)
                }
                document.cookie = 'token=' + responde.Token
                window.location.assign(window.location.href + 'product-page.html')
            } else {
                errorMessage.innerHTML = responde.message
                spinLoader.style.display = 'none';
                errorAlert.style.display = 'flex'
            }
        })
    }
}


function login(user) {
    loader.style.display = 'flex';
    spinLoader.style.display = 'flex'
    return new Promise((resolve, reject) => {
        fetch('http://apitest.piepa.ir/Login', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('have error!')
                }
            })
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                console.log(error);
                errorMessage.innerHTML = "Something is wrong"
                spinLoader.style.display = 'none';
                errorAlert.style.display = 'flex'
            })
    })

}


// ----------------------------------
loadDoc('login')
