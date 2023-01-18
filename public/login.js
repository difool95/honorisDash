/*const firebaseConfig = {
  apiKey: "AIzaSyBl4b-pmQCOv_zZWbQ1diX3auKJDFrYVbk",
  authDomain: "jnhonoris.firebaseapp.com",
  databaseURL: "https://jnhonoris.firebaseio.com",
  projectId: "jnhonoris",
  storageBucket: "jnhonoris.appspot.com",
  messagingSenderId: "940592772981",
  appId: "1:940592772981:web:62ec6d93e79e29ebb6053c",
  measurementId: "G-PHM38MYTX6"
};
  //Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  let signInButton = document.getElementById('signin')
  
 
//This method gets invoked in the UI when there are changes in the authentication state:
// 1). Right after the listener has been registered
// 2). When a user is signed in
// 3). When the current user is signed out
// 4). When the current user changes

//Lifecycle hooks
auth.onAuthStateChanged(function(user) {
  if (user) {

    var email = user.email
  
    var users = document.getElementById("user")
    var text = document.createTextNode(email);

    users.appendChild(text);

    console.log(users)
    //is signed in
  } else {
    //no user signed in
  }
})*/