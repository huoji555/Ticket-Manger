var testStudentApp = angular.module('testStudent',['ngRoute']);

testStudentApp.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:'studentContent.html',controller:TestController});
}]);

function TestController($scope,$http,$window,$rootScope) {

   $scope.huhu = function () {

       var adata = {"testData":"xxxx"};
       var data = JSON.stringify(adata);

       $http.post('/student/save',data)
           .then(function (response) {

           })

   }


}