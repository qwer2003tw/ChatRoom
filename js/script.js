$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC70aIbe-ovMItjjERfy6XCNiT6rNnjo_Q",
    authDomain: "asdf-63f6e.firebaseapp.com",
    databaseURL: "https://asdf-63f6e.firebaseio.com",
    projectId: "asdf-63f6e",
    storageBucket: "asdf-63f6e.appspot.com",
    messagingSenderId: "280118267631"
   };
  firebase.initializeApp(config);

  // Firebase database reference
  var dbChatRoom = firebase.database().ref().child('chatroom');
  var dbUser = firebase.database().ref().child('user');

  var photoURL;
  var $img = $('img');

  // REGISTER DOM ELEMENTS
  const $email = $('#email');
  const $password = $('#password');
  const $btnSignIn = $('#btnSignIn');
  const $btnSignUp = $('#btnSignUp');
  const $btnSignOut = $('#btnSignOut');
  const $hovershadow = $('.hover-shadow');
  const $btnSubmit = $('#btnSubmit');
  const $signInfo = $('#sign-info');
  const $file = $('#file');
  const $profileName = $('#profile-name');
  const $profileEmail = $('#profile-email');
  const $profileWork = $('#profile-work');
  const $profileAge = $('profile-age');
  const $profileIntroduction = $('profile-introduction');

  // Hovershadow
  $hovershadow.hover(
    function(){
      $(this).addClass("mdl-shadow--4dp");
    },
    function(){
      $(this).removeClass("mdl-shadow--4dp");
    }
  );
var user = firebase.auth().currentUser;
console.log('user---'+user);
  var storageRef = firebase.storage().ref();
    firebase.auth().onAuthStateChanged(function(user){
        $file.change(handleFileSelect);
        function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.target.files[0];

        var metadata = {
          'contentType': file.type
        };

        // Push to child path.
        // [START oncomplete]
        storageRef.child('images/' + user.uid).put(file, metadata).then(function(snapshot) {
          console.log('Uploaded', snapshot.totalBytes, 'bytes.');
          console.log(snapshot.metadata);
          photoURL = snapshot.metadata.downloadURLs[0];
          console.log(snapshot.metadata)
          console.log('File available at', photoURL);
        }).catch(function(error) {
          // [START onfailure]
          console.error('Upload failed:', error);
          // [END onfailure]
        });
        // [END oncomplete]
      }
    })
  

  window.onload = function() {
    // $file.disabled = false;
  }

  // SignIn/SignUp/SignOut Button status
  
  

  // Sign In
  $btnSignIn.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // signIn
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
    promise.then(function(){
      console.log('SignIn User');
      location.replace('./index.html')
      console.log('chage')

    });
  });

  // SignUp
  $btnSignUp.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // signUp
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
    promise.then(function(user){
      console.log("SignUp user is "+user.email);
      const dbUserid = dbUser.child(user.uid);
      dbUserid.push({email:user.email});
    });
  });

  // Listening Login User
  firebase.auth().onAuthStateChanged(function(user){
    if(user) {
      console.log(location.pathname);
      const loginName = user.displayName || user.email;
      $signInfo.html(loginName+" is login...");
      $btnSignIn.attr('disabled', 'disabled');
      $btnSignUp.attr('disabled', 'disabled');
      $btnSignOut.removeAttr('disabled')
      $profileName.html(user.displayName);
      console.log('2'+user.displayName);
      $profileEmail.html(user.email);
      $profileWork.html(user.work);
      $profileAge.html(user.age);
      $profileIntroduction.html(user.introduction);
      dbUserid.push({email:user.email,work:$('#work').val(),age:$('#age').val(),introduction:$('#introduction').val()});
      $img.attr("src",user.photoURL);
    } else {
      console.log("not logged in");
      $profileName.html("N/A");
      $profileEmail.html('N/A');
      $img.attr("src","");
    }
  });

  // SignOut
  $btnSignOut.click(function(){
    firebase.auth().signOut();
    console.log('LogOut');
    $signInfo.html('No one login...');
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')
  });

  // Submit
  $btnSubmit.click(function(){
    var user = firebase.auth().currentUser;
    const $userName = $('#userName').val();
    const $userWork = $('#work').val();
    const $userAge = $('#age').val();
    const $userIntroduction = $('#introduction').val();

    const promise = user.updateProfile({
      displayName: $userName,
      work:$userWork,
      age:$userAge,
      introduction:$userIntroduction,
      photoURL: photoURL
    });
    promise.then(function() {
      console.log("Update successful.");
      user = firebase.auth().currentUser;
      if (user) {
        $profileName.html(user.displayName);
        console.log('1'+user.displayName);
        $profileEmail.html(user.email);
        $profileWork.html(user.work);
        $profileAge.html(user.age);
        $profileIntroduction.html(user.introduction);
        $img.attr("src",user.photoURL);
        const loginName = user.displayName || user.email;
        $signInfo.html(loginName+" is login...");
      }
    });
  });

});
