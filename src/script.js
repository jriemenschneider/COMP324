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
    }

    //Sets cart to correct number in nav bar
    let itemsInCartArray = JSON.parse(window.localStorage.getItem('items')); 
    this.updateNav(itemsInCartArray);
    

}



/*
*   Adds an item to the cart, currently saves the brand, name, and price as an object
*/
function addItemToCart(button) {
    //Gets the array of items already in the cart from local storage
    let itemsInCartArray = JSON.parse(window.localStorage.getItem('items'));
    if(itemsInCartArray == null) {
        itemsInCartArray = [];
    }

    //Gets the item details from the HTML
    let details = button.parentElement.getElementsByTagName("p");
    let b = details[0].textContent;
    let n = details[1].textContent;
    let p = details[2].textContent;

    //Gets url for item image
    let i = button.parentElement.parentElement.getElementsByTagName("p")[0].getElementsByTagName("img")[0].src;
    

    //Creates an item object too save in array
    const item = {
        brand: b,
        name: n,
        price: p,
        img: i,
        qty: 1
    }

    //Checks to see if item is already in the cart
    let found = false;
    for (let i = 0; i < itemsInCartArray.length; i ++) {
        if (itemsInCartArray[i].brand == item.brand && itemsInCartArray[i].name == item.name) {
            found = true;
            itemsInCartArray[i].qty += 1;
        }
    }

    //Add item to the array and save it in the local storage
    if (!found) {
        itemsInCartArray.push(item);
    }
    localStorage.setItem('items', JSON.stringify(itemsInCartArray));

    //Gets the HTML cart element from the nav bar to update the number 
    updateNav(itemsInCartArray);
}


/*
*   Basis for displaying the items in the cart once on the in-cart page
*/
function displayCart() {
    let itemsInCartArray = JSON.parse(window.localStorage.getItem('items'));
    let ele = document.getElementById('Content');
    let totalPrice = 0;
    let numItems = 0;
    

    //If cart is empty
    if(itemsInCartArray == null) {
        let cart = "<li id = \"Items\"><p>Cart is empty</p></li>";
        ele.innerHTML = cart;

    //If cart is not empty
    } else {
        numItems += 1;
        let cart = "";
        for (let i = 0; i < itemsInCartArray.length; i++) {
            totalPrice += parseInt(itemsInCartArray[i].price.slice(1)) * itemsInCartArray[i].qty;
            cart += `
            <li id= "Items">
                <hr>
                <a href=#>X</a>
                <img src="${itemsInCartArray[i].img}">
                <h2>${itemsInCartArray[i].brand}</h2>
                <h3>${itemsInCartArray[i].name}</h3>
                <br>
                <h4 id="SameLine">SIZE &#x2228</h4>
                <h4 id="SameLine">QTY ${itemsInCartArray[i].qty} &#x2228</h4>
                <h5 id="Price">${itemsInCartArray[i].price}</h5>
                <hr>
            </li>
            `
        }

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
    }

function updateNav(itemsInCartArray) {
    //Gets the HTML cart element from the nav bar to update the number 
    let ele = document.getElementById("cart");
    let numItems = 0;
    for (let i = 0; i < itemsInCartArray.length; i++) {
        numItems += itemsInCartArray[i].qty;
    }
    let newCart = "<a href=Cart.html>Cart (" + (numItems) + ")</a>";
    ele.innerHTML = newCart;
}




