mainApp.controller("chairHunterController", ['$scope', '$rootScope', '$firebaseAuth', '$timeout', '$firebaseArray',
function ($scope, $rootScope, $firebaseAuth, $timeout, $firebaseArray) {
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function (authUser) {
        if (authUser) {
            var eventsRef = ref.child('events'); // all events
            var events = $firebaseArray(eventsRef);
            events.$loaded().then(function (data) {
                console.log(data)
                $rootScope.events = events;
            }); //make sure data is loaded

            //load data
            var eventsNotificationRef = ref.child('NotificationByUserID').child(authUser.uid); // all events
            var eventsNotification = $firebaseArray(eventsNotificationRef);
            eventsNotification.$loaded().then(function (data) {
                $scope.eventsNotification = eventsNotification;
                data.forEach(function (snap) {
                    $$('input[data-id=' + snap.$id + ']').attr("checked", "checked")
                });
            }); //make sure data is loaded

            $scope.redirect = function (url) {
                mainView.router.loadPage(url)
            }

            $scope.go = function (url, seat) {
                $rootScope.currentSeat = seat;
                mainView.router.loadPage(url);
            };

            $scope.notificationToggleByEventID = function (event) {
                console.log('inside function')
                var val = $$('input[data-id=' + event.id + ']').is(":checked");
                var update = {};
                var message;
                if (!val) {
                    val = null;
                    message = 'לא יתקבלו התראות עבור  ' + event.homeTeam.Name + '  vs.  ' + event.awayTeam.Name;
                }
                else {
                    message = 'ברגע שיתפנה כיסא נודיע לך'
                }
                update['/NotificationByEventID/' + event.id + '/' + authUser.uid] = val;
                update['/NotificationByUserID/' + authUser.uid + '/' + event.id] = val;
                return firebase.database().ref().update(update).then(function () {
                    console.log('inside update')
                    myApp.addNotification({
                        message: message,
                        hold: 2000
                    });
                }).catch(function (error) {
                    $scope.error = error;
                }); //update
            }

            $scope.test = function () {
                console.log('inside function')
                    message = 'ברגע שיתפנה כיסא נודיע לך'
                    console.log('inside update')
                    myApp.addNotification({
                        message: message,
                        hold: 2000
                    });
            }
        }
    });
}]);