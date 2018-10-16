var magnet = getQueryStringValue('m');
var id = getQueryStringValue('id');
var name = getQueryStringValue('n');
var type = getQueryStringValue('t');
var season = getQueryStringValue('s');
var episode = getQueryStringValue('e');
var progressedBar = document.querySelector('.progressedBar');
var progressedBarDisplay = document.querySelector('.progressedBarDisplay');
var bufferedBar = document.querySelector('.bufferedBar');
var progressBar = document.querySelector('.progressBar');
var playbtn = document.querySelector('.playpause');
var fullscreenbtn = document.querySelector('.fullscreen');
var mutebtn = document.querySelector('.mute');
var volumeBar = document.querySelector('.volume');
var hour = document.querySelector('#hour');
var minutes = document.querySelector('#minutes');
var seconds = document.querySelector('#seconds');
var go = document.querySelector(".go");
var plusTen = document.querySelector(".plusTen");
var minusTen = document.querySelector(".minusTen");
var video = document.querySelector("video");
var output = document.querySelector('#output');
var vTools = document.querySelector(".v-tools");
var currentTimeDiv = document.querySelector('.currentTime');
var caption = document.querySelector('.caption');
var remainingTimeDiv = document.querySelector('.remainingTime');
var doubleClickPanel = document.querySelector(".doubleClickPanel");
var infoCnt = document.querySelector(".info");
var titleCnt = document.querySelector(".someTitle");
var downloadButton = document.querySelector("#downloadButton");
var downloadLink = document.querySelector("#downloadLink");
var changeQuality = document.querySelector(".changeQuality");
var torrentInfo = document.querySelector(".torrentInfo");
var imageCnt = document.querySelector(".someImage");
var moreCnt = document.querySelector(".more");
var isfullscreen = false;
var volumeVal = 1;
var __details;
var hideTimer;
var currentTime = 0;
var queriesDone = 0;
var subtitle;
var toResume = {};

function timeCalculator(time){
  var t = time;
  var h = Math.floor(t/3600);
  var t2 = t;
  var t3 = t;
  var returnedTime = "";
  if (h > 0){
    returnedTime += String(h) + ":";
    t2 = Math.floor(t-(h*3600));
  }
  var m = Math.floor(t2/60);
  if (m >= 10){
    returnedTime += String(m) + ":";
    t3 = Math.floor(t2-(m*60));
  }
  else if (m > 0 && m < 10){
    returnedTime += "0"+String(m) + ":";
    t3 = Math.floor(t2-(m*60));
  }
  else {
    returnedTime += "00:";
  }
  var s = Math.floor(t3);
  if (s >= 10){
    returnedTime += String(s);
  }
  else if (s > 0 && s < 10){
    returnedTime += "0"+String(s);
  }
  else {
    returnedTime += "00";
  }
  return returnedTime;
}
caption.style.display = "none";
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

    client.add(magnet, function(torrent){
    var file = torrent.files.find(function(file){
      return file.name.endsWith('.mp4');
    });
    video.parentElement.removeChild(video);
    file.appendTo('#output');
    video = document.querySelector("#output video");
    video.controls = false;
    if (toResume != null){
    if (typeof toResume.time != "undefined"){
      video.currentTime = toResume.time;
    }}
    else {video.currentTime = 0;}
    $().createToast('Video loading',2);
    document.querySelector(".showbox").parentElement.removeChild(document.querySelector(".showbox"));
    video.addEventListener("timeupdate", function(){
      saveCurrentTime(video.currentTime);
      if (video.currentTime == video.duration){
        playbtn.innerHTML = "replay";
      }
      var t = Math.round(video.currentTime);
      var T = Math.round(video.duration);
      currentTimeDiv.innerHTML = timeCalculator(t);
      remainingTimeDiv.innerHTML = timeCalculator(T-t);

      var value = (100 / video.duration) * video.currentTime;
      progressedBar.value = Math.round(value).toFixed();
      progressedBarDisplay.style.width = Math.round((video.currentTime/video.duration)*80).toFixed() + "%";
    });
  });
}
}
function manipulateTV(){
  video.parentElement.removeChild(video);
  video = document.createElement("video");
  output.appendChild(video);
  video.autoplay = false;
  video.src = dataTV[name].seasons[season].episodes[episode];
  document.getElementsById("onlinePlayer").setAttribute("href","play.php?u="+dataTV[name].seasons[season].episodes[episode]);
  if (dataTV[name].seasons[season].episodes["s"+parseInt(episode)]){
    subtitle = dataTV[name].seasons[season].episodes["s"+parseInt(episode)];
    fetchSubtitle();
  }
    video.currentTime = 0;
    $().createToast("Loading movie");
  document.querySelector(".showbox").parentElement.removeChild(document.querySelector(".showbox"));
    if (toResume != null){
    if (typeof toResume.time != "undefined"){
      video.currentTime = toResume.time;
    }}
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
  titleCnt.innerHTML = _name;
  imageCnt.src = _poster;
  downloadLink.href = dataTV[name].seasons[season].episodes[episode];
  var list = document.createElement('div');
  list.id = 'list';
  $(list).addClass('list');
  infoCnt.appendChild(list);
  for(var i = 1; i < _seasons.length; i++){
    for(var _episode in _seasons[i].episodes){
      list.innerHTML += "<div class='list-item text-center bg-black capital'><a class='text-white ripple' href='../watch?t=tv&s="+i+"&e="+_episode+"&n="+name+"'>Season "+i+" : Episode "+(parseInt(_episode.replace("e","")) + 1)+"</a></div>";
    }
  }
video.addEventListener("timeupdate", function(){
  saveCurrentTime(video.currentTime);
  if (video.currentTime == video.duration){
    playbtn.innerHTML = "replay";
  }
  var t = Math.round(video.currentTime);
  var T = Math.round(video.duration);
  currentTimeDiv.innerHTML = timeCalculator(t);
  remainingTimeDiv.innerHTML = timeCalculator(T-t);

  var value = (100 / video.duration) * video.currentTime;
  progressedBar.value = Math.round(value).toFixed();
  progressedBarDisplay.style.width = Math.round((video.currentTime/video.duration)*80).toFixed() + "%";
});
  }
function manipulateMovie(){
  video.parentElement.removeChild(video);
  video = document.createElement("video");
  output.appendChild(video);
  video.autoplay = false;
  if (dataDirectMovies[name].subtitle){
    subtitle = dataDirectMovies[name].subtitle;
    fetchSubtitle();
  }
  document.getElementsById("onlinePlayer").setAttribute("href","play.php?u="+dataDirectMovies[name].url);
  video.src = dataDirectMovies[name].url;
  video.currentTime = 0;
  $().createToast("Loading movie!");
  document.querySelector(".showbox").parentElement.removeChild(document.querySelector(".showbox"));
  if (toResume != null){
  if (typeof toResume.time != "undefined"){
    video.currentTime = toResume.time;
  }}
  titleCnt.innerHTML = name;
  infoCnt.innerHTML = dataDirectMovies[name].description;
  imageCnt.src = dataDirectMovies[name].image;
  downloadLink.href = dataDirectMovies[name].url;
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
video.addEventListener("timeupdate", function(){
  saveCurrentTime(video.currentTime);
  if (video.currentTime == video.duration){
    playbtn.innerHTML = "replay";
  }
  var t = Math.round(video.currentTime);
  var T = Math.round(video.duration);
  currentTimeDiv.innerHTML = timeCalculator(t);
  remainingTimeDiv.innerHTML = timeCalculator(T-t);

  var value = (100 / video.duration) * video.currentTime;
  progressedBar.value = Math.round(value).toFixed();
  progressedBarDisplay.style.width = Math.round((video.currentTime/video.duration)*80).toFixed() + "%";
});
}

playbtn.addEventListener('click',function(){
if (video){
if (video.currentTime != video.duration){
  if (video.paused == true) {
    video.play();
    playbtn.innerHTML = "pause";
  } else {
    video.pause();
    playbtn.innerHTML = "play_arrow";
  }
}
else {
  playbtn.innerHTML = "pause";
  video.play();
  video.currentTime = 0;
  progressedBarDisplay.style.width = "0%";
  progressedBar.value = 0;
}
}
});
mutebtn.addEventListener("click",muteHandler);
function muteHandler(){
if(video){
  if (video.muted == false) {
    video.muted = true;
    mutebtn.innerHTML = "volume_off";
  } else {
    video.muted = false;
    mutebtn.innerHTML = "volume_up";
  }
}
}

fullscreenbtn.addEventListener("click",fullscreenHandler);
function fullscreenHandler(){
  if (isfullscreen){
    if(document.exitFullscreen) {
      document.exitFullscreen();
    }
    else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    isfullscreen = false;
    fullscreenbtn.innerHTML = "fullscreen";
  }
  else {
    if(output.requestFullscreen) {
      output.requestFullscreen();
    } else if(output.mozRequestFullScreen) {
      output.mozRequestFullScreen();
    } else if(output.webkitRequestFullscreen) {
      output.webkitRequestFullscreen();
    } else if(output.msRequestFullscreen) {
      output.msRequestFullscreen();
    }
    isfullscreen = true;
    fullscreenbtn.innerHTML = "fullscreen_exit";
  }
}
progressedBar.addEventListener("change", function(){
  if(video){
  var time = video.duration * (progressedBar.value / 100);
  video.currentTime = Math.round(time);
  progressedBarDisplay.style.width = Math.round((progressedBar.value/video.duration)*80) + "%";
}});
progressedBar.addEventListener("click", function(){if(video){
  var time = video.duration * (progressedBar.value / 100);
  video.currentTime = Math.round(time);
  progressedBarDisplay.style.width = Math.round((progressedBar.value/video.duration)*80) + "%";
}});
volumeBar.addEventListener("change", function(){if(video){
  video.volume = volumeBar.value;
}});
setInterval(function(){
  if (typeof video != 'undefined'){
    bufferedBar.style.width = (video.buffered/video.duration)*80;
  }
},1000);
hour.addEventListener("keydown",showPanel);
minutes.addEventListener("keydown",showPanel);
seconds.addEventListener("keydown",showPanel);
go.addEventListener('click',function(){
  var h = hour.value;
  var m = minutes.value;
  var s = seconds.value;
  var time = 0;
  if (h != ''){
    time += parseInt(h)*3600;
  }
  if (m != ''){
    time += parseInt(m)*60;
  }
  if (s != ''){
    time += parseInt(s);
  }
  if(video){video.currentTime = time;}
});
window.addEventListener('keyup',function(e){
if(video){
  e = e || window.event;
  e.preventDefault();
  if (e.which== 38 && volumeVal < 1){
    volumeVal = volumeVal + 0.1;
    volumeBar.value = volumeVal;
    video.volume = volumeBar.value;
  }
  else if (e.which == 40 && volumeVal > 0.1){
    volumeVal = volumeVal - 0.1;
    volumeBar.value = volumeVal;
    video.volume = volumeBar.value;
  }
  else if (e.which == 37){
    video.currentTime -= 10;
  }
  else if (e.which == 39){
    video.currentTime += 10;
  }
  else if (e.which == 32){
    if (video.paused == true) {
      video.play();
      playbtn.innerHTML = "pause";
    } else {
      video.pause();
      playbtn.innerHTML = "play_arrow";
    }
  }
  else if(e.which == 70){
    fullscreenHandler();
  }
  else if(e.which == 77){
    muteHandler();
  }
  else {
    return false;
  }
  showPanel();
}
});
plusTen.addEventListener("click",function(){
if(video){
  video.currentTime += 10;
}
});
minusTen.addEventListener("click",function(){if(video){
  video.currentTime -= 10;
}});
progressedBar.addEventListener("keydown",preventAction);
volumeBar.addEventListener("keydown",preventAction);
function preventAction(e){
  e = e || window.event;
  e.preventDefault();
  return false;
}
function saveCurrentTime(t){if(video){
  var user = firebase.auth().currentUser;
  if (user != null){
  if (type == "torrent"){
  firebase.database().ref('resume/'+user.uid+'/torrent/'+__details.title).update({
    time: t
  });
  }
  else if(type == "tv"){
  firebase.database().ref('resume/'+user.uid+'/tv/'+name+'_s'+season+'_e'+episode).update({
    time: t
  });
  }
  else if(type == "movie"){
  firebase.database().ref('resume/'+user.uid+'/movie/'+name).update({
    time: t
  });
  }
  else {
    return false;
  }
  }
}
}
function showPanel(){
if (progressedBarDisplay.classList.contains("zero-opacity")){
  $(".commonClass").removeClass("zero-opacity");
  setTimeout(function(){$(".commonClass").removeClass("none")},100);
}
  document.body.style.cursor = 'auto';

  clearTimeout(hideTimer);
  hideTimer = setTimeout(hidePanel, 2000);
}
function hidePanel(){
  $(".commonClass").addClass("zero-opacity none");
  document.body.style.cursor = 'none';
}
output.addEventListener('mousemove', showPanel);
output.addEventListener('mousewheel',function(e){if(video){
  e.preventDefault();
  if (e.wheelDelta < 0) {
    volumeVal = volumeVal + 0.1;
    volumeBar.value = volumeVal;
    video.volume = volumeBar.value;
    } else {
    volumeVal = volumeVal - 0.1;
    volumeBar.value = volumeVal;
    video.volume = volumeBar.value;
  }
}
});
$(doubleClickPanel).dblclick(function(e){
  e = e || window.event;
  var circle = document.createElement('span');
  doubleClickPanel.appendChild(circle);
  var d,
    width = doubleClickPanel.clientWidth,
    height = doubleClickPanel.clientHeight;
  if(width >= height) {
    d = width;
  } else {
    d = height; 
  }
circle.classList.add("sp-ripple");
circle.style.backgroundColor= "rgba(255,255,255,0.9)";
var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
scrollTop = window.pageYOffset || document.documentElement.scrollTop;
var coordX = scrollLeft + doubleClickPanel.getBoundingClientRect().x;
var coordY = scrollTop + doubleClickPanel.getBoundingClientRect().y;
var x = e.pageX - coordX - d / 2;
var y = e.pageY - coordY - d / 2;
circle.style.height = d+"px";
circle.style.width = d+"px";
circle.style.left = x + "px";
circle.style.top = y + "px";
setTimeout(function(){circle.style.display="none";},600);
  hidePanel();
  var w = parseInt($(output).width());
  if (video){
  if (e.clientX > Math.round(w/2)){
    video.currentTime += 10;
  }
  else {
    video.currentTime -= 10;
  }
}
});
$('#output').rightclick(function(e){
  e = e || window.event;
  e.preventDefault();
  return false;
});
caption.addEventListener("click",function(){
  if (document.querySelector(".videosubbar")){
    document.querySelector(".videosubbar").classList.toggle("none");
  }
});
function fetchSubtitle(){
if (typeof subtitle != undefined || subtitle != null){
caption.style.display = "block";
fetch(subtitle).then(function(r){
return r.text();
}).then(function(t){
  videosub_main(t);
});
}
}
function videosub_timecode_min(tc) {
  tcpair = tc.split(' --> ');
  return videosub_tcsecs(tcpair[0]);
}
function videosub_timecode_max(tc) {
  tcpair = tc.split(' --> ');
  return videosub_tcsecs(tcpair[1]);
}
function videosub_tcsecs(tc) {
  tc1 = tc.split(',');
  tc2 = tc1[0].split(':');
  secs = Math.floor(tc2[0]*60*60) + Math.floor(tc2[1]*60) + Math.floor(tc2[2]);
  return secs;
}
function videosub_main(sub) {
  var myVideo = document.getElementsByTagName('video')[0];
  var tracksupport = typeof myVideo.addTextTrack == "function" ? true : false;
  Array.prototype.map.call(
    document.querySelectorAll('video'),
    function(el) {
      var subcontainer = document.createElement("div");
      subcontainer.classList.add('videosubbar');
      el.parentNode.appendChild(subcontainer);
      var subcontainerspan = document.createElement("span");
      subcontainer.appendChild(subcontainerspan);
      el.subcontainer = subcontainerspan;
      el.update = function(req) {
        el.subtitles = new Array();
        records = req.replace('\r', '').split('\n\n');
        for (var r=0;r<records.length;r++) {
          record = records[r];
          el.subtitles[r] = new Array();
          el.subtitles[r] = record.split('\n');
        }
      };
      el.update(sub.trim());
      el.subcount = 0;
      el.addEventListener('play', function(an_event){
        el.subcount = 0;
      });
      el.addEventListener('ended', function(an_event){
        el.subcount = 0;
      });
      el.addEventListener('seeked', function(an_event){
        el.subcount = 0;
        while (videosub_timecode_max(el.subtitles[el.subcount][1]) < this.currentTime.toFixed(1)) {
          el.subcount++;
          if (el.subcount > el.subtitles.length-1) {
            el.subcount = el.subtitles.length-1;
            break;
          }
        }
      });
      el.addEventListener('timeupdate', function(an_event){
        var subtitle = '';
        if (this.currentTime.toFixed(1) > videosub_timecode_min(el.subtitles[el.subcount][1])  &&  this.currentTime.toFixed(1) < videosub_timecode_max(el.subtitles[el.subcount][1])) {
          subtitle = el.subtitles[el.subcount].slice(2).join('<br>');
        }
        if (this.currentTime.toFixed(1) > videosub_timecode_max(el.subtitles[el.subcount][1])  && el.subcount < (el.subtitles.length-1)) {
          el.subcount++;
        }
        if(this.subcontainer.innerHTML != subtitle){
          this.subcontainer.innerHTML = subtitle;
        }
      });
  });
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