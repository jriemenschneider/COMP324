var config = {
    apiKey: "AIzaSyD8wJ0bFPY0Q9sQ2v4B2EXL_KWDwXZwNs0",
    authDomain: "comp-224.firebaseapp.com",
    databaseURL: "https://comp-224.firebaseio.com/",
    storageBucket: "comp-224.appspot.com"
};
firebase.initializeApp(config); //This is where the issue is stemming from for me
const database = firebase.database();
var rootRef = firebase.database().ref();
const userref = database.ref('users');
const storageRef = firebase.storage().ref();
const user = firebase.auth().currentUser;

storageRef.child('logo.jpg').getDownloadURL().then(function(url) {
    var img = document.getElementById('mylogo');
    img.src = url;
}, function(error) {});

window.onload = function() {
    authStateListener();
    
    if (this.document.title == 'ProfilePage') {
        userProfile();
    }
}

function authStateListener() {
    // [START auth_state_listener]
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        
        var uid = user.uid;
        var fullNameRef = firebase.database().ref('users/' + uid + '/fullname');
        fullNameRef.on('value', (snapshot) =>{
            var name = snapshot.val();
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

function userProfile() {
    if (user) {
        // var user = firebase.auth().currentUser;
        var userID = user.uid;
        // document.getElementById("ProfileSpecs").innerHTML("active user");
        // return firebase.database().ref('/users/' + userID).once('value').then((snapshot) => {
        //     var name = (snapshot.val() && snapshot.val().fullname) || 'Error'; 
        // });
        var fullNameRef = firebase.database().ref('users/' + userID + '/fullname');
        fullNameRef.on('value', (snapshot) =>{
            var name = snapshot.val();
            document.getElementById("ProfileSpecs").innerHTML = name;
        });

        
    }
    else {
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
      document.getElementById("profile").innerHTML = "LOGIN";
      document.getElementById("profile").onclick = function () {
        document.getElementById('id01').style.display='block';
    };
    }).catch((error) => {
      // An error happened.
    });
    // [END auth_sign_out]
  }
