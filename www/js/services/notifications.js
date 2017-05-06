mainApp.factory('Notifications',
  ['$rootScope', '$firebaseObject', '$http',
  function ($rootScope, $firebaseObject, $http) {
      var myObject;
      myObject = {
          send: function (data) {
              var req = {
                  method: 'POST',
                  url: "http://proj.ruppin.ac.il/igroup81/prod/WebService.asmx/sendNotifiction",
                  headers: {
                      'Content-Type': "application/json; charset=utf-8"
                  },
                  data: JSON.stringify({ users: data.userList, msg: data.message, imageUrl: data.imageUrl })
              }

              return $http(req).then(function () { console.log('success') }, function (e) { console.log('error'); console.log(e) });
          },
          addNotification: function (msg) {
              myApp.addNotification({
                  message: msg,
                  hold: 4000
              });
              return;
          }
      }
      return myObject;
  }]); //factory


