mainApp.factory('Storage',
  ['$firebaseStorage', '$firebaseObject','$rootScope',
  function ($firebaseStorage, $firebaseObject, $rootScope) {
      var myObject;
      var storage = firebase.storage().ref();
      myObject = {
          imageUpload: function (element, storageRef ,currentUser) {
              var storage;
              var file = element.files[0];
              storage = $firebaseStorage(storageRef);
              var task = storage.$put(file); // Upload file
              return task;
          }

      }
      return myObject;
  }]); //factory


