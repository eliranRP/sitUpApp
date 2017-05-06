mainApp.factory('Tickets',
  ['$rootScope', '$firebaseObject', '$http','Notifications',
  function ($rootScope, $firebaseObject, $http, Notifications) {
      var myObject;
      myObject = {
          pullTicketBack: function (ticket, userID) {

              var update = {};
              var newTicket = {
                  date: ticket.date,
                  id: ticket.id,
                  memberID: ticket.memberID,
                  lastBuyer: userID,
                  onSale: false,
                  buyerID: '',
                  gateID: ticket.gateID,
                  avaliable: false,
                  row: ticket.row,
                  gateNum: ticket.gateNum,
                  seatNumber: ticket.seatNumber,
                  barcode: ticket.barcode,
                  currency: "שח",
                  amount: ticket.amount,
                  imageUrl: ticket.imageUrl,
                  counter: ticket.counter,
                  event: ticket.event,
              }

              update['/avaliableSeatsByGateID/' + ticket.gateID + '/' + ticket.id] = null; // move ticket to available list
              update['/unavaliableSeatsByEventID/' + ticket.event.id + '/' + ticket.id] = newTicket;
              update['/unavaliableSeatsByMemberIDAndEventID/' + userID + '/' + ticket.event.id + '/' + 'onSale'] = false;

              return firebase.database().ref().update(update).then(function () {
                  var msg = 'הכרטיס אינו עומד למכירה!'
                  Notifications.addNotification(msg)
              }).catch(function (error) {
                  var msg = 'שגיאה! נסה שוב'
                  Notifications.addNotification(msg)
                  console.log(error)
              }); //update
          },
          releaseTicket: function (ticket, userID) {
              if (ticket) {
                  var update = {};
                  var newTicket = {
                      date: ticket.date,
                      id: ticket.id,
                      memberID: ticket.memberID,
                      lastBuyer: userID,
                      onSale: true,
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
                      counter: ticket.counter,
                      event: ticket.event,
                  }
                  update['/avaliableSeatsByGateID/' + ticket.gateID + '/' + ticket.id] = newTicket; // move ticket to available list
                  update['/unavaliableSeatsByEventID/' + ticket.event.id + '/' + ticket.id] = null;
                  update['/unavaliableSeatsByMemberIDAndEventID/' + userID + '/' + ticket.event.id + '/' + 'onSale'] = true;

                  return firebase.database().ref().update(update).then(function () {
                      var msg = 'הכרטיס הועבר למכירה, עד ביצוע המכירה תוכל לצפות בכרטיס בדף - הכרטיסים שלי'
                      Notifications.addNotification(msg)
                  }).catch(function (error) {
                      var msg = 'שגיאה! נסה שוב'
                      Notifications.addNotification(msg)
                      console.log(error)
                  }); //update
              }
          }
      }
      return myObject;
  }]); //factory


