var config = {
    apiKey: "AIzaSyDxzxqDixtLYcEHsDlT87M2UazppFYt104",
    authDomain: "chalchitrausers.firebaseapp.com",
    databaseURL: "https://chalchitrausers.firebaseio.com",
    projectId: "chalchitrausers",
    storageBucket: "gs://chalchitrausers.appspot.com",
    messagingSenderId: "618607089827"
  };
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user){
    var signbtn = document.getElementById("signbtn");
    var signurl = document.getElementById("signurl");
    if (user){
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var logoutpath = "../logout";
      if (document.location.pathname == "/"){logoutpath = "logout";}
      signurl.href = logoutpath;
      signbtn.innerText = "SIGNOUT";
      $("#signbtn").replaceClass("bg-steelblue","bg-red");
      document.querySelector(".userInfoText").innerHTML = displayName+"<br/>"+email +"<hr/>";
      if (photoURL != null){
          document.querySelector('.material-nav_avatar').src = photoURL;
      }
    }
});
var _db = firebase.database();
var dataTV = [];
var dataDirectMovies = [];
var dataFilteredTV = [];
var dataFilteredDirect = [];
var dataNamesTV = [];
var dataNamesDirect = [];
firebase.database().ref('movies/').once('value').then(function(snapshot){
  dataDirectMovies = snapshot.val();
  fbScriptInit();
});
firebase.database().ref('tv/').once('value').then(function(snapshot){
  dataTV = snapshot.val();
  fbScriptInit();
});
let deferredPrompt;
window.addEventListener('beforeinstallprompt',function(e){
  e.preventDefault();
  deferredPrompt = e;
});
if (document.getElementById("installbutton") != null){
document.getElementById("installbutton").addEventListener("click",function(){
  if (typeof deferredPrompt != "undefined"){
  deferredPrompt.prompt();
  }
  else {
    $().createDialog({"title":"How to install","text":"Click on top right menu, select 'add to homescreen' or 'more tools' then 'create shortcut'","button1":"OK","action1":"cancel","background":"white"});
  }
});
}
window.addEventListener('appinstalled', (evt) => {
  document.getElementById("installappdiv").style.display = "none";
});
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie() {
    var d = getCookie("fbdialog");
    if (d == "") {
        return true;
    } else {
        return false;
    }
}
if (checkCookie()){
  setCookie("fbdialog","shown",6);
  $().createDialog({title:'Like us on facebook',text:'Did you love Chalchitra. Support it with your like and comments.',button1:'Like Now',button2:'No',action1:'https://facebook.com/chalchitraGA',action2:'cancel'},false);
}
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("div#todelete + div").parentElement.removeChild(document.querySelector("div#todelete + div"));
});
