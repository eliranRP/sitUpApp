mainApp.controller('RegistrationController',
  ['$scope', 'Authentication','$rootScope',
  function ($scope, Authentication, $rootScope) {
      $rootScope.isPostBack = false;
      $scope.login = function () {
          Authentication.login($scope.user);
          console.log('Im login from registration')
      }; //login

      $scope.googleLogin = function () {
          Authentication.googleLogin();
      }, //google Login

      $scope.FBLogin = function () {
          Authentication.FBLogin();
      }, //FaceBook Login


      $scope.logout = function () {
          Authentication.logout();
          mainView.router.loadPage("login.html")
      }; //logout

      $scope.register = function () {
          Authentication.register($scope.user);
      }; //register

      $scope.resetPassword = function () {
          Authentication.resetPassword($scope.resetEmail);
      }; //register

  }]); //Controllerr

