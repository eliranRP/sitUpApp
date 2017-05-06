mainApp.controller('userProfileController', ['$scope', '$rootScope', '$firebaseStorage', '$firebaseAuth',
    '$firebaseObject', 'Storage',
    function ($scope, $rootScope, $firebaseStorage, $firebaseAuth, $firebaseObject, Storage) {

        var ref = firebase.database().ref();
        var storage = firebase.storage().ref();
        var auth = $firebaseAuth();
        $scope.isLoad = false;

        //$$('.takePhoto').on('click', function () {
        //    $scope.takePhoto();

        //});


        auth.$onAuthStateChanged(function (authUser) {
            if (authUser) {

                //$scope.takePhoto = function () {
                //    navigator.camera.getPicture(function (fileUri) {
                //        $scope.$apply(function () {
                //            $scope.currentUser.photoURL = fileUri;
                //        });
                //    }, function () { }, { quality: 50 });
                //};

                $scope.imageUpload = function (element) {


                    var file =element.files[0];
                    var type = file.type.split("/")[0];

                    if (type != 'image') {
                        myApp.alert('עליך להעלות קובץ מסוג תמונה');
                        return;
                    } //type
                    $scope.$apply(function () {
                        $scope.isLoad = true;
                    });
                    $scope.imageMsg = null;
                    // Get file extension
                    var re = /(?:\.([^.]+))?$/;
                    var ext = re.exec(file.name)[0];


                    var key = ref.child('users').push().key
                    var storageRef = storage.child('users').
                       child(authUser.uid).child('profilePicture').child(key + ext); // image name and extension

                    var callBack = Storage.imageUpload(element, storageRef, $scope.currentUser);
                    callBack.$complete(function (url) {
                        if ($scope.currentUser) {
                            $scope.currentUser.photoURL = url.downloadURL;
                            $scope.isLoad = false;
                        }

                    }); //$complete
                };

                var userRef = ref.child('users').child(authUser.uid);
                var userObj = $firebaseObject(userRef);
                userObj.$bindTo($scope, 'currentUser').then(function () {
                    console.log($scope.currentUser);
                })

            } //authUser
            else {
                $rootScope.currentUser = '';
                mainView.router.loadPage("login.html");
            }
        }); //$onAuthStateChanged
    }]); //addMemberController

