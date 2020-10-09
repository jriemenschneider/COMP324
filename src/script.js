//Uncomment the line below and refresh page to clear local storage
//localStorage.clear();

/*
*   This function will call immediatly when the page loads.
*/

window.onload = function() {
    //Sets cart to correct number in nav bar
    let itemsInCartArray = JSON.parse(window.localStorage.getItem('items'));
    let ele = document.getElementById("cart");
    if (itemsInCartArray) {
        let newCart = "Cart (" + (itemsInCartArray.length) + ")";
        ele.innerHTML = newCart;
    } 
    this.console.log(JSON.parse(window.localStorage.getItem('items')))
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

    //Gets the HTML cart element from the nav bar to update the number 
    let ele = document.getElementById("cart");
    let newCart = "Cart (" + (itemsInCartArray.length + 1) + ")";
    ele.innerHTML = newCart;

    //Gets the item details from the HTML
    let details = button.parentElement.getElementsByTagName("p");
    let b = details[0].textContent;
    let n = details[1].textContent;
    let p = details[2].textContent;

    //Creates an item object too save in array
    const item = {
        brand: b,
        name: n,
        price: p
    }

    //Add item to the array and save it in the local storage
    itemsInCartArray.push(item);
    localStorage.setItem('items', JSON.stringify(itemsInCartArray));
}


