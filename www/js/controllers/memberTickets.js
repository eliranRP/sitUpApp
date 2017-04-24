mainApp.controller("memberTicketsController", ['$scope', '$rootScope', '$firebaseAuth', '$timeout', '$firebaseObject', '$firebaseArray',
function ($scope, $rootScope, $firebaseAuth, $timeout, $firebaseObject, $firebaseArray) {
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    //for test reason
    var memberSeatID = "-KiEmmSz6VH4JDXZaqXo"
    var memberID = "-KiEmmSz6VH4JDXZaqXp"
    var eventID = "-KiEmmRu8LAjNXWFzAUY"

    auth.$onAuthStateChanged(function (authUser) {
        if (authUser) {
            //var seatsRef = ref.child('unavaliableSeatsByEventID').child(event.id).child(authUser.seat);
            var ticketsRef = ref.child('unavaliableSeatsByEventID').child(eventID).child(memberSeatID);//for test reason
            var tickets = $firebaseObject(ticketsRef);
            tickets.$loaded().then(function (data) {
                $scope.tickets = tickets;
            }); //make sure data is loaded

            // All user tickets by event
            //var ticketsListRef = ref.child('unavaliableSeatsByMemberIDAndEventID').child(authUser.uid);
            var ticketsListRef = ref.child('unavaliableSeatsByMemberIDAndEventID').child(memberID);//for test reason
            var ticketsList = $firebaseArray(ticketsListRef);
            ticketsList.$loaded().then(function (data) {
                $scope.ticketsList = ticketsList;
            }); //make sure data is loaded




            $scope.makeTicketAvailable = function () {
              
                var ticket = $scope.tickets;  //for test reason
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
                    update['/avaliableSeatsByGateID/' + ticket.gateID + '/' + ticket.id] = newTicket; // move ticket to available list
                    update['/unavaliableSeatsByEventID/' + ticket.event.id + '/' + ticket.id] = null;
                    update['/unavaliableSeatsByMemberIDAndEventID/' + ticket.memberID + '/' + ticket.event.id] = null;
                    return firebase.database().ref().update(update).then(function () {
                        myApp.alert('הכרטיס הועבר למכירה')
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