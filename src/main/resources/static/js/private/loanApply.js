var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/loanList.html',controller:LoanApplyController}).
    when('/loanApply/examine/:id',{templateUrl:'html/examine.html',controller:ExamineCtrl}).
    when('/loanApply/desc/:id',{templateUrl:'html/desc.html',controller:DescCtrl}).
    when('/tg/list',{templateUrl:'html/loanList.html',controller:LoanApplyController}).
    when('/bh/list',{templateUrl:'html/loanList.html',controller:LoanApplyController})
}]);

function LoanApplyController($route,$scope,$http,$routeParams,$location,$filter) {

    //查询列表
    $http.get('/admin/loanApply/list').then(function(response) {
        $scope.lists = response.data.lists;
    });


    //确认放款
    $scope.confirm = function (loan) {
        $http.get('/admin/loanApply/confirm/'+loan.id).then(function(response) {
            //alert(response.data.status);
            if(response.data.status == 201){
                //$location.path('/loanApply/list');
                location.reload();
            }else{
                alert("确认失败")
            }
        });
    }
};

//审批
function ExamineCtrl($route,$scope,$http,$routeParams,$location,$filter) {

    $http.get('/admin/loanApply/desc/'+$routeParams.id).then(function(response) {
        if(response.data.status == 201){
            $scope.loanApply = response.data.loanApply;
        }else{
            alert("查询失败")
        }
    });

    $scope.adopt = function(loanApply,flag){
        //授信金额
        //var approvedAmount = $scope.approvedAmount;
        if(flag){
            //通过
            $http.post('/admin/loanApply/examine',{"id":$routeParams.id,"approvedAmount":$scope.approvedAmount,"flag":flag})
                .then(function(response) {
                    if(response.data.ok == 200){
                        $location.path('/tg/list');
                    }else{
                        alert("系统出错了");
                    }
                });
        }else{
            //拒贷
            $http.post('/admin/loanApply/examine',{"id":$routeParams.id,"flag":flag}).then(function(response) {
                if(response.data.ok == 200){
                    $location.path('/bh/list');
                }else{
                    alert("系统出错了");
                }
            });
        }
    }



};

//查看详情
function DescCtrl($route,$scope,$http,$routeParams,$location,$filter) {

    $http.get('/admin/loanApply/desc/'+$routeParams.id).then(function(response) {
        if(response.data.status == 201){
            $scope.loanApply = response.data.loanApply;
        }else{
            alert("查询失败")
        }
    });
};

