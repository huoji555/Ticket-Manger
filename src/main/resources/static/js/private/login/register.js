var regsiter = angular.module('register',['ngRoute']);

regsiter.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:'html/login/registerContent.html', controller:RegsiterController})
}]);


function RegsiterController($scope,$http,$window,$rootScope,$timeout) {


    //请求注册
    $scope.register = function (reg) {

        //还没进行验证,先填数据
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(reg.phone.trim()))) {
            alert("手机输入格式不正确");
            return;
        }

        if (!checkPassword(reg)) {
            alert("密码复杂度不够");
            return ;
        }

        if( reg.password != reg.password1) {
            alert("两次输入密码不一致");
            return ;
        }

        if (reg.verfiyCode == undefined || reg.verfiyCode == "" ) {
            alert("验证码不能为空");
            return ;
        }


        $http.post('/admin/register',reg)
            .then(function (response) {
                var status = response.data.status;
                var msg = response.data.message;

                if (status == 200){
                    $window.location.href = "auditing.html";
                } else if (status == 201) {
                    alert(msg);
                }

            })

    }


    $scope.timing = 0;


    //手机请求验证码
    $scope.verifyCode = function (reg) {

        //还没进行验证,先填数据
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(reg.phone.trim()))) {
            alert("手机输入格式不正确");
            return;
        }

        $scope.timing = 60;

        $scope.timeMachine();

        $http.post('/admin/verifyCode',reg)
            .then(function (response) {
                var status = response.data.status;
                var msg = response.data.message;

                if (status == 200){
                    console.log(msg);
                }

            })
    }


    //验证密码
    function checkPassword(reg) {

        var strength = 0;
        var value = reg.password;
        if (value.length > 7 && value.match(/[\da-zA-Z]+/)) {
            if (value.match(/\d+/)) {
                strength++;
            }
            if (value.match(/[a-z]+/)) {
                strength++;
            }
            if (value.match(/[A-Z]+/)) {
                strength++;
            }
            if (value.match(/[!@*$-_()+=&￥]+/)) {
                strength++;
            }
        }

        if (strength >= 2) {
            return true;
        }
        return false;
    }


    //计时器
    $scope.timeMachine = function () {

        if ($scope.timing != 0) {
            $timeout(function () {
                $scope.timing--;
                $scope.timeMachine();
            },1000);
        }

    }

}