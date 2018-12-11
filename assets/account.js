var queriesDone = 0;
function fbScriptInit(){
	queriesDone += 1;
	if (queriesDone == 1){
		var user = firebase.auth().currentUser;
		if (user != null){
			const user = firebase.auth().currentUser;
			var name, email, __photoUrl;
			  name = user.displayName;
			  email = user.email;
			  __photoUrl = user.photoURL;

			var _name = document.getElementById("name");
			var _email = document.getElementById("email");
			var _photo = document.getElementById("photo");
			var _photoInput = document.getElementById("photoInput");
			var namebtn = document.getElementById("namebtn");
			var emailbtn = document.getElementById("emailbtn");
			var deleter = document.getElementById("deleter");

			_name.value = name;
			_email.value = email;
			_photo.src = __photoUrl;

			_photoInput.addEventListener("input",function(){
				var file = _photoInput.files[0];
			    var ref = firebase.storage().ref(user.uid + '/profilePicture/');
				var metadata = {contentType: file.type};
				var task = ref.child(file.name).put(file, metadata);
				task.then(function(snapshot){return snapshot.ref.getDownloadURL();})
					.then(function(url){
						$().createDialog("Uploading",{background:'green',color:'white'});
					    _photo.src = url;
					    user.updateProfile({
						  photoURL: url
						}).then(function() {
						 	$().createDialog("Success! Profile picture changed");
						}).catch(function(error) {
							console.log(error);
							$().createDialog("An error occured while updating!",2,{background:'red',color:'white'});
						});
					})
					.catch(function(error){
						console.log(error);
						$().createDialog("An error occured while uploading!",2,{background:'red',color:'white'});
					});
			});
			namebtn.addEventListener('click',function(){
				user.updateProfile({
					  displayName: _name.value,
					}).then(function() {
						$().createDialog("Success! Name changed");
					}).catch(function() {
						$().createDialog("An error occured!",2,{background:'red',color:'white'});
					});
			});
			emailbtn.addEventListener('click',function(){
				$().createDialog({title:'Password',content:'Your password is required<br><div class="material-input indigo textCnt"><input type="password" name="password" id="password" required="required"/><span class="bar"></span><label for="password">Password</label></div>',button1:'CONTINUE',button2:'cancel',action2:'cancel',action1:function(){
					var pssd = document.getElementById('password');
					var credential = firebase.auth.EmailAuthProvider.credential(user.email,pssd);
					user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
					user.updateEmail(_email.value).then(function() {
						$().createDialog("Success! Email changed");
						setTimeout(function(){document.location.reload();},1000);
					}).catch(function() {
						$().createDialog("An error occured!",2,{background:'red',color:'white'});
					});
				}).catch(function() {
					$().createDialog("An error occured!",2,{background:'red',color:'white'});
				});
				}},false);
			});
			deleter.addEventListener("click",function(){
				$().createDialog({title:'Delete account',text:'It will delete your user account from Chalchitra, you may need to signup again',button1:'DELETE',action1:function(){
					$().createDialog({title:'Password',content:'Your password is required<br><div class="material-input indigo textCnt"><input type="password" name="password" id="password" required="required"/><span class="bar"></span><label for="password">Password</label></div>',button1:'CONTINUE',button2:'cancel',action2:'cancel',action1:function(){
					var pssd = document.getElementById('password');
					var credential = firebase.auth.EmailAuthProvider.credential(user.email,pssd);
					user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
					user.delete().then(function(){
						$().createDialog("Success! Account deleted");
						setTimeout(function(){document.location.reload();},1000);
					}).catch(function() {
						$().createDialog("An error occured!",2,{background:'red',color:'white'});
					});
				}).catch(function() {
					$().createDialog("An error occured!",2,{background:'red',color:'white'});
				});
				}},false);
				}});
			});

		}
		else {
			document.getElementById('userInfoCnt').innerHTML = "<a href='../login' class='block center text-center curved'><button class='btn bg-red shadow1 ripple'>Login or signup</button></a>";
		}
	}
}
