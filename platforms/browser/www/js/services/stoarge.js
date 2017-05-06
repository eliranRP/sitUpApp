mainApp.factory('Storage',
  ['$firebaseStorage', '$firebaseObject',
  function ( $firebaseStorage, $firebaseObject) {
      var myObject;
      var storage = firebase.storage().ref();
      myObject = {
          imageUpload: function (element, storageRef ,currentUser) {
              var storage;
              var file = element.files[0];
              storage = $firebaseStorage(storageRef);
              var task = storage.$put(file); // Upload file

               task.$complete(function (url) {
                  if (currentUser)
                      currentUser.photoURL = url.downloadURL;
               }); //$complete
               return;
          }
      }
      return myObject;
  }]); //factory


