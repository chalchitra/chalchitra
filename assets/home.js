var queriesDone = 0;
function fbScriptInit(){
	queriesDone += 1;
	if (queriesDone == 2){
		document.querySelector('#featuredTVContainer').innerHTML = "";
		document.querySelector('#featuredDirectContainer').innerHTML = "";
		for(var series in dataTV){
			var img = document.createElement("img");
			$(img).addClass("featured-item-image");
			img.src = dataTV[series].poster;
			var a = document.createElement("a");
			a.href = "../tv?n="+dataTV[series].name;
			a.appendChild(img);
			document.querySelector('#featuredTVContainer').appendChild(a);
		}
		for(var movie in dataDirectMovies){
			var img = document.createElement("img");
			$(img).addClass("featured-item-image");
			img.src = dataDirectMovies[movie].image;
			var a = document.createElement("a");
			a.href = "../watch?t=movie&n="+dataDirectMovies[movie].name;
			a.appendChild(img);
			document.querySelector('#featuredDirectContainer').appendChild(a);
		}
	}
}

var _h = document.getElementById('header');
var _hi = document.getElementById('heroimg');
var _he = $(_hi).height();
window.addEventListener("scroll",function(){
	if(window.pageYOffset >= 50 && $(_h).hasClass("bg-white") != true){
		$(_h).addClass("bg-white shadow3");
		$(_h).removeClass("text-white");
	}
	else if(window.pageYOffset < 50 && $(_h).hasClass("bg-white") == true){
		$(_h).removeClass("bg-white shadow3");
		$(_h).addClass("text-white");
	}
});