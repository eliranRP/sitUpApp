mainApp.factory('Notifications',
  ['$scope', '$rootScope', '$firebaseStorage', '$firebaseObject',
  function ($scope, $rootScope, $firebaseStorage, $firebaseObject) {
      var myObject;
      var storage = firebase.storage().ref();
      myObject = {
          imageUpload: function (element, storageRef) {
              var storage;
              var file = element.files[0];
              var type = file.type.split("/")[0];

              if (type != 'image') {
                  myApp.alert('עליך להעלות קובץ מסוג תמונה');
                  return;
              } //type
              $scope.imageMsg = null;
              // Get file extension
              var re = /(?:\.([^.]+))?$/;
              var ext = re.exec(file.name)[0];

              storage = $firebaseStorage(storageRef);
              var task = storage.$put(file); // Upload file
              task.$complete(function (url) {
                  if ($scope.currentUser)
                      $scope.currentUser.photoURL = url.downloadURL;
              }); //$complete
          }
      }
      return myObject;
  }]); //factory


