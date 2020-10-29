// initializing database
var config = {
    apiKey: "AIzaSyD8wJ0bFPY0Q9sQ2v4B2EXL_KWDwXZwNs0",
    authDomain: "comp-224.firebaseapp.com",
    databaseURL: "https://comp-224.firebaseio.com/",
    storageBucket: "comp-224.appspot.com"
};
firebase.initializeApp(config);

  // Get a reference to the database service
var database = firebase.database();

function createUser(email, password, name, cart) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        var user = firebase.auth().currentUser;
        addUser(user); // Optional
    }, function(error) {
    // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
    function addUser(user) {
       var ref = firebase.database().ref("users");
        var obj = {
            "user": user,
            "fullname": name,
            "saveditems": null,
            "cartitems": cart
        };
        ref.push(obj); // or however you wish to update the node
    }
}
