var magnet = getQueryStringValue('m');
var id = getQueryStringValue('id');
var name = getQueryStringValue('n');
var type = getQueryStringValue('t');
var season = getQueryStringValue('s');
var episode = getQueryStringValue('e');
var infoCnt = document.querySelector(".info");
var titleCnt = document.querySelector(".someTitle");
var downloadButton = document.querySelector("#downloadButton");
var downloadLink = document.querySelector("#downloadLink");
var torrentInfo = document.querySelector(".torrentInfo");
var imageCnt = document.querySelector(".someImage");
var moreCnt = document.querySelector(".more");
var playOnlineCnt = document.querySelector(".playOnline");
var playOnline = document.querySelector("#onlinePlayer");
var detailsCnt = document.querySelector("#details");
var __details;
var currentTime = 0;
var queriesDone = 0;

function fbScriptInit(){
  queriesDone += 1;
  if (queriesDone == 2){
    var user = firebase.auth().currentUser;
      if (type == "movie"){
        if (user != null){
        firebase.database().ref('resume/'+user.uid+'/movie/'+name).once('value').then(function(snapshot){
        toResume = snapshot.val();
        manipulateMovie();
        });
        }
        else {manipulateMovie();}
      }
      else if (type == "tv"){
        if (user != null){
        firebase.database().ref('resume/'+user.uid+'/tv/'+name+'_s'+season+'_e'+episode).once('value').then(function(snapshot){
        toResume = snapshot.val();
        manipulateTV();
        });
        }
        else {manipulateTV();}
      }
      else if (type == "torrent"){
        manipulateTorrent();
      }
      else {
        return false;
      }
  }
}
function manipulateTorrent(){
if (id != "" && magnet != "" && type == "torrent"){
  playOnlineCnt.style.display = "none";
  $(torrentInfo).addClass('padding');
  torrentInfo.innerHTML = "Hey if torrent is not playing that's because your ISP may have blocked torrent, try installing any VPN app or download torrent and then play!";
  var client = new WebTorrent();
  const movie_details = "https://yts.am/api/v2/movie_details.json";
  const movie_suggestions = "https://yts.am/api/v2/movie_suggestions.json";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      var returned = JSON.parse(xhttp.responseText);
      if (returned.status == "ok") {
        __details = returned.data.movie;
        downloadButton.innerHTML = "Download torrent";
        titleCnt.innerHTML = __details.title;
        infoCnt.innerHTML = __details.description_full;
        imageCnt.src = __details.large_cover_image;
        downloadLink.href = magnet;
        detailsCnt.classList.remove("none");
        progressedBar.max = __details.runtime * 60;
        var user = firebase.auth().currentUser;
        firebase.database().ref('resume/'+user.uid+'/torrent/'+__details.title).once('value').then(function(snapshot){
          toResume = snapshot.val();
        });
        moreCnt.innerHTML = "";
        fetch("https://yts.am/api/v2/movie_suggestions.json?movie_id="+__details.id).then(function(data){return data.json();}).then(function(data){
          var movies = data.data.movies;
          for(var i = 0; i < movies.length;i++){
          var img = document.createElement("img");
          $(img).addClass("featured-item-image");
          img.src = movies[i].medium_cover_image;
          var a = document.createElement("a");
          a.href = "../search#"+movies[i].id;
          a.appendChild(img);
          moreCnt.appendChild(a);
          }
          for(var series in dataDirectMovies){
          var img = document.createElement("img");
          $(img).addClass("featured-item-image");
          img.src = dataDirectMovies[series].image;
          var a = document.createElement("a");
          a.href = "../watch?t=movie&n="+dataDirectMovies[series].name;
          a.appendChild(img);
          moreCnt.appendChild(a);
        }
        });
      }
    }
  };
  xhttp.open("GET", movie_details + "?movie_id=" + id + "&with_images=true&with_cast=true", true);
  xhttp.send();
}
}
function manipulateTV(){
  playOnline.href = "http://saurabh.gq/play.php?u="+dataTV[name].seasons[season].episodes[episode];
  moreCnt.innerHTML = "";
  for(var series in dataTV){
        var img = document.createElement("img");
        $(img).addClass("featured-item-image");
        img.src = dataTV[series].poster;
        var a = document.createElement("a");
        a.href = "../tv?n="+dataTV[series].name;
        a.appendChild(img);
        moreCnt.appendChild(a);
      }
  var _o = dataTV[name];
  var _name = _o.name;
  var _poster = _o.poster;
  var _seasons = _o.seasons;
  titleCnt.innerHTML = _name + " S" + season + " : E" + parseInt(episode.replace("e",""));
  imageCnt.src = _poster;
  playOnlineCnt.classList.remove("none");
  detailsCnt.classList.remove("none");
  downloadLink.href = dataTV[name].seasons[season].episodes[episode];
  var list = document.createElement('div');
  list.id = 'list';
  $(list).addClass('list');
  infoCnt.appendChild(list);
  for(var i = 1; i < _seasons.length; i++){
    for(var _episode in _seasons[i].episodes){
      list.innerHTML += "<div class='list-item text-center bg-black capital'><a class='text-white ripple' href='../watch?t=tv&s="+i+"&e="+_episode+"&n="+name+"'>S"+i+" : E"+(parseInt(_episode.replace("e","")) + 1)+"</a></div>";
    }
  }
}
function manipulateMovie(){
  playOnline.href = "http://saurabh.gq/play.php?u="+dataDirectMovies[name].url;
  titleCnt.innerHTML = name;
  infoCnt.innerHTML = dataDirectMovies[name].description;
  imageCnt.src = dataDirectMovies[name].image;
  downloadLink.href = dataDirectMovies[name].url;
  playOnlineCnt.classList.remove("none");
  detailsCnt.classList.remove("none");
  moreCnt.innerHTML = "";
  for(var series in dataDirectMovies){
    var img = document.createElement("img");
    $(img).addClass("featured-item-image");
    img.src = dataDirectMovies[series].image;
    var a = document.createElement("a");
    a.href = "../watch?t=movie&n="+dataDirectMovies[series].name;
    a.appendChild(img);
    moreCnt.appendChild(a);
  }
}

function getQueryStringValue(key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}
function updateQueryString(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}
function doSearch(e){
  e = e || window.event;
  if (e.keyCode == 13){
    window.location = document.location.origin + '/search/?q='+ e.target.value;
  }
}