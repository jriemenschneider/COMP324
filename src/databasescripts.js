

var config = {
    apiKey: "AIzaSyD8wJ0bFPY0Q9sQ2v4B2EXL_KWDwXZwNs0",
    authDomain: "comp-224.firebaseapp.com",
    databaseURL: "https://comp-224.firebaseio.com/",
    storageBucket: "comp-224.appspot.com"
};
firebase.initializeApp(config); 
const database = firebase.database();
const userref = database.ref('users');

function createUser() {
    email = document.getElementById("createEmail").value;
    password = document.getElementById("createPassword").value;
    name = document.getElementById("createName").value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        var user = firebase.auth().currentUser;
        
        userref.child(user.uid).set({
            // "user": user.value,
            "fullname": name,
            "saveditems": null,
            "email": email
            // "cartitems": cart.value
        });
    }, function(error) {
    // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}


