mainApp.controller('userProfileController', ['$scope', '$rootScope', '$firebaseStorage', '$firebaseAuth', '$firebaseObject',
    function ($scope, $rootScope, $firebaseStorage, $firebaseAuth, $firebaseObject) {

        var ref = firebase.database().ref();
        var storage = firebase.storage().ref();
        var auth = $firebaseAuth();

        auth.$onAuthStateChanged(function (authUser) {
            if (authUser) {
                $scope.imageUpload = function (element) {

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
                    // Create storage ref
                    var storageRef = storage.child('users').
                        child(authUser.uid).child('profilePicture').child('profile' + ext);
                    $scope.storage = $firebaseStorage(storageRef);
                    var task = $scope.storage.$put(file); // Upload file
                    task.$complete(function (url) {
                        if ($scope.currentUser)
                            $scope.currentUser.photoURL = url.downloadURL;
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
            }
        }); //$onAuthStateChanged
    }]); //addMemberController

