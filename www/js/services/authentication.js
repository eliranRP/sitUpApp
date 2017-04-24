mainApp.factory('Authentication',
  ['$rootScope', '$firebaseAuth','$firebaseObject',
  function ($rootScope, $firebaseAuth, $firebaseObject) {

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
                      $rootScope.Modalmessage = 'המשתמש לא זוהה במערכת, וודא שהכתובת נכונה'
                  else
                      $rootScope.Modalmessage = error;
                  console.log(error);
                  // An error happened.
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
                            uid: regUser.uid,
                            displayName: user.displayName,
                            password: user.password,
                            photoURL: '../../img/profile/defProfile.png',
                            email: user.email,
                            tel: user.tel,
                        }); //userinfo
                      myObject.login(user);
                  }).catch(function (error) {
                      $rootScope.message = error.message;
                      console.log(error.message)
                  }); //createUserWithEmailAndPassword

          } //register
      }; //myObject

      return myObject;
  }]); //factory


