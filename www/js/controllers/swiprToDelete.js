mainApp.controller("SwipeDeleteController", ['$scope', function ($scope) {
    $$('.demo-remove-callback').on('deleted', function () {
        myApp.alert('Thanks, item removed!');
    });
    $$('.demo-reply').on('click', function () {
        myApp.alert('Reply');
    });
    $$('.demo-mark').on('click', function () {
        myApp.alert('Mark');
    });
    $$('.demo-forward').on('click', function () {
        myApp.alert('Forward');
    });


}]);
