let loader = document.getElementById('loader');
let spinLoader = document.getElementById('spinLoader');
let errorAlert = document.getElementById('errorAlert');
let errorMessage = document.getElementById('errorMessage')
let itemsContainer = document.getElementById('itemsContainer')
// ------------------------------------------------------------
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
const token = getCookie('token')
const loading = async function (action, callback) {
    let result = await action
    callback(result)
}

function checkIfImageExists(url, callback) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
    });
}

// function checkIfImageExists(urlInput , callback) {
//     return fetch(urlInput, { method: 'HEAD' })
//         .then(response => {
//             if (response.status === 403) {
//                 callback(false)
//             } else if (response.ok) {
//                 callback(true)
//             } else {
//                 callback(false)
//             }
//         })
//         .catch(error => {
//             callback(false)
//         });
// }

// async function checkIfImageExists(url, callback) {
//     try {
//         const response = await fetch(url, { method: 'GET', mode: 'no-cors' });
//         // Since fetch will not throw an error for non-200 responses in no-cors mode,
//         // we check the response code in a different way.
//         if (response.ok) {
//             callback(true)
//         } else if (response.status === 403) {
//             callback(false)
//         } else {
//             callback(false)
//         }
//     } catch (error) {
//         callback(false)
//     }
// }






function getProduct() {
    loader.style.display = 'flex';
    return new Promise((resolve, reject) => {
        fetch('http://apitest.piepa.ir/GetProduct', {
            method: 'GET',
            headers: new Headers({ 'Authorization': `Bearer ${token}` }),
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
                errorMessage.innerHTML = 'Something is wrong'
                spinLoader.style.display = 'none';
                errorAlert.style.display = 'flex'
            })
    })

}

function getInformation() {
    loader.style.display = 'flex'
    loading(getProduct(), function getResponde(responde) {
        if (responde.code == 200) {
            loader.style.display = 'none'
            errorAlert.style.display = 'none'
            spinLoader.style.display = 'none';
            // console.log(responde);
            responde.Products.forEach(product => {
                let rightUrl = ((product.ImageURL).includes('.jpg') ? product.ImageURL : product.ImageURL + product.ImageName)
                checkIfImageExists(rightUrl, (exists) => {
                    if (exists) {
                        itemsContainer.innerHTML += `<div class="bg-white rounded-lg border p-4 w-80 flex-shrink-0 h-[450px] relative" style="order:${product.ID}">
                        <i class="off">${product.PercentOFF * 100}%</i>
                        <img src="${rightUrl}" alt="${product.ImageName}" class="w-full h-48 rounded-md object-cover drop-shadow">
                        <div class="px-1 py-4">
                          <div class="font-bold text-xl mb-2 text-right">${product.Name}</div>
                          <p class="text-gray-700 text-base text-right">
                            ${product.Description}
                          </p>
                        </div>
                        <div class="px-1 py-4 ">
                          <span class="text-2xl text-blue-800 font-bold block">$${(product.RealPrice - product.RealPrice * product.PercentOFF).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                          <span class="text-slate-600 font-light line-through">$${(product.RealPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        </div>
                      </div>`
                    } else {
                        itemsContainer.innerHTML += `<div class="bg-white rounded-lg border p-4 w-80 flex-shrink-0 h-[450px] relative" style="order:${product.ID};">
                        <i class="off">${product.PercentOFF * 100}%</i>
                        <img src="${'img/Image-not-found.png'}" alt="${product.ImageName}" class="w-full h-48 rounded-md object-cover drop-shadow">
                        <div class="px-1 py-4">
                          <div class="font-bold text-xl mb-2 text-right">${product.Name}</div>
                          <p class="text-gray-700 text-base text-right">
                            ${product.Description}
                          </p>
                        </div>
                        <div class="px-1 py-4 ">
                          <span class="text-2xl text-blue-800 font-bold block">$${(product.RealPrice - product.RealPrice * product.PercentOFF).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                          <span class="text-slate-600 font-light line-through">$${(product.RealPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        </div>
                      </div>`
                    }
                });

            });
        } else {
            errorMessage.innerHTML = responde.message
            spinLoader.style.display = 'none';
            errorAlert.style.display = 'flex'
        }
    })
}
window.addEventListener("load", (event) => {
    getInformation()
});


// --------------------------------------------------------------------
function tryAgain() {
    document.cookie = 'userInformation' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.assign('./')
}