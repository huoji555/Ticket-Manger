var auditing = angular.module('Auditing',['ngRoute']);

auditing.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:"html/Auditing/auditingContent.html",controller:auditingController})
}]);


function auditingController($scope,$http,$window,$rootScope) {


    //上传文件
    $scope.upload = function (a) {

        var file = document.getElementById("file"+a).files[0];

        if(file == undefined){
            alert("请选择文件后再上传");
            return;
        }

        var fd= new FormData();
        fd.append("file",file);
        fd.append("type",a);

        $http({
            method :'POST',
            url : '/auditing/upload',
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {
            var status = response.data.status;
            var msg = response.data.message;

            if (status == 200) {
                alert(msg);
                $scope.feedback();
            } else if (status == 201) {
                alert(msg);
                $window.location.href = "login.html";
            } else if (status == 202) {
                alert(msg);
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
                    alert("审核成功");            //此处应有跳转
                    $window.location = "index.html";
                } else if (status == 201) {
                    console.log(msg);
                    $scope.list = list;
                    $scope.generalSituation = msg;
                }

            })

    }

    $scope.feedback();

}