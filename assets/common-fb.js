if(document.location.pathname != "/watch/"){
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
}
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