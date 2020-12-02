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
var user = firebase.auth().currentUser;

storageRef.child('logo.jpg').getDownloadURL().then(function(url) {
    var img = document.getElementById('mylogo');
    img.src = url;
    var img2= document.getElementById('mobile-logo');
    img2.src=url;
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

window.onload = function() {
    console.log("window loaded");
    authStateListener();
    

    
}

// document.onload = function() {
//     if (this.document.title == 'Profile') {
//         console.log("on profile page");
//         userProfile();
//     }
// }

function authStateListener() {
    // [START auth_state_listener]
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          console.log("there is a user");
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        
        var uid = user.uid;
        var fullNameRef = firebase.database().ref('users/' + uid + '/fullname');
        fullNameRef.on('value', (snapshot) =>{
            var name = snapshot.val();
            if (document.getElementById("ProfileSpecs")) {
                userProfile(name);
            }
        });
        
        document.getElementById("profile").innerHTML = "PROFILE";
        document.getElementById("profile").setAttribute('href', 'ProfilePage.html');
        document.getElementById("profile").onclick = function () {
            location.href = "ProfilePage.html";
        };
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
}

function userProfile(name) {
    console.log("enterd user profile");
    if (firebase.auth().currentUser) {
        // var user = firebase.auth().currentUser;
        // var userID = user.uid;
        // var fullNameRef = firebase.database().ref('users/' + userID + '/fullname');
        // fullNameRef.on('value', (snapshot) =>{
        //     var name = snapshot.val();
        //     document.getElementById("ProfileSpecs").innerHTML = name;
        // });
        document.getElementById("ProfileSpecs").innerHTML = name;
        document.getElementById("userEmail").placeholder = firebase.auth().currentUser.email;


        
    }
    else {
        console.log("no user");
        document.getElementById("ProfileSpecs").textContent = "no user";
    }
}

function createUser() {
    email = document.getElementById("createEmail").value;
    password = document.getElementById("createPassword").value;
    name = document.getElementById("createName").value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        var user = firebase.auth().currentUser;
        
        userref.child(user.uid).set({
            // "user": user.value,
            "fullname": name,
            "saveditems": Set(),
            "email": email,
            "cartitems": [0]
        });
    }, function(error) {
    // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}

function signIn() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }

    email = document.getElementById("semail").value;
    password = document.getElementById("spassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
          return;
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
        document.getElementById("profile").setAttribute('href', 'ProfilePage.html');
        document.getElementById("profile").onclick = function () {
            location.href = "ProfilePage.html";
        };
    }
}

function signOut() {
    // [START auth_sign_out]
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      location.href = "index.html";
      document.getElementById("profile").innerHTML = "LOGIN";
      document.getElementById("profile").onclick = function () {
        document.getElementById('id01').style.display='block';
        };
        
    }).catch((error) => {
      // An error happened.
    });
    // [END auth_sign_out]
  }
