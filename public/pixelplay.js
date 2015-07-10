// Filename: public/pixelplay.js

var FIREBASE_ENDPOINT = '';

angular.module('PixelPlayApp', ['firebase', 'ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'lobby.html',
      controller: 'LobbyCtrl'
    }).
    when('/play/:boardId', {
      templateUrl: 'play.html',
      controller: 'PlayCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
}])
.controller('LobbyCtrl', ['$scope', '$location', '$firebaseArray', function($scope, $location, $firebaseArray) {
  $scope.title = '';
  $scope.width = $scope.height = 8;
  
  var ref = new Firebase(FIREBASE_ENDPOINT);

  $scope.newBoard = function() {
    var row = [];
    for(var i=0; i<parseInt($scope.width); i++) {
      row.push('');
    }

    var data = [];

    for(var i=0; i<parseInt($scope.height); i++) {
      data.push(row);
    }

    $scope.boards.$add({title: $scope.title, data: data}).then(function(ref) {
      $location.path('/play/'+ref.key());
    });
  }

  $scope.boards = $firebaseArray(ref.child('boards'));

}])
.controller('PlayCtrl', ['$scope', '$routeParams', '$firebaseObject', function($scope, $routeParams, $firebaseObject) {  
  $scope.colors = [
    {name: 'Red', hex: 'FF0000'},
    {name: 'Blue', hex: '0000FF'},
    {name: 'Green', hex: '00FF00'},
    {name: 'Yellow', hex: 'FFFF00'},
    {name: 'Purple', hex: '800080'},
    {name: 'White', hex: 'FFFFFF'},
    {name: 'Black', hex: '000000'},
  ];

  $scope.currentColor = $scope.colors[0].hex;

  $scope.setColor = function(hex) {
    $scope.currentColor = hex;
  }

  var ref = new Firebase(FIREBASE_ENDPOINT);

  $scope.board = $firebaseObject(ref.child('boards/'+$routeParams.boardId));

  $scope.click = function(row, cell) {
    $scope.board.data[row][cell] = $scope.currentColor;
    $scope.board.$save();
  }
}]);