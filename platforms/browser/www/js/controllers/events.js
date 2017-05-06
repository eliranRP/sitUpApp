mainApp.controller("HomeController", ["$scope", "$http", '$rootScope', '$firebaseAuth', '$firebaseArray',
function ($scope, $http, $rootScope, $firebaseAuth, $firebaseArray) {
    $scope.title = "ארועים";
    $scope.games = [];
    $scope.logos = [];
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();
    auth.$onAuthStateChanged(function (authUser) {
        if (authUser) {

            //load data
            var eventsRef = ref.child('events'); // all events
            var events = $firebaseArray(eventsRef);
            events.$loaded().then(function (data) {
                console.log(data)
                $rootScope.events = events;
            }); //make sure data is loaded

            $scope.redirect = function (url) {
                mainView.router.loadPage(url)
            }

            $scope.go = function (url, event) {
                $rootScope.currentEvent = event;
                mainView.router.loadPage(url);
            };
        }
        else {
            $rootScope.currentUser = '';
            mainView.router.loadPage("login.html");
        }
    });
}])