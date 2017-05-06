mainApp.controller("memberTicketsController", ['$scope', '$rootScope', '$firebaseAuth', '$timeout',
    '$firebaseObject', '$firebaseArray', 'Notifications','Tickets',
function ($scope, $rootScope, $firebaseAuth, $timeout, $firebaseObject, $firebaseArray, Notifications, Tickets) {
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();
    var event = $rootScope.events;

    auth.$onAuthStateChanged(function (authUser) {
        if (authUser) {

            // All user tickets by event
            var ticketsListRef = ref.child('unavaliableSeatsByMemberIDAndEventID').child(authUser.uid);
            var ticketsList = $firebaseArray(ticketsListRef);
            ticketsList.$loaded().then(function (data) {
                $scope.ticketsList = ticketsList;
            }); //make sure data is loaded


            function send(seat) {
                var usersList = new Array(); 
                var counter = 0;
                var eventUserRef = ref.child('NotificationByEventID').child(seat.event.id);
                eventUserRef.once("value", function (snapshot) {
                    var numOfChild = snapshot.numChildren();
                    snapshot.forEach(function (childSnapshot) {
                        ref.child("users").child(childSnapshot.key).once("value").then(function (snap) {
                            counter++;
                            if (snap.val())
                                usersList.push(snap.val());
                            if (counter == numOfChild) {
                                var data = {
                                    userList: usersList,
                                    message: " התפנה מקום למשחק" + seat.event.homeTeam.Name + " נגד " +
                                           seat.event.awayTeam.Name + " שער " + seat.gateNum + " מספר כיסא - "
                                           + seat.seatNumber + "  שורה - " + seat.row,
                                    imageUrl: seat.imageUrl
                                }
                                Notifications.send(data); // send push on $http
                            }
                        });
                    });
                });
            }

            $scope.makeTicketAvailable = function (ticket) {
                Tickets.releaseTicket(ticket, authUser.uid);
                send(ticket);
            }// makeTicketAvailable

            $scope.pullTicketBack = function (ticket) {
                Tickets.pullTicketBack(ticket, authUser.uid);
            }// pullTicketBack

            $scope.showBarcode = function (ticket) {
                var photoBrowserPhotos = [{
                    url: ticket.barcode,
                    caption: ticket.event.location
                }];
                var photoBrowserStandalone = myApp.photoBrowser({
                    photos: photoBrowserPhotos
                });
                var photoBrowserPopupDark = myApp.photoBrowser({
                    photos: photoBrowserPhotos,
                    theme: 'dark',
                    type: 'popup'
                });
                photoBrowserPopupDark.open();
            };// showBarcode

            $scope.redirect = function (url) {
                mainView.router.loadPage(url)
            }

            $scope.go = function (url, seat) {
                $rootScope.currentSeat = seat;
                mainView.router.loadPage(url);
            };


        }
        else {
            $rootScope.currentUser = '';
            mainView.router.loadPage("login.html");
        }
    });
}]);


