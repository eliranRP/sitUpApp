var myApp = {};
var mainView = {};
var rightView = {};
var $$ = Dom7;

var mainApp = angular.module("AngularApp", ['firebase', 'ngAnimate', 'ngSanitize'])

.run(function () {
    myApp = new Framework7({
        modalTitle: 'SitUp',
        material: true,
        pushState: true,
        angular: true
    });
    mainView = myApp.addView('.view-main', {});

})
.config(function () {
    window.location.hash = "#!/events.html";
    //ticketsByCamera
    //events
    //ticketsByPrice
    //chairDetails
    //chairHunter
    //memberTicketsByFilter
    //memberTicketsList

})

.controller("RootController", ["$scope", function ($scope) {
    $$('.panel-left').on('open', function () {
        $$('.statusbar-overlay').addClass('with-panel-left');
    });
    $$('.panel-right').on('open', function () {
        $$('.statusbar-overlay').addClass('with-panel-right');
    });
    $$('.panel-left, .panel-right').on('close', function () {
        $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
    });
}])

.directive("panelRight", function () {
    return {
        templateUrl: "panel-left.html"
    }
})
.filter('slice', function () {
    return function (arr, start, end) {
        return (arr || []).slice(start, end);
    };
});