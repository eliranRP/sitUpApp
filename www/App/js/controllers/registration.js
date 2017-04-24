﻿mainApp.controller('RegistrationController',
  ['$scope', 'Authentication',
  function ($scope, Authentication) {

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
      }; //logout

      $scope.register = function () {
          Authentication.register($scope.user);
      }; //register

      $scope.resetPassword = function () {
          Authentication.resetPassword($scope.resetEmail);
      }; //register

  }]); //Controllerr

