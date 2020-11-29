var config = {
    apiKey: "AIzaSyD8wJ0bFPY0Q9sQ2v4B2EXL_KWDwXZwNs0",
    authDomain: "comp-224.firebaseapp.com",
    databaseURL: "https://comp-224.firebaseio.com/",
    storageBucket: "comp-224.appspot.com"
};
firebase.initializeApp(config); //this is causing me issues again
const database = firebase.database();
var rootRef = firebase.database().ref();
const userref = database.ref('users');
const storageRef = firebase.storage().ref();


storageRef.child('logo.jpg').getDownloadURL().then(function(url) {
    var img = document.getElementById('mylogo');
    img.src = url;
}, function(error) {});
storageRef.child('images/facebooklogo.png').getDownloadURL().then(function(url) {
    var img = document.getElementById('facebooklogo');
    img.src = url;
}, function(error) {});
storageRef.child('images/instagramlogo.png').getDownloadURL().then(function(url) {
    var img = document.getElementById('instagramlogo');
    img.src = url;
}, function(error) {});
storageRef.child('images/twitterlogo.png').getDownloadURL().then(function(url) {
    var img = document.getElementById('twitterlogo');
    img.src = url;
}, function(error) {});

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

function signIn() {
    
    email = document.getElementById("semail").value;
    password = document.getElementById("spassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
    document.getElementById('id01').style.display='none'

    if (firebase.auth().currentUser) {
        document.getElementById("profile").innerHTML = "PROFILE";
        
    }
}
