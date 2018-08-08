var app = angular.module('myApp', []);

app.controller('productAddCtrl', function($scope) {


    $scope.add = function (productScheme,isValidate) {
        if(isValidate){
            alert("您还有资料未填写!!!");
            return false;
        }

        $http.post('/admin/manual/productScheme/add',productScheme).then(function (response){
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                alert('创建成功!');
                $window.location.href="productScheme.html";
            }else if('FAIL' == response.data.status){
                alert('创建失败!');
                return false;
            }
        });
    };
});