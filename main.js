// manipulating storage
Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
    return JSON.parse(this.getItem(key));
}

// Storage.prototype.removeObject = function(key) {
//     this.removeItem(key)
// }

// on load display all items  

let obj;

let creatingObj = function () {
    return new Promise(function (resolve, reject) {  // to create variable obj
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'description.json');
        // xhr.onreadystatechange = function(){
        //     console.log(this.readyState);
        // }
        xhr.onload = function () {
            if (xhr.status === 200) {
                obj = JSON.parse(this.responseText);
                resolve();
            }
            else {
                reject(this.status);
            }
        }
        xhr.send();
    })
}

let displayObj = function () {
    return new Promise(function (resolve) {   // to display created obj
        let gridCont = document.querySelector('.grid-container');
        let txt = '';
        for (let x in obj) {
            txt += `<div class="grid-item">
            <div class="img-container"><img src=${obj[x][0]}></div>
            <div class="item-desc">${obj[x][1]}</div>
            <div class="item-rate"><span class="inr">INR</span>${obj[x][2]}</div>
            <div class="addToCart"><a href="#void" id="${x}-item" data-index="${x}" class="add-link">Add to Cart</a></div></div>`;
        }
        gridCont.innerHTML = txt;
        resolve();
    });
}

window.addEventListener('load', function () {
    creatingObj().then(() => {
        displayObj().then(
            function () {
                console.log("Items displayed");
                let ls = localStorage;
                let shoesCart = ls.getObject("shoesCart");
                if (ls.getObject("shoesCart")) {
                    addingShoesCart(shoesCart);
                }
                else {
                    console.log("Nothing to print in cart!");
                }
                document.querySelectorAll('.add-link').forEach(element => {
                    element.addEventListener('click', function () {

                        console.log(this.dataset.index, "printed");
                        let creatingCart = new Promise(function (resolve) {
                            let indCall = element.dataset.index;
                            let shoesCart = {};
                            let ls = localStorage;
                            if (ls.getObject("shoesCart")) {
                                console.log(ls.getObject("shoesCart"));
                                shoesCart = ls.getObject("shoesCart");
                                if (shoesCart[indCall]) {
                                    alert("Already in your cart!");
                                }
                                else {
                                    shoesCart[indCall] = 1;
                                    ls.setObject("shoesCart", shoesCart);
                                    resolve(shoesCart);
                                }
                            }
                            else {
                                shoesCart[indCall] = 1;
                                ls.setObject("shoesCart", shoesCart);
                                resolve(shoesCart);
                            }
                        });
                        creatingCart.then(
                            function (shoesCart) {
                                let cartItem = document.querySelector('.cart-items');
                                let txt = '';
                                for (let x in shoesCart) {
                                    txt += `<div class="cart-item w-100">
                                                <div class="cart-item-img float-left">
                                                    <img src="${obj[x][0]}">
                                                </div>
                                                <div class="cart-item-desc float-right font-weight-bolder">
                                                    ${obj[x][1]}
                                                    <div class="cart-item-price text-right">&#8377;${obj[x][2]}</div>
                                                    <div class="cart-item-quant">
                                                        <button class="cart-item-quant-minus bg-danger text-light">-</button>
                                                        <input class="cart-item-quant-display" value="${shoesCart[x]}" disabled>
                                                        <button class="cart-item-quant-plus bg-primary text-light">+</button>
                                                    </div>
                                                    <div class="cart-item-total text-right">
                                                        All total <span class="cart-item-total-price">&#8377;${obj[x][2]}</span>
                                                    </div>
                                                    <div class="cart-item-remove clearfix" data-index="${x}">
                                                        REMOVE
                                                    </div>
                                                </div>
                                            </div>`;
                                }
                                cartItem.innerHTML = txt;
                                let rmv = document.querySelectorAll('.cart-item-remove');
                                rmv.forEach(element => {
                                    element.addEventListener('click', function () {
                                        console.log("Button Pressed");
                                        let ls = localStorage;
                                        let shoesCart = ls.getObject('shoesCart');
                                        delete shoesCart.element;
                                        ls.setObject("shoesCart", shoesCart);
                                        console.log("Item deleted successfully")
                                    })
                                })

                            }
                        );
                    })
                });
            }
        )
    }
    ).catch(
        function () {
            console.log(this.status);
            document.querySelector('.grid-container').innerHTML = "Can't connect to the server!" + "<br>" + "Error : " + this.status;
        }
    )
});

// to add an item to the cart

let addingShoesCart = function (shoesCart) {
    let cartItem = document.querySelector('.cart-items');
    let txt = '';
    for (let x in shoesCart) {
        txt += `<div class="cart-item w-100">
                    <div class="cart-item-img float-left">
                        <img src="${obj[x][0]}">
                    </div>
                    <div class="cart-item-desc float-right font-weight-bolder">
                        ${obj[x][1]}
                        <div class="cart-item-price text-right">&#8377;${obj[x][2]}</div>
                        <div class="cart-item-quant">
                            <button class="cart-item-quant-minus bg-danger text-light">-</button>
                            <input class="cart-item-quant-display" value="${shoesCart[x]}" disabled>
                            <button class="cart-item-quant-plus bg-primary text-light">+</button>
                        </div>
                        <div class="cart-item-total text-right">
                            All total <span class="cart-item-total-price">&#8377;${obj[x][2]}</span>
                        </div>
                        <div class="cart-item-remove" data-index="${x}">
                            REMOVE
                        </div>
                    </div>
                </div>`;
    }
    cartItem.innerHTML = txt;
    let rmv = document.querySelectorAll('.cart-item-remove');
    rmv.forEach(element => {
        element.addEventListener('click', function () {
            let indCall = element.dataset.index;
            let ls = localStorage;
            let shoesCart = ls.getObject('shoesCart');
            console.log(shoesCart[indCall]);
            console.log(indCall);
            delete shoesCart[indCall];
            console.log(shoesCart);
            ls.setObject("shoesCart", shoesCart);
            console.log("Item deleted successfully");
            // addingShoesCart(shoesCart);
        })
    })

}

// to remove an item from the cart 









// if ( localStorage.getObject("shoesCart")){
                        //     console.log(localStorage.getObject("shoesCart"));
                            // if ( localStorage.getObject("shoesCart")[indCall] ){
                            //     // listArr = localStorage.getObject("shoesCart");
                            //     // localStorage.setObject("shoesCart", a+1);
                            // }
                            // else{
                            //     localStorage.setObject("shoesCart")
                            // }
                        // }
                        // else{
                        //     localStorage.setObject("shoesCart",shoesCart);
                        // }
                        // let cartItems = document.querySelector('.cart-items');