var login = angular.module('login',['ngRoute']);

login.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:"html/login/loginContent.html",controller:LoginController})
}]);


function LoginController($scope,$http,$window,$rootScope) {

    //登录验证
    $scope.login = function (Admin) {

        if (Admin.phoneNumber == undefined || Admin.phoneNumber == "") {
            alert("手机号不能为空");
            return;
        } else if (Admin.password == undefined || Admin.password == "") {
            alert("密码不能为空");
            return;
        }

        $http.post("/admin/login",Admin)
            .then(function (response) {
                var status = response.data.status;
                var msg = response.data.message;

                if (status == 200){
                    if (response.data.roleId == "2"){
                        $scope.feedback();
                    } else if (response.data.roleId == "1") {
                        alert("管理员");
                    }
                } else if (status == 201){
                    alert(msg);
                }

            })

    }


    //退出登录
    $scope.quit = function () {

        $http.post("/admin/logOut")
            .then(function (response) {
                var status = response.data.status;
                var msg = response.data.message;

                if (status == 200){
                    console.log(msg);
                } else {
                    alert("退出失败");
                }
            })

    }


    //刷新反馈状态以及判断审核有无通过
    $scope.feedback = function () {

        $http.get('/auditing/feedback')
            .then(function (response) {

                var status = response.data.status;
                var msg = response.data.message;
                var list = response.data.list;

                if (status == 200){
                    console.log("审核成功");
                    $window.location = "index.html";
                } else if (status == 201) {
                    console.log(msg);
                    $window.location = "auditing.html";
                }

            })

    }


}
