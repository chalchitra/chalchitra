var episodes = {};
var subtitles = {};
function fbScriptInit(){}
document.getElementById("addMovieButton").addEventListener("click",function(){
	var _name = document.getElementById("name");
	var _url = document.getElementById("url");
	var _quality = document.getElementById("quality");
	var _description = document.getElementById("description");
	var _image = document.getElementById("image");
	var _type = document.getElementById("type");
  var _subtitle = document.getElementById("subtitle");
	var _time = Date.now();
	firebase.database().ref('movies/' + _name.value).set({
    name: _name.value,
    url: _url.value,
    quality : _quality.value,
    description: _description.value,
    image: _image.value,
    type: _type.value,
    subtitle: _subtitle.value,
    others: "",
    date_added: _time
  },function(error) {
    if (error) {
      console.log("error : ",error);
      $().createToast("Failed to added",2,{background:'red',color:'white',borderRadius:'4px',width:'80%'});
    } else {
      $().createToast("Successfully added",2);
      _name.value = _url.value = _quality.value = _description.value = _image.value = _type.value = _subtitle.value = "";
    }
  });
});
document.getElementById("tvEnabler").addEventListener("click",function(){
	var pageContent = document.getElementById('page').innerHTML;
	document.getElementById('page').innerHTML = "";
	var innerHTML = `
	<div class="form bg-white center shadow2"><hr>
      <h2 class="text-center vertical-margin">For Television</h2><div class="divider"></div>
      <div id="wrapper1">
      <div class="material-input red padding">
        <input type="text" required="required" name="name" id="tvname">
        <span class="bar"></span>
        <label for="tvname">Name of series</label>
      </div>
      <div class="material-input pink padding">
        <input type="text" required="required" name="poster" id="tvposter">
        <span class="bar"></span>
        <label for="tvposter">Poster</label>
      </div>
      <div class="material-input blue padding">
        <input type="number" required="required" name="season" id="tvseason">
        <span class="bar"></span>
        <label for="tvseason">Season</label>
      </div>
      <div class="material-input green padding">
        <input type="text" required="required" name="episodes" id="tvepisodes">
        <span class="bar"></span>
        <label for="tvepisodes">Total episodes</label>
      </div>
      </div><hr>
      <div id="wrapper2">
      </div><hr>
      <button id="goSecondStepTV" class="btn center shadow2 bg-success ripple secondStep">Next</button><hr>
    </div>
	`;
	document.getElementById('page').innerHTML = innerHTML;
	document.getElementById("goSecondStepTV").addEventListener("click",function(){
		var number = document.getElementById("tvepisodes").value;
    document.querySelector(".secondStep").id = "completeTVStep";
    $("#completeTVStep").replaceClass("bg-success","bg-red");
		for(var i = 0;i < number;i++){
      wrapper2.innerHTML += `
      <div class="material-input pink padding">
        <input type="text" required="required" onkeyup="addToEpisodes()" id="${i}" name="episode${i}" data-episode="episode${i}">
        <span class="bar"></span>
        <label for="${i}">Episode ${i+1} URL</label>
      </div>
      <div class="material-input blue padding">
        <input type="text" required="required" onkeyup="addToSubtitles()" id="s${i}" name="subtitle${i}" data-subtitle="${i}">
        <span class="bar"></span>
        <label for="s${i}">Subtitle ${i+1} URL</label>
      </div>
      `;
    }

  document.getElementById('completeTVStep').addEventListener("click",function(){
    var _episodes = episodes;
    var _subtitles = subtitles;
    episodes = subtitles = {};

    firebase.database().ref('tv/' + document.getElementById("tvname").value).update({
      name: document.getElementById("tvname").value,
      poster: document.getElementById("tvposter").value
    });
    firebase.database().ref('tv/' + document.getElementById("tvname").value + '/seasons/' + document.getElementById("tvseason").value+'/episodes').update(_episodes);
    firebase.database().ref('tv/' + document.getElementById("tvname").value + '/seasons/' + document.getElementById("tvseason").value+'/subtitles').update(_subtitles,function(error){
      if (error){console.log(error);}
      else {
        document.location.reload();
      }
    });
  });

});
});
function addToEpisodes(e){
  e = e || window.event;
  var number = e.target.id;
  episodes["e"+number] = e.target.value;
}
function addToSubtitles(e){
  e = e || window.event;
  var number = e.target.id;
  subtitles[number] = e.target.value;
}