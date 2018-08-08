var loginApp = angular.module('login', ['ngRoute','ngCookies']);
loginApp.config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/',{templateUrl:'html/ickey/login.html',controller:LoginController});
}]);

function LoginController($scope,$http,$cookies,$window,$rootScope) {
    var token = $cookies.getObject("token");
    $scope.login = function (admin) {
        if(admin == undefined || admin.name == undefined){
            $("#name").tooltip({title:"请输入用户名",placement:"auto"}).tooltip('show');
        }else{
            $http.post('/admin/manager/login',admin)
                .then(function(response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    var status = response.data.status;
                    var msg = response.data.message;
                    if(status == 200){
                        //$window.sessionStorage.setItem("user", JSON.stringify(response.data));
                        $cookies.putObject("token",response.data,{expires:new Date(new Date().getTime()+1000*60*60*24*7)});
                        // $rootScope.admin = admin.name;
                        $window.location.href="adminIndex.html";

                    }else{
                        $cookies.remove('token');
                        alert(msg);
                    }
                });
        }
    }
}

