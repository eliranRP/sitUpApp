mainApp.controller("seatsController", ['$scope', '$rootScope', '$firebaseAuth', '$timeout', '$firebaseArray', 'Purchase','Tickets',
function ($scope, $rootScope, $firebaseAuth, $timeout, $firebaseArray, Purchase, Tickets) {
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();
    var gate = $rootScope.currentGate;
    var event = $rootScope.currentEvent;

    function addReview() {
        $scope.$apply(function () {
            $scope.review = $$('#myReview').val()
        });
        $scope.addReview();
    }

    var actionSheetButtons = [
{
    text:
        '<div class="toolbar messagebar">' +
            '<div class="toolbar-inner"><a id="addReview" onclick="addReview()" class="link icon-only"><i class="material-icons">send</i></a>' +
            '<textarea id="myReview" ng-model="review" class="resizable" placeholder="הוסף ביקורת..."></textarea></div></div>',
    label: true
}

    ];
    $$('.demo-actions').on('click', function (e) {
        myApp.actions(actionSheetButtons);
        $$('.actions-modal-label').addClass('blue');

        var button = document.getElementById('addReview');
        button.addEventListener('click', addReview);
    });

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

            if ($rootScope.currentSeat) {
                var reviewsRef = ref.child('reviewsBySeatID').child($rootScope.currentSeat.id);
                var reviews = $firebaseArray(reviewsRef);
                reviews.$loaded().then(function (data) {
                    $scope.reviewsList = reviews;
                }); //make sure data is loaded
            }


            $scope.onPurchase = function (seat, goBack) {
                myApp.modal({
                    title: 'רכישת ברטיס',
                    text: 'המשך הרכישה תתבצע באתר PayPal',
                    buttons: [
                      {
                          text: 'אישור',
                          onClick: function () {
                              Purchase.paypalPurchase();
                              var newBarcode = Purchase.createBarcode();
                              Purchase.deleteTicketOnUser(seat, authUser);
                              Purchase.setTicketOnBuyer(seat, authUser, newBarcode);
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

            $scope.addReview = function () {
                Tickets.addReview($rootScope.currentSeat, $rootScope.currentUser, $$('#myReview').val());
                $$('#myReview').val('');
            }

            $('#tab111').on('show', function () {
                $(this).find('.swiper-container')[0].swiper.update()
            });


        }
        else {
            $rootScope.currentUser = '';
            mainView.router.loadPage("login.html");
        }
    });
}]);