var app = angular.module("app",['ngRoute','ngCookies']);
//全局拦截器
app.factory('myInteceptor',['$q','$rootScope','$window','$cookies',function ($q,$rootScope,$window,$cookies) {
    var tokenObj = $cookies.getObject("token");
    var requestInteceptor = {
        // request:function(config){
        //     console.log(tokenObj);
        //     if(tokenObj == undefined){
        //         $window.location.href="login.html";
        //         return false;
        //     }
        //     return config;
        // },
        // responseError:function (response) {
        //     console.log(11111);
        //     var status = response.status;
        //     if(status == 50055){
        //         $window.location.href="/admin/login.html";
        //         return $q.reject(response);
        //     }
        //     return $q.reject(response);
        //
        // }
    };

    if(tokenObj == undefined){
        $window.location.href="login.html";
        return requestInteceptor;
    }
    $rootScope.admin = tokenObj.manager.name;
    return requestInteceptor;

}]).config(['$httpProvider',function($httpProvider){
    $httpProvider.interceptors.push('myInteceptor');
}]);

app.controller('LoginOutCtrl',function ($rootScope,$scope,$http,$cookies,$window) {
    $scope.loginOut = function (admin) {
        $http.post('/admin/manager/loginOut',$rootScope.admin)
            .then(function(response) {
                var status = response.data.status;
                if(status == 200){
                    $cookies.remove('token');
                    $window.location.href="login.html";
                }
            });
    };

    layui.use(['layer','form'], function() {
        var $ = layui.jquery,
            layer = layui.layer,
            form = layui.form();

        $scope.updateKey = function () {

            layer.open({
                title: '修改密码',
                type: 1,
                content: $("#edit-admin-layer"),
                area: ['530px', '360px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    // $window.location.reload();
                }
            });

        };
    });
});

app.controller('EditCtrl',function ($rootScope,$scope,$http,$cookies,$window) {
    $scope.editAdmin = function (vo,isValidata) {

        layui.use(['layer','form'], function() {
            var $ = layui.jquery,
                layer = layui.layer,
                form = layui.form();

            if(isValidata){
                layer.msg("* 为必填项");
                return false;
            }else if(vo.pwd.length < 6 || vo.pwd.length > 12){
                layer.msg("密码长度不能小于6位或者大于12位");
                return false;
            }else if(vo.pwd != vo.repwd){
                layer.msg("两次密码输入不同,请重新输入!!");
                return false;
            }
            var data = vo.pwd;

            $http.put('/admin/sys/updatePwd',vo).then(function(response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                layer.msg("密码修改成功!!");
                layer.closeAll();
            });

        });
    }
});


function getVersion(){
    return new Date().getTime();
}