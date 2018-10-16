const list_movies = "https://yts.am/api/v2/list_movies.json";
const movie_details = "https://yts.am/api/v2/movie_details.json";

let __limit = 11;
let __page = 1;
let __quality = "All";
let __query_term = "0";
let __movie_count, __movies = [], __details, __suggestions, __comments, __reviews, dataMovies = [],dataMoviesLoaded = [];
let movElement = document.getElementById('mov');
var _pageY = [];
var shallStop = false;
var doneQueries = 0;

(function(){
 	var w = parseInt($(".page").width());
 	var n = w % 290;
 	var r = (w - n) + 15;
 	$("#scrollBox").width(r +"px");
	if (location.hash != "") {
		showMovieInfo(location.hash);
	}
	else{
		if(getQueryStringValue('q')){
			__query_term = getQueryStringValue('q');
			if (__query_term.length > 0){
				document.title = __query_term + " - Chalchitra search";
			}
		}
		if(getQueryStringValue('quality')){
			__quality = getQueryStringValue('quality');
		}
		if(getQueryStringValue('page')){
			__page = getQueryStringValue('page');
		}
		if(getQueryStringValue('limit')){
			__limit = getQueryStringValue('limit');
		}
		fetch('https://yts.am/api/v2/list_movies.json?limit='+__limit+"&page="+__page+"&quality="+__quality+"&query_term="+__query_term+"&random="+Math.floor(Math.random()*1000))
		.then(function(response) {
		    return response.json();
		 })
		.then(function(myJson) {
		   if (typeof myJson.data.movies == 'undefined') {
		   	dataMovies = [];
		   }
		   else {
		   dataMovies = myJson.data.movies;
			}
			_listMovies();
		  });
		$().createToast('Loading the content, please wait',4);
	}
}());

function fbScriptInit(){
	doneQueries += 1;
	if (doneQueries == 2){
		for(var series_name in dataTV){
			dataNamesTV.push(series_name);
		}
		for(var direct_name in dataDirectMovies){
			dataNamesDirect.push(direct_name);
		}
		dataFilteredTV = dataNamesTV.filter(
			function(name){
				return name.toLowerCase().indexOf(__query_term.toLowerCase()) != -1;
		});
		dataFilteredDirect = dataNamesDirect.filter(
			function(name){
				return name.toLowerCase().indexOf(__query_term.toLowerCase()) != -1;
		});
		document.querySelector('#featuredTVContainer').innerHTML = "";
		document.querySelector('#featuredDirectContainer').innerHTML = "";
		if (dataFilteredDirect.length == 0 && dataFilteredTV.length == 0){
			document.getElementById('featured').parentElement.removeChild(document.getElementById('featured'));
		}
		if (dataFilteredTV.length > 0){
			for(var i = 0; i < dataFilteredTV.length; i++){
			var img = document.createElement("img");
			$(img).addClass("featured-item-image");
			img.src = dataTV[dataFilteredTV[i]].poster;
			var a = document.createElement("a");
			a.href = "../tv?n="+dataTV[dataFilteredTV[i]].name;
			a.appendChild(img);
			document.querySelector('#featuredTVContainer').appendChild(a);
		}
		}
		else {
			if (document.getElementById('featuredTVContainer')){document.getElementById('featuredTVContainer').parentElement.removeChild(document.getElementById('featuredTVContainer'));
}		
		}
		if (dataFilteredDirect.length > 0){
			for(var i = 0; i < dataFilteredDirect.length; i++){
			var img = document.createElement("img");
			$(img).addClass("featured-item-image");
			img.src = dataDirectMovies[dataFilteredDirect[i]].image;
			var a = document.createElement("a");
			a.href = "../watch?t=movie&n="+dataDirectMovies[dataFilteredDirect[i]].name;
			a.appendChild(img);
			document.querySelector('#featuredDirectContainer').appendChild(a);
		}
		}
		else {
			if (document.getElementById('featuredDirectContainer')){
			document.getElementById('featuredDirectContainer').parentElement.removeChild(document.getElementById('featuredDirectContainer'));
		}
		}
		}
	}
window.onhashchange = function(){
	if (location.hash != "") {
		showMovieInfo(location.hash);
	}
	else {
		document.getElementById('mov').innerHTML = "";
		_listMovies();
	}
};

function _listMovies(){
	if (_pageY[0]){
		window.scrollTo(0,_pageY);
		_pageY = [];
	}
	if (document.getElementById("searchBox").classList.contains("none")){
		$("#searchBox").replaceClass("none","block");
		$("#scrollBox").replaceClass("none","block");
		$("#featured").replaceClass("none","block");
	}
 __movies = dataMovies;
 __movie_count = __movies.length;
 var sb = document.getElementById('scrollBox');
 if (dataMoviesLoaded.length == 0){sb.innerHTML = ''}
 
 if (dataTV.length > 0){
 	dataFilteredTV = dataTV.filter(function(series){
		return series.name.toLowerCase().indexOf(__query_term.toLowerCase()) != -1;
	})
 }
 if (dataMovies.length > 0){
 	var list_of_movies = dataMovies;
 	if (dataMoviesLoaded.length > 0){
 		list_of_movies = dataMoviesLoaded;
 		dataMoviesLoaded = [];
 	}
 	for(var i = 0; i < list_of_movies.length; i++){
 			var movieBox = `
 			<div class="movieBox" data-mid="${list_of_movies[i]['id']}" onclick="showMovieInfo(this)">
				<img class="mimage" src="${list_of_movies[i].large_cover_image}"/>
				<div class="mtitle">${list_of_movies[i].title}</div>
				<div class="mlanguage bg-blue">${list_of_movies[i].language}</div>
				<div class="mrating">${list_of_movies[i].rating}</div>
				<div class="msummary">${list_of_movies[i].summary}</div>
				<div class="myear bg-green">${list_of_movies[i].year}</div>
			</div>
 			`;
 			sb.innerHTML += movieBox;
 		}
 }
    
    if (__movie_count == 0){
    	$().createToast("No torrents found",3,{bottom:'50px',width:'80%',background:'red',color:'white'});
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

function showMovieInfo(ele){
	var id;
	if (typeof ele == "object") {
		id = ele.getAttribute('data-mid');
	}
	else{
		id = Number(ele.replace('#',''));
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	 var returned = JSON.parse(xhttp.responseText);
	    	 if (returned.status == "ok") {
	    	 	__details = returned.data.movie;
	    	 	renderMovieDetails();
	   		}
	    }
  	};
  xhttp.open("GET", movie_details + "?movie_id=" + id + "&with_images=true", true);
  xhttp.send();
}
function renderMovieDetails(){
	_pageY.push(window.pageYOffset);
	window.scrollTo(0,0);
	$().createToast('Loading the content',4,{background:'white',color:'black',borderRadius:'4px',width:'80%',bottom:'50px',animate:'fade'});
	$("#searchBox").replaceClass("block","none");
	$("#scrollBox").replaceClass("block","none");
	$("#featured").replaceClass("block","none");
	location.hash = __details.id;
	document.title = __details.title + " - Chalchitra";
	var movieDetailElemInnerHtml = `
				<img src="${__details.background_image_original}" class="movBg">
				<img src="${__details.large_cover_image}" class="movImage shadow3">
				<span class="movTitle">${__details.title}</span>
				<div class="movGenres" id="movGenres"></div>
				<div class="movIMDblink shadow1"><img src="../assets/IMDb.png"><a target="_blank" href="http://imdb.com/title/${__details.imdb_code}">IMDb link</a></div>
				<span class="movDownloaded shadow1"><img src="../assets/download.png" style="width:24px;height:24px;"/>${__details.download_count}</span>
				<span class="movRating shadow1"><img src="../assets/star.png">${__details.rating}</span>
				<div class="playbtns" id="playbtns">Watch online :</div>
				<div class="movImageGallery">
					<img class="shadow2" src="${__details.large_screenshot_image1}">
					<img class="shadow2" src="${__details.large_screenshot_image2}">
					<img class="shadow2" src="${__details.large_screenshot_image3}">
				</div>
				<div class="movTorrents" id="movTorrents">
					<table class="movTorrent">
					</table>
				</div>
				<div class="movDescription shadow4">
					${__details.description_full}
				</div>
	`;
	document.getElementById('mov').innerHTML = movieDetailElemInnerHtml;
	var movGenresEle = document.getElementById('movGenres');
		movGenresEle.innerHTML = "<span>"+__details.runtime+" minutes</span>";

	var movTorrentsEle = document.querySelector('#movTorrents .movTorrent');
	__details.torrents.forEach(function(ele){
		document.getElementById('playbtns').innerHTML += ` <a style="color:white" href="../watch/?t=torrent&m=${ele.url}&id=${__details.id}">${ele.quality}</a>`;
		var innerHTML = "<tr><td><img src='../assets/torrent.png' title='Torrent magnet link'><a href=\""+ele.url+"\" title=\"Magnet file\">Magnet file</a></td><td><a class=\"bg-red text-white\" href=\"../watch/?t=torrent&m="+ele.url+"&id="+__details.id+"\">Watch online</a></td><td>Hash : "+ele.hash+"</td><td>Quality : "+ele.quality+"</td><td>Size : "+ele.size+"</td><td>Seeds : "+ele.seeds+"</td><td>Peers : "+ele.peers+"</td></tr>";
		movTorrentsEle.innerHTML += innerHTML;
	});	
}

function doSearch(e){
	e = e || window.event;
	if (e.keyCode == 13){
		window.location = document.location.origin + '/search/?q='+ e.target.value;
	}
}
window.addEventListener('scroll',handleScroll);
function handleScroll(){
if (location.hash == ""){
if((window.pageYOffset + window.innerHeight) >= (document.body.scrollHeight
 - 50) && dataMovies != [] && shallStop != true){
	__page += 1;
	fetch('https://yts.am/api/v2/list_movies.json?limit='+__limit+"&page="+__page+"&quality="+__quality+"&query_term="+__query_term+"&random="+Math.floor(Math.random()*1000))
	.then(function(response){
		return response.json();
	})
	.then(function(myJson){
		if (typeof myJson.data.movies == 'undefined') {
			dataMoviesLoaded = [];
			$().createToast("No more torrents found",3,{bottom:'50px',width:'80%',background:'red',color:'white'});
			shallStop = true;
		}
		else {
			_pageY.push(window.pageYOffset);
			dataMovies = dataMovies.concat(myJson.data.movies);
			dataMoviesLoaded = myJson.data.movies;
			$().createToast("Loading more",0.5);
		}
		_listMovies();
	});
	}
}
}