const firebaseConfig = {
  apiKey: "AIzaSyBl4b-pmQCOv_zZWbQ1diX3auKJDFrYVbk",
  authDomain: "jnhonoris.firebaseapp.com",
  databaseURL: "https://jnhonoris.firebaseio.com",
  projectId: "jnhonoris",
  storageBucket: "jnhonoris.appspot.com",
  messagingSenderId: "940592772981",
  appId: "1:940592772981:web:62ec6d93e79e29ebb6053c",
  measurementId: "G-PHM38MYTX6"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

var editingBool = false;
var rows = document.getElementById("table").getElementsByTagName("tr");
var dashTable = document.getElementById("table");
db.collection('users').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {        
        var row = dashTable.insertRow(dashTable.rows.length),i;
        for (i = 0; i < 9; i++) {
          if(i == 7){
            row.insertCell(i).innerHTML = '<button onclick="edit_row(this)"><i class="fa-solid fa-pen-to-square"></i></button> <button style="display: none;" onclick="save_row2(this)"><i class="fa-solid fa-floppy-disk"></i></button> <button onclick="deleteRow(this)"><i class="fa-solid fa-trash"></i> </button> <button onclick="resetUid(this)"><i class="fa-solid fa-refresh"></i></button>';  
          }
          else{
            createCell(row.insertCell(i),  doc.data(), i, doc.id);
          }
        }
      ;})
  })

// create DIV element and append to the table cell
function createCell(cell, data, index, id) {
  if(index == 0){
    var txt = document.createTextNode(data['nom']);
    cell.appendChild(txt); 
  }
  if(index == 1){
    var txt = document.createTextNode(data['prenom']);
    cell.appendChild(txt); 
  }
  if(index == 2){
    var txt = document.createTextNode(data['email']);
    cell.appendChild(txt); 
  }
  if(index == 3){
    var txt = document.createTextNode(data['password']);
    cell.appendChild(txt); 
  }
  if(index == 4){
    var divBP = document.createElement("div");
    var radioBP = document.createElement("INPUT");
    radioBP.setAttribute("type", "checkbox");
    radioBP.setAttribute("name", "BP");
    
    divBP.appendChild(radioBP);
    radioBP.disabled = true;
    cell.appendChild(divBP); 
    if(data['birthProcess'] == ""){
      radioBP.checked = false;
    }
    else{
      radioBP.checked = true;
    }
  }
  /*if(index == 5){
    var divMP = document.createElement("div");
    var radioMP = document.createElement("INPUT");
    radioMP.setAttribute("type", "checkbox");
    radioMP.setAttribute("name", "MP");

    divMP.appendChild(radioMP);
    radioMP.disabled = true;

    cell.appendChild(divMP); 
    if(data['mecProcess'] == ""){
      radioMP.checked = false;
    }
    else{
      radioMP.checked = true;
    }
  }*/
  if(index == 5){
    if(data['score_MP'] == ""){
      var txt = document.createTextNode("");
    }
    else{
      var txt = document.createTextNode(data['score_MP']);
    }
    cell.appendChild(txt); 
  }

  if(index  == 6){
    if(data['uid'] == ""){
      var txt = document.createTextNode("");
    }
    else{
      var txt = document.createTextNode(data['uid']);
    }
    cell.appendChild(txt);
  }
  /*
  if(index == 7){
    if(data['score_MP'] == ""){
      var txt = document.createTextNode("");
    }
    else{
      var txt = document.createTextNode(data['score_MP']);
    }
    cell.appendChild(txt); 
  }*/
  if(index == 8){
    var txt = document.createTextNode(id);
    cell.appendChild(txt);
    cell.style.display = 'none';
  }
}

function doSearch() { 
  var q = document.getElementById("q");
  var v = q.value.toLowerCase();
  var on = 0;
  for ( var i = 0; i < rows.length; i++ ) {
    var fullname = rows[i].getElementsByTagName("td");
    fullname = fullname[0].innerHTML.toLowerCase();
    if ( fullname ) {
        if ( v.length == 0 || (v.length < 3 && fullname.indexOf(v) == 0) || (v.length >= 3 && fullname.indexOf(v) > -1 ) ) {
        rows[i].style.display = "";
        on++;
      } else {
        rows[i].style.display = "none";
      }
    }
  }
  var n = document.getElementById("noresults");
  if ( on == 0 && n ) {
    n.style.display = "";
    document.getElementById("qt").innerHTML = q.value;
  } else {
    n.style.display = "none";
  }
}

async function deleteRow(r) {
 /* const response = await fetch('/deleteUser', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({userId: r.parentNode.parentNode.children[9].textContent}) // body data type must match "Content-Type" header
  })
  .then((res)=>{
      console.log(res.status);
      
    })
    .catch((err)=>{
      console.log(err);
    });
*/
if(r.parentNode.parentNode.children[8].textContent == ""){
    document.getElementById("addnew").disabled = false;
    document.getElementById("addnew").style.background='#41040b';
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("user_table").deleteRow(i);
}
else{
  db.collection('users').doc(r.parentNode.parentNode.children[8].textContent).delete().then(()=>{
      document.getElementById("addnew").disabled = false;
      document.getElementById("addnew").style.background='#41040b';
      var i = r.parentNode.parentNode.rowIndex;
      document.getElementById("user_table").deleteRow(i);
}).catch((error)=>{
      console.error("Error removing document: ", error);
})
}

     
}

function edit_row(r)
{
    editingBool = true;
    var index = r.parentNode.parentNode.rowIndex;
    var rIndex = rows[index-1];

    rIndex.cells[7].children[0].style.display = "none";
    rIndex.cells[7].children[1].style.display = "inline";
    var nom=rIndex.cells[0];
    var prenom=rIndex.cells[1];
    var email=rIndex.cells[2];
    var password=rIndex.cells[3];
    var BP=rIndex.cells[4];
    var scoreBP=rIndex.cells[5];
    var uid = rIndex.cells[6];
    BP.children[0].children[0].disabled = false;
    //MP.children[0].children[0].disabled = false;

    var nom_data = nom.innerHTML;
    var prenom_data = prenom.innerHTML;
    var email_data = email.innerHTML;
    var password_data = password.innerHTML;
    var BP_data = BP.innerHTML;
    //var MP_data = MP.innerHTML;
    var score_dataBP = scoreBP.innerHTML;
    var uid_data = uid.innerHTML;
    ///var score_dataMP = scoreMP.innerHTML;



    nom.innerHTML="<input type='text' value='"+nom_data+"'>";
    prenom.innerHTML="<input type='text' value='"+prenom_data+"'>";
    email.innerHTML="<input type='text' readonly='readonly' value='"+email_data+"'>";
    password.innerHTML="<input type='text' readonly='readonly' value='"+password_data+"'>";

    scoreBP.innerHTML= score_dataBP;
    uid.innerHTML = uid_data;
    //scoreMP.innerHTML= score_dataMP;

}


function add_row()
{
    var table = document.getElementById("user_table");
    var row = table.insertRow(rows.length + 1);
    
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    //var cell9 = row.insertCell(8);
    //var cell10 = row.insertCell(9);

    // Add some text to the new cells:
    cell1.innerHTML = "<input type='text'>";
    cell2.innerHTML = "<input type='text'>";
    cell3.innerHTML = "<input type='text'>";
    cell4.innerHTML = "<input type='text'>";
    
    var divBP = document.createElement("div");
    var radioBP = document.createElement("INPUT");
    radioBP.setAttribute("type", "checkbox");
    radioBP.setAttribute("name", "MP");
    divBP.appendChild(radioBP);
    cell5.appendChild(divBP); 

    //var divMP = document.createElement("div");
    var radioMP = document.createElement("INPUT");
    radioMP.setAttribute("type", "checkbox");
    radioMP.setAttribute("name", "MP");
    //divMP.appendChild(radioMP);
    //cell6.appendChild(divMP); 
    
    cell6.innerHTML = "";
    cell7.innerHTML = "";
    //cell8.innerHTML = "";
    cell8.innerHTML = '<button style="display: none;" onclick="edit_row(this)"><i class="fa-solid fa-pen-to-square"></i></button> <button style="display: inline-block;" onclick="save_row2(this)"><i class="fa-solid fa-floppy-disk"></i></button> <button onclick="deleteRow(this)"><i class="fa-solid fa-trash"></i></button><button onclick="resetUid(this)"><i class="fa-solid fa-refresh"></i></button></td>';

    var txt = document.createTextNode("");
    cell9.appendChild(txt);
    cell9.style.display = 'none';

    if(rows.length > 99){
      document.getElementById("addnew").disabled = true;
      document.getElementById("addnew").style.background='#b2b2b2';
    }
}


function resetUid(r){
  var rowss = document.getElementById("user_table").getElementsByTagName("tr");
  var index = r.parentNode.parentNode.rowIndex;
  var rIndex = rowss[index];
  var uid=rIndex.cells[6];
  if(uid.innerHTML != ""){
    resetUidInDatabase(rIndex.cells[8].innerHTML);
    uid.innerHTML = "";
  }
}

function save_row2(r)
{
  editingBool = false;
  var namevalid = false;
  var prenomvalid = false;
  var emailvalid = false;
  var passwordvalid = false;
  var rowss = document.getElementById("user_table").getElementsByTagName("tr");
  var index = r.parentNode.parentNode.rowIndex;
  var rIndex = rowss[index];

  var nom=rIndex.cells[0].children[0];
  var prenom=rIndex.cells[1].children[0];
  var email=rIndex.cells[2].children[0];
  var password=rIndex.cells[3].children[0];
  var BP=rIndex.cells[4];
  //var MP=rIndex.cells[5];
  var scoreBP=rIndex.cells[5];
  var uid=rIndex.cells[6];
  //var scoreMP=rIndex.cells[7];

  var nom_val = nom.value;
  var prenom_val = prenom.value;
  var email_val = email.value;
  var password_val = password.value;
  var BP_data = BP.children[0].children[0].checked;
  //var MP_data = MP.children[0].children[0].checked;
  var score_dataBP = scoreBP.innerHTML;
  var uid_data = uid.innerHTML;
  //var score_dataMP = scoreMP.innerHTML;

  if(nom_val.length > 0){
    nom.style.borderColor = "#41040b";
    namevalid = true;
  }
  else{
    namevalid = false;
    nom.style.borderColor = "red";
  }
  if(prenom_val.length > 0){
      prenomvalid = true;
      prenom.style.borderColor = "#41040b";
  }
  else{
      prenomvalid = false;
      prenom.style.borderColor = "red";
  }
  if(validateEmail(email_val)){
      emailvalid = true;
      email.style.borderColor = "#41040b";
  }
  else{
      emailvalid = false;
      email.style.borderColor = "red";
  }
  if(password_val.length >= 6){
      password.style.borderColor = "#41040b";
      passwordvalid = true;
  }
  else{
      passwordvalid = false;
      password.style.borderColor = "red";
  }

if(namevalid && prenomvalid && emailvalid && passwordvalid){
    auth.createUserWithEmailAndPassword(email_val, password_val)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      BP.children[0].children[0].disabled = true;
      //MP.children[0].children[0].disabled = true;
      rIndex.cells[0].innerHTML = nom_val;
      rIndex.cells[1].innerHTML = prenom_val;
      rIndex.cells[2].innerHTML = email_val;
      rIndex.cells[3].innerHTML = password_val;
      rIndex.cells[4].children[0].children[0].checked = BP_data;
      //rIndex.cells[5].children[0].children[0].checked = MP_data;
      rIndex.cells[5] = score_dataBP;
      rIndex.cells[6] = uid_data;
      //rIndex.cells[7] = score_dataMP;
      rIndex.cells[7].children[0].style.display = "inline-block";
      rIndex.cells[7].children[1].style.display = "none";
      rIndex.cells[8].textContent = user.uid;
      createDocumentInDatabase(rIndex.cells[8].textContent, nom_val, prenom_val, email_val, password_val, BP_data, uid_data);
    })
    .catch((error) => {
      if(error.message == "The email address is already in use by another account."){
        BP.children[0].children[0].disabled = true;
        //MP.children[0].children[0].disabled = true;
        rIndex.cells[0].innerHTML = nom_val;
        rIndex.cells[1].innerHTML = prenom_val;
        rIndex.cells[2].innerHTML = email_val;
        rIndex.cells[3].innerHTML = password_val;
        rIndex.cells[4].children[0].children[0].checked = BP_data;
        //rIndex.cells[5].children[0].children[0].checked = MP_data;
        rIndex.cells[5] = score_dataBP;
        rIndex.cells[6] = uid_data;
        //rIndex.cells[7] = score_dataMP;
        rIndex.cells[7].children[0].style.display = "inline-block";
        rIndex.cells[7].children[1].style.display = "none";
        UpdateDatabase(rIndex.cells[8].textContent, nom_val, prenom_val, email_val, password_val, BP_data, uid_data);
      }
    });
  
}
}
function UpdateDatabase(id, nom, prenom, email, password, BP, uid_data){
    db.collection('users').doc(id).update({nom: nom, prenom: prenom, email: email, password: password, birthProcess: BP, uid: uid_data});
}

function createDocumentInDatabase(id, nom, prenom, email, password, BP, uid_data){
  db.collection('users').doc(id).set({nom: nom, prenom: prenom, email: email, password: password, birthProcess: BP, score_BP: "", score_MP: "", uid: uid_data});
}

function resetUidInDatabase(id){
  db.collection('users').doc(id).update({uid: ""})
}




const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


