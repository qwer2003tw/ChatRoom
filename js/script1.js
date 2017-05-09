$(document).ready(function(){
  // Initialize Firebase

  // Firebase database reference
  var dbChatRoom = firebase.database().ref().child('chatroom');
  var dbUser = firebase.database().ref().child('user');
  var storageRef = firebase.storage().ref();
    
  // REGISTER DOM ELEMENTS
  const $messageField = $('#messageInput');
  const $nameField = $('#nameInput');
  const $messageList = $('#chat-messages');
  const $email = $('#email');
  const $password = $('#password');
  const $btnSignIn = $('#btnSignIn');
  const $btnSignUp = $('#btnSignUp');
  const $btnSignOut = $('#btnSignOut');
  const $message = $('#example-messages');
  const $hovershadow = $('.hover-shadow');
  const $signInfo = $('#sign-info');
  var user = firebase.auth().currentUser;
  console.log('user1---'+user);

  // Hovershadow
  $hovershadow.hover(
    function(){
      $(this).addClass("mdl-shadow--4dp");
    },
    function(){
      $(this).removeClass("mdl-shadow--4dp");
    }
  );

  // SignIn/SignUp/SignOut Button status
  
  if (user) {
    $btnSignIn.attr('disabled', 'disabled');
    $btnSignUp.attr('disabled', 'disabled');
    $btnSignOut.removeAttr('disabled')
  } else {
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')
  }

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
      $btnSignOut.removeAttr('disabled')
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
      console.log(user);
      $signInfo.html(user.email+" is login...");
      $btnSignIn.attr('disabled', 'disabled');
      $btnSignUp.attr('disabled', 'disabled');
      $btnSignOut.removeAttr('disabled')
      // Add a callback that is triggered for each chat message.
      dbChatRoom.limitToLast(10).on('child_added', function (snapshot) {
        //GET DATA
        var data = snapshot.val();
        var username = data.name || "anonymous";
        var message = data.text;
        var uid = data.uid;
        var starsRef = storageRef.child('/images/'+uid);
        var img;
        var $messageElement = $("<li>");
        var $nameElement = $("<strong class='example-chat-username'></strong>");
        //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
        starsRef.getDownloadURL().then(function(url) {
            img = $('<img/>').attr('src', url).css({width: 50})
            $nameElement.text(username);
            $messageElement.text(message).prepend(img).prepend($nameElement);
            console.log('photo---'+url);
        });
        
        console.log(snapshot);
        //ADD MESSAGE
        $messageList.append($messageElement)

        //SCROLL TO BOTTOM OF MESSAGE LIST
        $messageList[0].scrollTop = $messageList[0].scrollHeight;
      });//child_added callback

      user.providerData.forEach(function (profile) {

        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
        console.log("  Photo URL: "+profile.photoURL);
      });
      
      // LISTEN FOR KEYPRESS EVENT
      $messageField.keypress(function (e) {
        if (e.keyCode == 13) {
          //FIELD VALUES
          var username = user.displayName;
          var message = $messageField.val();
          console.log(username);
          console.log(message);
            dbChatRoom.push({uid:user.uid, name:username, text:message});
          //SAVE DATA TO FIREBASE AND EMPTY FIELD

          $messageField.val('');
        }
      });
    } else {
      console.log("not logged in");
    }
  });

  // SignOut
  $btnSignOut.click(function(){
    firebase.auth().signOut();
    console.log('LogOut');
    $signInfo.html('No one login...');
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')
    $message.html('');
     location.replace('./index.html')
  });


});
