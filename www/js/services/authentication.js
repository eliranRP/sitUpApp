mainApp.factory('Authentication',
  ['$rootScope', '$firebaseAuth', '$firebaseObject',
  function ($rootScope, $firebaseAuth, $firebaseObject) {

      console.log('auth')
      document.addEventListener("deviceready", onCordovaReady, false);


      var SENDER_ID = "588870694508";
      function onCordovaReady() {
          console.log('onCordovaReady')
          var push = PushNotification.init({
              "android": {
                  "senderID": SENDER_ID
              },
              "ios": {
                  "alert": "true",
                  "badge": "true",
                  "sound": "true",
                  "senderID": SENDER_ID,
                  "gcmSandbox": true
              },
              "windows": {}
          });


          push.on('registration', function (data) {
              $rootScope.notification_id = data.registrationId;
              console.log('this is noteID:', $rootScope.notification_id);

              if (IsIphone()) {
                  user_platform = "ios";
              }
              else {
                  user_platform = "android";
              }
          });

          push.on('notification', function (data) {
              console.log("notification event");

              if (data.additionalData.foreground && data.additionalData.sender != localStorage.user_name) {

                  addMessageToChat(data.additionalData.sender, data.message);
              }
              else {

              }


              push.finish(function () {
                  console.log('finish successfully called');
              });
          });

          push.on('error', function (e) {
              console.log("push error");
          });
      }



      function IsIphone() {
          var userAgent = navigator.userAgent;

          if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
              return true;
          }
          else {

              return false;
          }
      }

      var ref = firebase.database().ref();
      var auth = $firebaseAuth();
      var myObject;

      auth.$onAuthStateChanged(function (authUser) {
          if (authUser) {
              var userRef = ref.child('users').child(authUser.uid);
              var userObj = $firebaseObject(userRef);
              $rootScope.currentUser = userObj;
              mainView.router.loadPage("events.html");
          } else {
              $rootScope.currentUser = '';
              mainView.router.loadPage("login.html");
          }
      });


      myObject = {
          login: function (user) {
              $rootScope.message = null;
              $rootScope.Modalmessage = null;
              auth.$signInWithEmailAndPassword(
                  user.email,
                  user.password
                  ).then(function (user) {
                      console.log('Im a callback authentication')
                      mainView.router.loadPage("events.html");
                  }).catch(function (error) {
                      myApp.alert(error.message);
                  }); //signInWithEmailAndPassword

          }, //login
          resetPassword: function (resetEmail) {
              $rootScope.message = null;
              $rootScope.Modalmessage = null;
              auth.$sendPasswordResetEmail(resetEmail).then(function () {
                  $rootScope.Modalmessage = '  הודעת איפוס נשלחה לכתובת  ' + resetEmail
                  // Email sent.
              }).catch(function (error) {
                  if (error.code == 'auth/user-not-found')
                      myApp.alert('המשתמש לא זוהה במערכת, וודא שהכתובת נכונה');
                  else
                      myApp.alert(error.message);
              });

          }, //resetPassword
          logout: function () {
              $rootScope.message = null;
              $rootScope.Modalmessage = null;
              return auth.$signOut();
          }, //logout
          requireAuth: function () {
              $rootScope.message = null;
              $rootScope.Modalmessage = null;
              return auth.$requireSignIn();
          }, //requireAuth
          register: function (user) {
              $rootScope.message = null;
              $rootScope.Modalmessage = null;
              auth.$createUserWithEmailAndPassword(
                user.email,
                user.password
                  ).then(function (regUser) {
                      var regRef = ref.child('users')
                        .child(regUser.uid).set({
                            date: firebase.database.ServerValue.TIMESTAMP,
                            notification_id:$rootScope.notification_id,
                            uid: regUser.uid,
                            displayName: user.displayName,
                            password: user.password,
                            photoURL: 'https://firebasestorage.googleapis.com/v0/b/situp-50a6b.appspot.com/o/profileImageDef%2FdefProfile.png?alt=media&token=b77ce80d-d54c-4edf-8b72-20d110ce8e08',
                            email: user.email,
                            tel: user.tel,
                        }); //userinfo
                      myObject.login(user);
                  }).catch(function (error) {
                      myApp.alert(error.message);
                      console.log(error.message)
                  }); //createUserWithEmailAndPassword

          } //register
      }; //myObject

      return myObject;
  }]); //factory


