﻿mainApp.factory('Purchase',
  ['Notifications', function (Notifications) {
      var myObject;
      var ref = firebase.database().ref();
      var barcodeUrl = 'http://www.barcodes4.me/barcode/qr/ticket.png?value=';
      myObject = {
          paypalPurchase: function () {
              return true;
          },
          createBarcode: function (currentUser) {
              var key = ref.child('users').push().key; // create key 
              return barcodeUrl + key;
          },
          setTicketOnBuyer: function (seat, currentUser,newBarcode) {
              if (seat) {
                  var update = {};
                  var newTicket = {
                      date: seat.date,
                      id: seat.id,
                      memberID: seat.memberID,
                      buyerID: currentUser.uid, // buyer id --> currentUser uid
                      lastBuyer: currentUser.uid,
                      onSale: false,
                      gateID: seat.gateID,
                      avaliable: false,
                      row: seat.row,
                      gateNum: seat.gateNum,
                      seatNumber: seat.seatNumber,
                      barcode: newBarcode, // set the new barcode
                      currency: "שח",
                      amount: seat.amount,
                      imageUrl: seat.imageUrl,
                      counter: seat.counter,
                      event: seat.event,
                  }
                  update['/unavaliableSeatsByEventID/' + seat.event.id + '/' + seat.id] = newTicket;
                  update['/unavaliableSeatsByMemberIDAndEventID/' + currentUser.uid + '/' + seat.event.id] = newTicket;

                  return firebase.database().ref().update(update).then(function () {
                      myObject.sendNotificationToSeller(seat); // send notification to seller
                  }).catch(function (error) {
                      console.log(error)
                  }); //update
              }
          },
          deleteTicketOnUser: function (seat) {
              if (seat) {
                  var update = {};
                  update['/avaliableSeatsByGateID/' + seat.gateID + '/' + seat.id] = null; // move ticket to available list
                  update['/unavaliableSeatsByMemberIDAndEventID/' + seat.lastBuyer + '/' + seat.event.id] = null;

                  return firebase.database().ref().update(update).then(function () {
                  }).catch(function (error) {
                      console.log(error)
                  }); //update
              }
          },
          sendNotificationToSeller: function (seat) {
              var userRef = firebase.database().ref().child('users').child(seat.lastBuyer);
              userRef.once('value').then(function (snapshot) {
                  var usersList = new Array();
                  usersList.push(snapshot.val())
                  var data = {
                      userList: usersList,
                      message: "  הכרטיס למשחק  " + seat.event.homeTeam.Name + " נגד " +
                             seat.event.awayTeam.Name + "   נמכר!!  ",
                      imageUrl: seat.event.eventImage
                  }
                  Notifications.send(data); // send push on $http
              });
          }
      }
      return myObject;
  }]); //factory


