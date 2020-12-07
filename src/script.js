

/*
*   This function will call immediatly when the page loads.
*/

window.onload = function() {
    //If on the in-cart page, display the items
    if (this.document.title == 'Cart') {
        displayCart();
    }else if (this.document.title == 'In Stock') {
        //this.inStockPictures();
        this.console.log("IN STOCK")
        test();
    } else if (this.document.title === 'Saved') {
        this.console.log("SAVED");
        displaySavedItems()

    }else if (this.document.title == "Product") {
        //this.displayProduct()
    } else if (this.document.title == "Brand Profile"){
        //this.displayBrandInfo(BrandProfile);
    }
}





/*
*   Adds an item to the cart or saved items list, currently saves the brand, name, and price as an object
*/

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
            if (s) {
                firebase.database().ref('users/' + userid + '/cartitems').set(currentItems);
            }

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
*/

function removeItem(button, location) {
    let user = firebase.auth().currentUser;
    let userid = user.uid
    let email = user.email;
     
    let itemToRemoveBrand = null;
    let itemToRemoveName = null;
    let itemToRemoveSize = null;
    
    //Gets details if a cart item is being removed
    if (location == 'cartItems') {
        itemToRemoveBrand = button.parentElement.getElementsByTagName("h2")[0].innerText;
        itemToRemoveName = button.parentElement.getElementsByTagName("h3")[0].innerText;
        itemToRemoveSize = button.parentElement.getElementsByTagName("h4")[0].innerText.slice(5,6);
        //Finds the current user
        let ref = database.ref("users").orderByChild('email').equalTo(email)
        ref.once('value').then((snapshot) => {
            let user = snapshot.val();   
            user = Object.values(user);
            let items = user[0].cartitems;
            for (let i = 1; i < items.length; i++) {
                if (itemToRemoveBrand.toLowerCase() + "_" + itemToRemoveName.toLowerCase() == items[i][0] && itemToRemoveSize == items[i][1]) {
                    //Retrieves item from the DB
                    var ref2 = database.ref('items').orderByChild('locator').equalTo(items[i][0]);
                    ref2.once('value').then((snapshot) => {
                        let product = snapshot.val();   
                        product = Object.values(product)[0];
                        price = product.price;
                        items[0] -= (parseInt(product.price.slice(1)) * items[i][2]);
                        items.splice(i, 1);
                        firebase.database().ref('users/' + userid + '/cartitems').set(items);
                    });
                }
            }
        });
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
                //console.log(items[i], itemToRemoveBrand.toLowerCase() + "_" + itemToRemoveName.toLowerCase())
                if (itemToRemoveBrand.toLowerCase() + "_" + itemToRemoveName.toLowerCase() == items[i]) {
                    items.splice(i, 1);
                }
            }
            firebase.database().ref('users/' + userid + '/saveditems').set(items);
        });
    }

    if (location == 'cartItems') {
        displayCart();
    } else {
        displaySavedItems();
    }
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }


/*
*   Basis for displaying the items in the cart once on the in-cart page
*/
function displayCart() {
    console.log("DISPLAY CART");
    console.log(user);

    sleep(1000).then(() => {
        let user = firebase.auth().currentUser;
        let ele = document.getElementById('cartContent');
        ele.innerHTML = "";
        let email = user.email;
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
    });
}
    
function findTotalPrice() {
    sleep(1000).then(() => {
        let ele = document.getElementById("amount-div");
        console.log(ele);
        let user = firebase.auth().currentUser;
        console.log(firebase.auth(), user);
        let email = user.email;
        let ref = database.ref("users").orderByChild('email').equalTo(email)
            ref.once('value').then((snapshot) => {
                let user = snapshot.val();   
                user = Object.values(user);
                let ci = user[0].cartitems;
                ele.innerHTML = `<input id="amount" type="number" value="${ci[0]}">`
            });
    });
}

//Displays the list of saved items
function displaySavedItems() {
    console.log("DISPLAY SAVED")
    sleep(1000).then(() => {
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
                        <a href=product.html onclick="saveCurrentItem(product)">
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
    });
}

//Retrieves the product location which is brand_name used to find a product in the DB
function getProductLocator() {
    let product = JSON.parse(window.localStorage.getItem('product'));
    let locator = product.brand.toLowerCase() + '_' +  product.name.toLowerCase()
    return locator;
}

//Displays a product on product page
function displayProduct(product) {
    console.log("P", product);
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

function getMeToBrandProfile(name){
    sessionStorage.setItem("n" , name);
    //save name to pass along somehow, then call name from BrandProfile html inline script
}
//Displays a brand's info on BrandProfile page
function displayBrandInfo(BrandProfile, name){
    console.log(typeof(BrandProfile));
    for( var i=0; i<BrandProfile.length; i++){
        console.log(typeof(BrandProfile[i]));
        name.trim();
        var brandid=JSON.stringify(BrandProfile[i].brandid);
        console.log(brandid);
        if(brandid===name){//need to find a way for it to be given the name
            let ele=document.getElementById('brand-profile-container');
            ele.innerHTML = `
            <div id = "title2">
            <br>
            <h1>${BrandProfile[i].brand}</h1>
        </div>
        <div class= "flex-container">
            <div class = "pictureContainers">
                <img src="${BrandProfile[i].logo}" width=auto height=500 >
            </div>
            <div class = "text">
                <br><br><br><br><br><br>
                <p>${BrandProfile[i].info}</p>
            </div>   
        </div>
        <div id= "title">
            <h2 style= "margin:20px"> ${BrandProfile[i].drop1}</h2>
        </div>
        <div class="flex-container" >
            <div id = "subfont">
                <div class = "pictureContainers" onclick = "saveBrandItem(this)">
                    <a href = "product.html">
                    <img alt="Object 1"  src="${BrandProfile[i].drop1item1img}" width=auto height= 200 > 
                    </a>
                </div>
                <div class = "captionContainer">
                    <h2>${BrandProfile[i].drop1item1name}</h2>
                    <h3>${BrandProfile[i].drop1item1price}</h3>
                </div>
           
            </div>
            <div id = "subfont">
                <div class = "pictureContainers">
                    <a href=>
                    <img alt="Object 1" src="${BrandProfile[i].drop1item2img}" width=auto height= 200>
                    </a>
                </div>
                <div class = "captionContainer">
                    <h2>${BrandProfile[i].drop1item2name}</h2>
                    <h3>${BrandProfile[i].drop1item2price}</h3>
                </div>
            </div>
            <div id = "subfont">
                <div class = "pictureContainers">
                    <a href=>
                    <img alt="" src="${BrandProfile[i].drop1item3img}" width=auto height= 200>
                    </a>
                </div>
            <div class = "captionContainer">
                <h2>${BrandProfile[i].drop1item3name}</h2>
                <h3>${BrandProfile[i].drop1item3price}</h3>
            </div>    
        </div>
        <div id = "subfont">
            <div class = "pictureContainers">
                <a href=>
                <img alt="Object 1" src="${BrandProfile[i].drop1item4img}" width=auto height= 200>
                </a>
            </div>
            <div class = "captionContainer">
                <h2>${BrandProfile[i].drop1item4name}</h2>
                <h3>${BrandProfile[i].drop1item4price}</h3>
            </div>    
        </div>
        <div id = "subfont">
            <div class = "pictureContainers">
                <a href=>
                <img alt="Object 1" src="${BrandProfile[i].drop1item5img}" width=auto height= 200 >
                </a>
            </div>
            <div class = "captionContainer">
                <h2>${BrandProfile[i].drop1item5name}</h2>
                <h3>${BrandProfile[i].drop1item5price}</h3>
            </div>    
        </div>
        <div id = "subfont">
            <div class = "pictureContainers">
                <a href=>
                <img alt="Object 1" src="${BrandProfile[i].drop1item6img}" width=auto height= 200>
                </a>
            </div>
            <div classs = "captionContainer">
                <h2>${BrandProfile[i].drop1item6name}</h2>
                <h3>${BrandProfile[i].drop1item6price}</h3>
            </div>    
        </div>
    </div>
    <div id= "title">
        <h2 style= "margin:20px"> ${BrandProfile[i].drop2}</h2>
    </div>
    <div class="flex-container" >
            <div class= "flex-container">
                <div id = "subfont"> 
                    <div class = "pictureContainers">
                        <a href=>
                        <img alt="Object 1" src="${BrandProfile[i].drop2item1img}" width=auto height= 200>
                        </a>
                    </div> 
                    <div class = "captionContainer">
                        <h2>${BrandProfile[i].drop2item1name}</h2>
                        <h3>${BrandProfile[i].drop2item1price}</h3>
                    </div>    
                </div>
                <div id = "subfont"> 
                    <div class = "pictureContainers">
                        <a href=>
                        <img alt="Object 1" src="${BrandProfile[i].drop2item2img}" width=auto height= 200>
                        </a>
                    </div>
                    <div class = "captionContainer">
                        <h2>${BrandProfile[i].drop2item2name}</h2>
                        <h3>${BrandProfile[i].drop2item2price}</h3>
                    </div>
                </div>
                <div id = "subfont"> 
                    <div class = "pictureContainers">
                        <a href=>
                        <img alt="Object 1" src="${BrandProfile[i].drop2item3img}" width=auto height= 200>
                        </a>
                    </div>
                    <div class = "captionContainer">    
                        <h2>${BrandProfile[i].drop2item3name}</h2>
                        <h3>${BrandProfile[i].drop2item3price}</h3>
                    </div>    
                </div>
                <div id = "subfont"> 
                    <div class = "pictureContainers">
                        <a href=>
                        <img alt="Object 1" src="${BrandProfile[i].drop2item4img}" width=auto height= 200>
                        </a>
                    </div>
                    <div class = "captionContainer">
                        <h2>${BrandProfile[i].drop2item4name}</h2>
                        <h3>${BrandProfile[i].drop2item4price}</h3>
                   </div> 
                </div>
                <div id = "subfont"> 
                    <div class = "pictureContainers">
                        <a href=>
                        <img alt="Object 1" src="${BrandProfile[i].drop2item5img}" width=auto height= 200>
                        </a>
                    </div>
                        <div class = "captionContainer">    
                        <h2>${BrandProfile[i].drop2item5name}</h2>
                        <h3>${BrandProfile[i].drop2item5price}</h3>
                    </div>
                </div>
                <div id = "subfont"> 
                    <div class = "pictureContainers">
                        <a href=>
                        <img alt="Object 1" src="${BrandProfile[i].drop2item6img}" width=auto height= 200>
                        </a>
                    </div>
                    <div class = "captionContainer">    
                        <h2>${BrandProfile[i].drop2item6name}</h2>
                        <h3>${BrandProfile[i].drop2item6price}</h3>
                    </div>    
                </div>
            </div>
        </div>
    `
    break;
        }
        }

    
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

//Dislpays the in-stock page with data from Firebase
function displayDropProduct(info) {
    let page = document.getElementById("drop-main");
    let content = "";
    for (let i = 0; i < info.length; i++) {
        content += `
            <div class = "drop-item" >
                <a href=product.html onclick="saveCurrentItem(this)">
                    <p class = "drop img">
                        <img src = "${info[i].img}">
                    </p>
                    <div class = "drop-text">
                        <p><strong>${info[i].brand}</strong></p>
                        <p>${info[i].name}</p>
                        <p>${info[i].price}</p>
                    </div>
                </a>
            </div>
        `
    }
    page.innerHTML = content;
}

//drops dropdown
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  
