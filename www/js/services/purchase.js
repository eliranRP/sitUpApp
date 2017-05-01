mainApp.factory('Purchase',
  ['$rootScope', '$firebaseObject', '$http',
  function ($rootScope, $firebaseObject, $http) {
      var myObject;
      myObject = {
          paypalPurchase: function () {
              return true;
          },
          createBarcode: function () {
              return true;
          },
          setTicketOnBuyer: function (seat,currentUser) {
              if (seat) {
                  var update = {};
                  var newTicket = {
                      date: seat.date,
                      id: seat.id,
                      memberID: seat.memberID,
                      buyerID: currentUser.uid, // buyer id --> currentUser uid
                      gateID: seat.gateID,
                      avaliable: true,
                      row: seat.row,
                      gateNum: seat.gateNum,
                      seatNumber: seat.seatNumber,
                      barcode: seat.barcode, // also should set the new barcode
                      currency: "שח",
                      amount: seat.amount,
                      imageUrl: seat.imageUrl,
                      counter: 0,
                      event: seat.event,
                  }
                  update['/unavaliableSeatsByEventID/' + seat.event.id + '/' + seat.id] = newTicket;
                  update['/unavaliableSeatsByMemberIDAndEventID/' + currentUser.uid + '/' + seat.event.id] = newTicket;

                  return firebase.database().ref().update(update).then(function () {
                  }).catch(function (error) {
                      console.log(error)
                  }); //update
              }
          },
          deleteTicketOnUser: function (seat) {
              if (seat) {
                  var update = {};
                  update['/avaliableSeatsByGateID/' + seat.gateID + '/' + seat.id] = null; // move ticket to available list
                  return firebase.database().ref().update(update).then(function () {
                  }).catch(function (error) {
                      console.log(error)
                  }); //update
              }
          }
      }
      return myObject;
  }]); //factory


