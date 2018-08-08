var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/sys/logFile/list.html',controller:AddController})
}]);

function AddController($scope,$http) {

    $scope.add = function (logVo,isValidate) {
        if(isValidate){
            alert("两项均为必填项!");
            return false;
        }

        $http.post('/admin/logFile/queryText',logVo).then(function (response){
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            var data = response.data.data;
            var html = "";
            $.each(data,function(index,ele){
                html += ele+"\r\n";
            });
            $("#text").text(html);
        });
    }
}