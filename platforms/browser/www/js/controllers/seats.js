mainApp.controller("seatsController", ['$scope', '$rootScope', '$firebaseAuth', '$timeout', '$firebaseArray', 'Purchase',
function ($scope, $rootScope, $firebaseAuth, $timeout, $firebaseArray, Purchase) {
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();
    var gate = $rootScope.currentGate;
    var event = $rootScope.currentEvent;

    auth.$onAuthStateChanged(function (authUser) {
        if (authUser) {


            var seatsRef = ref.child('avaliableSeatsByGateID').child(gate.id);
            var seats = $firebaseArray(seatsRef);
            seats.$loaded().then(function (data) {
                $scope.seats = seats;
                $timeout(function () {
                    var mySwiper1 = myApp.swiper('.swiper-1', {
                        pagination: '.swiper-1 .swiper-pagination',
                        spaceBetween: 10,
                        slidesPerView: 3,
                    });
                    var mySwiper2 = myApp.swiper('.swiper-2', {
                        pagination: '.swiper-2 .swiper-pagination',
                        spaceBetween: 10,
                        slidesPerView: 3,
                    });
                    var mySwiper3 = myApp.swiper('.swiper-3', {
                        pagination: '.swiper-3 .swiper-pagination',
                        spaceBetween: 10,
                        slidesPerView: 3,
                    });
                    $('.swiper-container')[0].swiper.update()
                    $('.swiper-container')[1].swiper.update()
                    $('.swiper-container')[2].swiper.update()
                });
            }); //make sure data is loaded

            $scope.onPurchase = function (seat,goBack) {
                myApp.modal({
                    title: 'רכישת ברטיס',
                    text: 'המשך הרכישה תתבצע באתר PayPal',
                    buttons: [
                      {
                          text: 'אישור',
                          onClick: function () {
                              Purchase.paypalPurchase();
                              Purchase.createBarcode();
                              Purchase.deleteTicketOnUser(seat, authUser);
                              Purchase.setTicketOnBuyer(seat, authUser);
                              if (goBack) {
                                  mainView.back({
                                      url: mainView.history[mainView.history.length - 2],
                                      force: true,
                                      ignoreCache: true
                                  }) // go back
                              }

                          }
                      },
                      {
                          text: 'ביטול',
                          onClick: function () {
                              return false;
                          }
                      },
                    ],
                })
                $scope.addCount(seat.id); // viewr count
            }

            // watch seat counter
            $scope.addCount = function (seatID) {
                var countRef = ref.child('avaliableSeatsByGateID').child(gate.id).child(seatID);
                countRef.transaction(function (seat) {
                    if (!seat) {
                        // if count does not exist
                        seat.counter = 0;
                    }
                    seat.counter = seat.counter + 1;
                    return seat;
                });
            }

            $scope.redirect = function (url) {
                mainView.router.loadPage(url)
            }

            $scope.go = function (url, seat) {
                $rootScope.currentSeat = seat;
                mainView.router.loadPage(url);
            };

            $('#tab111').on('show', function () {
                $(this).find('.swiper-container')[0].swiper.update()
            });
        }
    });
}]);