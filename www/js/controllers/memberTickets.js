mainApp.controller("memberTicketsController", ['$scope', '$rootScope', '$firebaseAuth', '$timeout',
    '$firebaseObject', '$firebaseArray', 'Notifications',
function ($scope, $rootScope, $firebaseAuth, $timeout, $firebaseObject, $firebaseArray, Notifications) {
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();
    var event = $rootScope.events;
    //for test reason
    //var memberSeatID = "-Kj2K0zAKy1VKSeVH48e"
    //var memberID = "-Kj2K1-4PyUj4aNl8L_3"
    //var eventID = "-Kj2K0zAKy1VKSeVH48e"

    auth.$onAuthStateChanged(function (authUser) {
        if (authUser) {
            //var seatsRef = ref.child('unavaliableSeatsByEventID').child(event.id).child(authUser.seat);
            //var tickets = $firebaseObject(ticketsRef);
            //tickets.$loaded().then(function (data) {
            //    $scope.tickets = tickets;
            //}); //make sure data is loaded

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

            $scope.makeTicketAvailable = function (seat) {

                var ticket = seat;// $scope.tickets;  //for test reason
                if (ticket) {
                    var update = {};
                    var newTicket = {
                        date: ticket.date,
                        id: ticket.id,
                        memberID: ticket.memberID,
                        buyerID: '',
                        gateID: ticket.gateID,
                        avaliable: true,
                        row: ticket.row,
                        gateNum: ticket.gateNum,
                        seatNumber: ticket.seatNumber,
                        barcode: ticket.barcode,
                        currency: "שח",
                        amount: ticket.amount,
                        imageUrl: ticket.imageUrl,
                        counter: 0,
                        event: ticket.event,
                    }
                    update['/test/' + ticket.gateID + '/' + ticket.id] = true; // move ticket to available list

                    // update['/avaliableSeatsByGateID/' + ticket.gateID + '/' + ticket.id] = newTicket; // move ticket to available list
                    // update['/unavaliableSeatsByEventID/' + ticket.event.id + '/' + ticket.id] = null;
                    // update['/unavaliableSeatsByMemberIDAndEventID/' + ticket.memberID + '/' + ticket.event.id] = null;

                    return firebase.database().ref().update(update).then(function () {
                        myApp.alert('הכרטיס הועבר למכירה')
                        send(seat);
                    }).catch(function (error) {
                        myApp.alert('שגיאה! נסה שוב')
                        console.log(error)
                    }); //update
                }
            }

            $scope.redirect = function (url) {
                mainView.router.loadPage(url)
            }

            $scope.go = function (url, seat) {
                $rootScope.currentSeat = seat;
                mainView.router.loadPage(url);
            };
        }
    });
}]);


