var queriesDone = 0;
function fbScriptInit(){
	queriesDone += 1;
	if (queriesDone == 2){
		if (getQueryStringValue('n') == ""){
			document.querySelector('.showbox').parentElement.removeChild(document.querySelector('.showbox'));
			document.querySelector('#featuredTVContainer').innerHTML = "";
			var w = parseInt($("#featuredTVContainer").width());
 			var n = w % 195;
 			var r = (w - n) + 15;
 			$("#featuredTVContainer").width(r +"px");
			for(var series in dataTV){
				var img = document.createElement("img");
				$(img).addClass("featured-item-image");
				img.src = dataTV[series].poster;
				var a = document.createElement("a");
				a.href = "../tv?n="+dataTV[series].name;
				a.appendChild(img);
				document.querySelector('#featuredTVContainer').appendChild(a);
			}
		}
		else {
			document.querySelector(".display").innerHTML = "";
			var n = getQueryStringValue('n');
			var o = dataTV[n];
			var name = o.name;
			var poster = o.poster;
			var seasons = o.seasons;
			var innerHTML = `
			<hr>
			<h1 class="text-center text-primary font-500">${name}</h1><br>
			<img src="${poster}" class="display-img center block shadow3"/><br>
			<div class="list" id="list">
			</div>
			`;
			document.querySelector(".display").innerHTML = innerHTML;
			var list = document.getElementById('list');
			for(var i = 1; i < seasons.length; i++){
				for(var episode in seasons[i].episodes){
					list.innerHTML += "<div class='list-item text-center bg-black capital'><a class='text-white ripple' href='../watch?t=tv&s="+i+"&e="+episode+"&n="+name+"'>S"+i+" : E"+(parseInt(episode.replace("e","")) + 1)+"</a></div>";
				};
			}
				
		}
	}
}

function getQueryStringValue(key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}
function doSearch(e){
	e = e || window.event;
	if (e.keyCode == 13){
		window.location = document.location.origin + '/search/?q='+ e.target.value;
	}
}