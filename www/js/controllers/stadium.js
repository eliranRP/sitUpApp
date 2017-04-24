mainApp.controller("stadiumGateController", ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray) {


        var ref = firebase.database().ref();
        var auth = $firebaseAuth();
        $scope.event = $rootScope.currentEvent;

        auth.$onAuthStateChanged(function (authUser) {
            if (authUser) {
                var gatesRef = ref.child('gatesByEventsID').child($scope.event.id); // gate by eventsID
                var gates = $firebaseArray(gatesRef);
                gates.$loaded().then(function (data) {
                    $scope.gates = gates;
                }); //make sure data is loaded

                $scope.go = function (url, gate) {
                    $rootScope.currentGate = gate;
                    mainView.router.loadPage(url);
                };

                var photoBrowserPhotos = [{
                    url: 'img/stadium.gif',
                    caption: $scope.event.location
                }
                ];
                var photoBrowserStandalone = myApp.photoBrowser({
                    photos: photoBrowserPhotos
                });
                var photoBrowserPopup = myApp.photoBrowser({
                    photos: photoBrowserPhotos,
                    type: 'popup'
                });
                var photoBrowserPage = myApp.photoBrowser({
                    photos: photoBrowserPhotos,
                    type: 'page'
                });
                var photoBrowserDark = myApp.photoBrowser({
                    photos: photoBrowserPhotos,
                    theme: 'dark'
                });
                var photoBrowserPopupDark = myApp.photoBrowser({
                    photos: photoBrowserPhotos,
                    theme: 'dark',
                    type: 'popup'
                });
                var photoBrowserLazy = myApp.photoBrowser({
                    photos: photoBrowserPhotos,
                    lazyLoading: true,
                    theme: 'dark'
                });
                $$('.ks-pb-standalone').on('click', function () {
                    photoBrowserStandalone.open();
                });
                $$('.ks-pb-popup').on('click', function () {
                    photoBrowserPopup.open();
                });
                $$('.ks-pb-page').on('click', function () {
                    photoBrowserPage.open();
                });
                $$('.ks-pb-popup-dark').on('click', function () {
                    photoBrowserPopupDark.open();
                });
                $$('.ks-pb-standalone-dark').on('click', function () {
                    photoBrowserDark.open();
                });
                $$('.ks-pb-lazy').on('click', function () {
                    photoBrowserLazy.open();
                });
            }
        });
    }])