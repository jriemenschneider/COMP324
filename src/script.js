//Uncomment the line below and refresh page to clear local storage
//localStorage.clear();

/*
*   This function will call immediatly when the page loads.
*/
window.onload = function() {
    //If on the in-cart page, display the items
    if (this.document.title == 'Cart') {
        displayCart();
    }

    if (this.document.title == 'In Stock') {
        //this.inStockPictures();
        test();
    }

    if (this.document.title == "Saved") {
        this.displaySavedItems()
    }

    if (this.document.title == "Product") {
        //this.displayProduct()
    }

    //Sets cart to correct number in nav bar
    let list = JSON.parse(window.localStorage.getItem('cartItems')); 
    this.updateNav(list);
    

}



/*
*   Adds an item to the cart or saved items list, currently saves the brand, name, and price as an object
*
function addItem(button, location) {

    //Gets the array of items already in the cart from local storage
    let list = JSON.parse(window.localStorage.getItem(location));
    if(list == null) {
        list = [];
    }

    //Gets the item details from the HTML
    let details = button.parentElement.getElementsByClassName("product-description");
    let b = details[0].textContent;
    let n = details[1].textContent;
 

    //Gets the size of the item
    let s = button.parentElement.parentElement.getElementsByTagName('div')[1].getElementsByTagName('div')[2].getElementsByTagName('button')[0].innerText;
    if (s.length > 11) {
        s = s.slice(13, 14);
    } else {
        s = null;
    }
    

    if (s || location == 'savedItems'){
        //Creates an item object too save in array
        const item = {
            brand: b,
            name: n,
            price: p,
            img: i,
            qty: 1,
            size:s
        }

        //Checks to see if item is already in the cart
        let found = false;
        for (let i = 0; i < list.length; i ++) {
            if (list[i].brand == item.brand && list[i].name == item.name && (item.size == list[i].size || location == 'savedItems')) {
                found = true;
                list[i].qty += 1;
            }
        }

        //Add item to the array and save it in the local storage
        if (!found) {
            list.push(item);
        }
        localStorage.setItem(location, JSON.stringify(list));

        if (location == 'cartItems') {
            //Gets the HTML cart element from the nav bar to update the number 
            updateNav(list);
        }
    }
    let email = firebase.auth().currentUser.email;
    let ref = database.ref("users").orderByChild('email').equalTo(email)
    ref.once('value').then((snapshot) => {
                let user = snapshot.val();   
                console.log('***', product);
            });
}*/

function addItem(button, location) {
    let user = firebase.auth().currentUser;
    let userid = user.uid
    let email = user.email;
    let item = [];

    //Gets the item details from the HTML and creates the locator
    let details = button.parentElement.getElementsByClassName("product-description");
    let b = details[0].textContent;
    let n = details[1].textContent;
    let p = details[2].textContent;
    let locator = b.toLowerCase() + "_" + n.toLowerCase();

    //Finds the current user
    let ref = database.ref("users").orderByChild('email').equalTo(email)
    ref.once('value').then((snapshot) => {
        let user = snapshot.val();   
        user = Object.values(user);
        if (location == "cartItems") {
            //Retrieves the list of cart items for this user
            let currentItems = user[0].cartitems;

            //Gets the size of the item
            let s = button.parentElement.parentElement.getElementsByTagName('div')[1].getElementsByTagName('div')[2].getElementsByTagName('button')[0].innerText;
            if (s.length > 11) {
                s = s.slice(13, 14);
            } else {
                s = null;
            }
            item = [locator, s, 1];

            //Looks to see if the item has already been added, will increment qty if it is
            let dup = false;
            for (let i = 0; i < currentItems.length; i++) {
                if (currentItems[i][0] == locator && currentItems[i][1] == s) {
                    currentItems[i][2] += 1;
                    dup = true;
                }
            }
            if(!dup) {
                currentItems.push(item);
            }
            
            currentItems[0] += parseInt(p.slice(1));
            firebase.database().ref('users/' + userid + '/cartitems').set(currentItems);

        } else {
            let savedItems = user[0].saveditems;
            if (!savedItems.includes(locator)) {
                savedItems.push(locator)
                firebase.database().ref('users/' + userid + '/saveditems').set(savedItems);
            } 
        }



    });

}


/*
*   Removes item from cart or saved items list
*
function removeItem(button, location) {
    //Gets the array of items already in the cart from local storage
    let list = JSON.parse(window.localStorage.getItem(location));
    if(list == null) {
        list = [];
    }
    let itemToRemoveBrand = null;
    let itemToRemoveName = null;
    let itemToRemoveSize = null;
    
    //Gets details if a cart item is being removed
    if (location == 'cartItems') {
        itemToRemoveBrand = button.parentElement.getElementsByTagName("h2")[0].innerText;
        itemToRemoveName = button.parentElement.getElementsByTagName("h3")[0].innerText;
        itemToRemoveSize = button.parentElement.getElementsByTagName("h4")[0].innerText.slice(5,6);
    
    //Gets details if a saved item is being removed
    } else {
        itemToRemoveBrand = button.parentElement.getElementsByTagName('div')[0].getElementsByTagName('p')[0].innerText;
        itemToRemoveName = button.parentElement.getElementsByTagName('div')[0].getElementsByTagName('p')[1].innerText;
    }
    

    //Finds the item in the array that needs to be removed
    for (let i = 0; i < list.length; i++) {
        if (list[i].name == itemToRemoveName && list[i].brand == itemToRemoveBrand && (list[i].size == itemToRemoveSize || location == 'savedItems')) {
            list.splice(i, 1);
        }
    }
    localStorage.setItem(location, JSON.stringify(list));

    if (location == 'cartItems') {
        displayCart();
        updateNav(list);
    } else {
        displaySavedItems();
    }
}*/

function removeItem(button, location) {
    let user = firebase.auth().currentUser;
    let userid = user.uid
    let email = user.email;
     
    let itemToRemoveBrand = null;
    let itemToRemoveName = null;
    let itemToRemoveSize = null;
    
    //Gets details if a cart item is being removed
    if (location == 'cartItems') {
        
    
    //Gets details if a saved item is being removed
    } else {
        itemToRemoveBrand = button.parentElement.getElementsByTagName('div')[0].getElementsByTagName('p')[0].innerText;
        itemToRemoveName = button.parentElement.getElementsByTagName('div')[0].getElementsByTagName('p')[1].innerText;
        
        //Finds the current user
        let ref = database.ref("users").orderByChild('email').equalTo(email)
        ref.once('value').then((snapshot) => {
            let user = snapshot.val();   
            user = Object.values(user);
            let items = user[0].saveditems;
            for (let i = 0; i < items.length; i++) {
                console.log(items[i], itemToRemoveBrand.toLowerCase() + "_" + itemToRemoveName.toLowerCase())
                if (itemToRemoveBrand.toLowerCase() + "_" + itemToRemoveName.toLowerCase() == items[i]) {
                    items.splice(i, 1);
                }
            }
            console.log(items);
            firebase.database().ref('users/' + userid + '/saveditems').set(items);
        });
    }


}


/*
*   Basis for displaying the items in the cart once on the in-cart page
*
function displayCart() {
    let list = JSON.parse(window.localStorage.getItem('cartItems'));
    let ele = document.getElementById('cartContent');
    let totalPrice = 0;
    

    //If cart is empty
    if(list == null) {
        let cart = "<li id = \"Items\"><p>Cart is empty</p></li>";
        ele.innerHTML = cart;

    //If cart is not empty
    } else {
        let cart = "";
        for (let i = 0; i < list.length; i++) {
            totalPrice += parseInt(list[i].price.slice(1)) * list[i].qty;
            cart += `
            <li id= "Items">
                <hr>
                <a href=# onclick = "removeItem(this, 'cartItems')">X</a>
                <img src="${list[i].img}">
                <h2>${list[i].brand}</h2>
                <h3>${list[i].name}</h3>
                <br>
                <h4 id="SameLine">SIZE ${list[i].size}&#x2228</h4>
                <h4 id="SameLine">QTY ${list[i].qty} &#x2228</h4>
                <h5 id="Price">${list[i].price}</h5>
                <hr>
            </li>
            `
        }
        console.log(ele)
        ele.innerHTML = cart + `
        <li id="OrderSummary">
            <h1>Order Summary</h1>
            <h3 id="subSummary">SUBTOTAL</h3>
            <h3 id="subSummary">$ ${totalPrice}</h3>
            <h3 id="subSummary">SHIPPING</h3>
            <h3 id="subSummary">$ 5</h3>
            <h3 id="subSummary">SALES TAX</h3>
            <h3 id="subSummary">$ 3.07</h3>
            <h2 id="Total">TOTAL</h2>
            <h2 id="Total">$ ${totalPrice + 8.07}</h2>
            <a href="#" id="Checkout">CHECKOUT</a> 
            <!--Will eventually link to the checkout page--> 
        </li>
        `           
        }
        updateNav(list);
    }*/

    function displayCart() {
        let user = firebase.auth().currentUser;
        console.log(firebase.auth(), user);
        let email = user.email;

        let ele = document.getElementById('cartContent');

        let ref = database.ref("users").orderByChild('email').equalTo(email)
        ref.once('value').then((snapshot) => {
            let user = snapshot.val();   
            user = Object.values(user);
            let ci = user[0].cartitems;
            let totalPrice = ci[0];

            for (let i = 1; i < ci.length; i++) {

                //Sets the details of the specific order nize and quantity
                let locator = ci[i][0];
                let size = ci[i][1];
                let qty = ci[i][2];
                
                //Retrieves item from the DB
                var ref = database.ref('items').orderByChild('locator').equalTo(locator);
                ref.once('value').then((snapshot) => {
                    let product = snapshot.val();   
                    product = Object.values(product)[0];
                    
                    totalPrice += product.price * qty;
                    //Prints details to the screen
                    ele.innerHTML += `
                    <li id= "Items">
                        <hr>
                        <a href=# onclick = "removeItem(this, 'cartItems')">X</a>
                        <img src="${product.img}">
                        <h2>${product.brand}</h2>
                        <h3>${product.name}</h3>
                        <br>
                        <h4 id="SameLine">SIZE ${size}&#x2228</h4>
                        <h4 id="SameLine">QTY ${qty} &#x2228</h4>
                        <h5 id="Price">${product.price}</h5>
                        <hr>
                    </li>
                    `
                });
            }
            ele.innerHTML += `
            <li id="OrderSummary">
                <h1>Order Summary</h1>
                <h3 id="subSummary">SUBTOTAL</h3>
                <h3 id="subSummary">$ ${totalPrice}</h3>
                <h3 id="subSummary">SHIPPING</h3>
                <h3 id="subSummary">$ 5</h3>
                <h3 id="subSummary">SALES TAX</h3>
                <h3 id="subSummary">$ 3.07</h3>
                <h2 id="Total">TOTAL</h2>
                <h2 id="Total">$ ${totalPrice + 8.07}</h2>
                <a href="#" id="Checkout">CHECKOUT</a> 
                <!--Will eventually link to the checkout page--> 
            </li>
            `
        });
    }


//Displays the list of saved items
/*
function displaySavedItems() {
    let list = JSON.parse(window.localStorage.getItem('savedItems'));
    let ele = document.getElementById('saved-items-main');
    let items = ""

    //If cart is empty
    if(list == null) {
        items = "<li id = \"Items\"><p>No saved items</p></li>";
        ele.innerHTML = items;

    //If cart is not empty
    } else {
        for (let i = 0; i < list.length; i++) {
            items += `
            <div class = "saved-item">
            <a href=# onclick = "removeItem(this, 'savedItems')">X</a>
                <a href=product.html onclick="saveCurrentItem(this)">
                    <p class = "saved-item-img">
                        <img src = "${list[i].img}">
                    </p>
                    <div class = "saved-item-text">
                        <p><strong>${list[i].brand}</strong></p>
                        <p class = 'saved-item-name'>${list[i].name}</p>
                        <p>${list[i].price}</p>
                    </div>
                </a>
            </div>
            `
        }
    }
    ele.innerHTML = items;
}*/

function displaySavedItems() {
    let user = firebase.auth().currentUser;
    console.log(firebase.auth(), user);
    let email = user.email;
    let ele = document.getElementById('saved-items-main');
    ele.innerHTML = "";

    let ref = database.ref("users").orderByChild('email').equalTo(email)
    ref.once('value').then((snapshot) => {
        let user = snapshot.val();   
        user = Object.values(user);
        let si = user[0].saveditems;
        //console.log(si, 'UUU')

        for (let i = 1; i < si.length; i++) {
             //Retrieves item from the DB
             var ref = database.ref('items').orderByChild('locator').equalTo(si[i]);
             ref.once('value').then((snapshot) => {
                let product = snapshot.val();   
                product = Object.values(product)[0];
                ele.innerHTML += `
                <div class = "saved-item">
                <a href=# onclick = "removeItem(this, 'savedItems')">X</a>
                    <a href=product.html onclick="saveCurrentItem(this)">
                        <p class = "saved-item-img">
                            <img src = "${product.img}">
                        </p>
                        <div class = "saved-item-text">
                            <p><strong>${product.brand}</strong></p>
                            <p class = 'saved-item-name'>${product.name}</p>
                            <p>${product.price}</p>
                        </div>
                    </a>
                </div>
                `
            });
        }
    });
}


//Saves item to display it as a product
function saveCurrentItem(loc) {
    const item = {
        brand: loc.getElementsByTagName('p')[1].innerText,
        name: loc.getElementsByTagName('p')[2].innerText,
        price: loc.getElementsByTagName('p')[3].innerText,
        img: loc.getElementsByTagName('img')[0].src
    }
    
    localStorage.setItem('product', JSON.stringify(item)); 
}

function saveBrandItem(loc) {
    let container = loc.parentElement.getElementsByTagName('div')[1];
    const item = {
        brand: document.getElementById('title2').getElementsByTagName('h1')[0].innerText,
        name: container.getElementsByTagName('h2')[0].innerText,
        price: container.getElementsByTagName('h3')[0].innerText,
        img: loc.getElementsByTagName('img')[0].src
    }
    //console.log(item);
    localStorage.setItem('product', JSON.stringify(item));
}


//Retrieves the product location which is brand_name used to find a product in the DB
function getProductLocator() {
    let product = JSON.parse(window.localStorage.getItem('product'));
    let locator = product.brand.toLowerCase() + '_' +  product.name.toLowerCase()
    return locator;
}


//Displays a product on product page
function displayProduct(product) {
    let ele = document.getElementById("product-page-container");
    ele.innerHTML = `
         <div id = "product-page-image">
            <img src = "${product.img}">
        </div>
        <div id = "product-page-description">
            <div id = "product-page-details">
                <h1 class = "product-description">${product.brand}</h1>
                <h2 class = "product-description">${product.name}</h2>
                <h2 class = "product-description">${product.price}</h2>
            </div>
            <h3>Color: ${product.color}</h3>
            <h3>Drop: ${product.drop}</h3>
            <div class = "size-dropdown">
                <div class = "size-selector">
                    <button onclick = "openSizeSelector(this)">Select Size</button>
                </div>
            </div>
            
            <button id = "add-to-cart-button" onclick = "addItem(this, 'cartItems')">Add To Bag</button>
            <button id = "save-item-button" onclick = "addItem(this, 'savedItems')">Save Item</button>
            
        </div>
    `
}

//Updates the nav bar to show the correct number of items in the cart
function updateNav(list) {
    //Gets the HTML cart element from the nav bar to update the number 
    let ele = document.getElementById("cart");
    let numItems = 0;
    for (let i = 0; i < list.length; i++) {
        numItems += list[i].qty;
    }
    let newCart = "<a href=Cart.html>Cart (" + (numItems) + ")</a>";
    ele.innerHTML = newCart;
}


//Sets HTML for the size selector in the product page
function openSizeSelector(button) {
    if (button.parentElement.getElementsByTagName('ul').length == 0) {
        button.parentElement.innerHTML = `
            <button onclick = "openSizeSelector(this)">Select Size</button>
            <ul>
                <li onclick="setSize(\`Small\`, this)">Small</li>
                <li onclick="setSize(\`Medium\`, this)">Medium</li>
                <li onclick="setSize(\`Large\`, this)">Large</li>
            </ul>
        `;
    } else {
        button.parentElement.innerHTML = `
            <button onclick = "openSizeSelector(this)">Select Size</button>
        `;
    } 
}

//Sets the HTML after size for a product is selected
function setSize(size, button) {
    let container = button.parentElement.parentElement;
    container.innerHTML = `
        <button onclick = "openSizeSelector(this)">Select Size: ${size}</button>
    `
    
}


//Displays the filter on the in-stock pagee
function displayFilterType(button, filter) {
    if (filter == 'category') {
        if ($('.filter-list')[0].style.display == 'block') {
            $('#category-list').hide();
        } else {
            $('#category-list').show();
        }

    } else if (filter == 'brand') {
        if ($('.filter-list')[1].style.display == 'block') {
            $('#brand-list').hide();
        } else {
            $('#brand-list').show();
        }

    } else if (filter == 'color') {
        if ($('.filter-list')[2].style.display == 'block') {
            $('#color-list').hide();
        } else {
            $('#color-list').show();
        }

    } else if (filter == 'size') {
        if ($('.filter-list')[3].style.display == 'block') {
            $('#size-list').hide();
        } else {
            $('#size-list').show();
        }
    }
}

//Displays the filters and storing on in-stock page when in a condensed view
function displayMobileFilters(action) {
    if (action == 'filter') {
        if ($('#mobile-sort')[0].style.display == 'flex') {
            $('#mobile-sort').hide();
        } else {
            $('#mobile-sort').css('display', 'flex');
        }
        $('#mobile-filter').hide();
    } else {
        if ($('#mobile-filter')[0].style.display == 'flex') {
            $('#mobile-filter').hide();
        } else {
            $('#mobile-filter').css('display', 'flex');
        }
        $('#mobile-sort').hide();
    }
}


//Dislpays the in-stock page with data from Firebase
function displayInStock(products) {
    let page = document.getElementById("in-stock-main");
    let content = "";
    for (let i = 0; i < products.length; i++) {
        content += `
            <div class = "in-stock-item" >
                <a href=product.html onclick="saveCurrentItem(this)">
                    <p class = "in-stock-img">
                        <img src = "${products[i].img}">
                    </p>
                    <div class = "in-stock-text">
                        <p><strong>${products[i].brand}</strong></p>
                        <p class = 'in-stock-item-name'>${products[i].name}</p>
                        <p>${products[i].price}</p>
                    </div>
                </a>
            </div>
        `
    }
    page.innerHTML = content;
}



//---------------------------Molly's Drop-down JS

function displayModal(){

    var modal = document.getElementById('id01');

    //when user clicks outside, it closes
    window.onclick= function(event){
        if(event.target == modal) {
            modal.style.display = "none";
        }
    }
}




