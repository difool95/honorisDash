const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
const bodyParser = require('body-parser'); // middleware
var cors = require('cors');
const functions = require("firebase-functions");
const LocalStorage = require('node-localstorage').LocalStorage;

const auth = require ('firebase/auth');

const {initializeApp} = require ('firebase/app');
localStorage = new LocalStorage('./scratch');

const firebaseConfig = {
	apiKey: "AIzaSyBl4b-pmQCOv_zZWbQ1diX3auKJDFrYVbk",
	authDomain: "jnhonoris.firebaseapp.com",
	projectId: "jnhonoris",
	storageBucket: "jnhonoris.appspot.com",
	messagingSenderId: "940592772981",
	appId: "1:940592772981:web:62ec6d93e79e29ebb6053c",
	measurementId: "G-PHM38MYTX6"
  };
var corsOptions = {
  origin: true,
  'Access-Control-Allow-Credentials': 'true'
};



app.use(cors(corsOptions));
const fApp = initializeApp(firebaseConfig);
//const credentials = require("./jnhonoris-firebase-adminsdk-z68lt-f693b329af.json");
var useragent = require('express-useragent');
const { getAuth } = require("firebase/auth");
const { getFirestore, collection, getDocs, setDoc, doc, updateDoc} = require('firebase/firestore');
const db = getFirestore(fApp);



var corsOptions = {
  origin: true,
  'Access-Control-Allow-Credentials': 'true'
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(useragent.express());
app.use(express.static(__dirname));
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.static("css"));

app.get("/", (req, res) =>
{
		let reqPath = path.join(__dirname, './index.html');
		res.sendFile(reqPath);
});

app.get("/dash", (req, res) =>
{
	if(localStorage.getItem('loggedIn') == 'true'){
		let reqq = path.join(__dirname, './dash.html');
		res.sendFile(reqq);	
	}
	else{
		res.redirect('/');
	}
});



app.post('/signin', async(req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password
	}
	auth.signInWithEmailAndPassword(getAuth(),user.email,user.password).then((user)=>{
		localStorage.setItem('loggedIn', 'true');
		res.redirect('/dash');
	})
	.catch(function(error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		if(errorCode = 'auth/wrong-password'){
			return res.status(500).json({error: errorMessage});
		}
		else{
			return res.status(500).json({response: "signed in"}); 
		}
	});
});	

app.post('/signup', async(req, res) => {
	var count = 0;
		try {
			const querySnapshot = await getDocs(collection(db, "users"));
			querySnapshot.forEach((doc) => {
				console.log(`${doc.id} => ${doc.data()}`);
				  count += 1;
			});
			if(count <= 100){
				const userr = {
					email: req.body.email,
					password: req.body.password
				}
				auth.createUserWithEmailAndPassword(getAuth(), userr.email, userr.password).then(async (user)=>{
					console.log(user);
					try {
							await setDoc(doc(db, "users", user.user.uid), {
							nom: "none",
							 prenom: "none",
							  email: userr.email,
							   password: userr.password,
								birthProcess: true,
								 score_BP: "",
								  score_MP: "",
								   uid: ""}
								   ).then(()=>{
									return res.json({response: user.user.uid});
								   })
					  } catch (e) {
						console.error("Error adding document: ", e);
					  }
				})
				.catch(function(error) {
					let errorCode = error.code;
					return res.json({error: errorCode});
				});
			}
			else{
				return res.json({error: "account limit depassed"});
			}
		  } catch (e) 
		  {
			return res.json({error: "error when reading limits"});
		  }
});	

app.post('/resetdevice', async(req, res) => {
	const userr = {
		uid: req.body.uid,
	}
		try {
				await updateDoc(doc(db, "users", userr.uid), {
					   uid: ""}
					   ).then(()=>{
						return res.json({response: "done"});
					   })
		  } catch (e) 
		  {
			return res.json({error: "error when reseting device id"});
		  }
	
});	

app.get('/checklimit', async(req, res) => {
var count = 0;
		try {
			const querySnapshot = await getDocs(collection(db, "users"));
			querySnapshot.forEach((doc) => {
				console.log(`${doc.id} => ${doc.data()}`);
				  count += 1;
			});
			console.log(count);
			return res.json({used: count});
		  } catch (e) 
		  {
			return res.json({error: "error when reading limits"});
		  }
	
});	




app.post('/deleteUser', async(req, res)=>{
	const idUser = req.body.userId;
	console.log(idUser);
	getAuth().deleteUser(idUser).then(()=>{
		console.log('successfully deleted user');
	})
	.catch((error) => {
		console.log('Error deleting user:', error);
	})
});

app.post('/signout', async(req, res) => {

	auth.signOut(getAuth()).then((user)=>{
		localStorage.setItem('loggedIn', 'false');
		res.redirect('/');
	})
	.catch(function(error) {
		let errorCode = error.code;		
	});
});	

app.listen(process.env.PORT || 3000, function () {
		console.log("Server started on port:" + 3000);
	});
module.exports = app;
exports.api = functions.https.onRequest(app)