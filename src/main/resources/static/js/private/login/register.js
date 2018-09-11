var regsiter = angular.module('register',['ngRoute']);

regsiter.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:'html/registerContent.html', controller:RegsiterController})
}]);

function RegsiterController($scope,$http,$window,$rootScope) {


    //请求注册
    $scope.register = function (reg) {

        //还没进行验证,先填数据

        $http.post('/admin/register',reg)
            .then(function (response) {
                var status = response.data.status;
                var msg = response.data.message;

                if (status == 200){
                    alert(msg);
                } else if (status == 201) {
                    alert(msg);
                }

            })

    }


    //手机请求验证码
    $scope.verifyCode = function (reg) {

        $http.post('/admin/verifyCode',reg)
            .then(function (response) {
                var status = response.data.status;
                var msg = response.data.message;

                if (status == 200){
                    console.log(msg);
                }

            })

    }


}