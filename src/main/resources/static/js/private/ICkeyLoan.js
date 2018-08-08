var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/ickey/ICkeyLoanList.html',controller:LoanController})
        .when('/ickeyLoan/det/:id',{templateUrl:'html/ickey/ICkeyLoanDet.html',controller:DetLoanController})


    /*.
     when('/loanApply/examine/:id',{templateUrl:'html/examine.html',controller:ExamineCtrl}).
     when('/loanApply/desc/:id',{templateUrl:'html/desc.html',controller:DescCtrl}).
     when('/tg/list',{templateUrl:'html/loanList.html',controller:LoanApplyController}).
     when('/bh/list',{templateUrl:'html/loanList.html',controller:LoanApplyController})*/
}]);

function LoanController($route,$scope,$http,$routeParams,$location,$filter) {
    $http.get('/admin/ickeyloan/list').then(function (response) {
        $scope.lists = response.data.lists;
    });


    //确认放款
    $scope.confirmFK = function (loan) {
        $http.get('/admin/ickeyloan/confirmFK/'+loan.id).then(function(response) {

            if(response.data.status == 201){
                location.reload();
            }else{
                alert("确认失败")
            }
        });
    }

    //确认收款
    $scope.confirmSK = function (loan) {
        $http.get('/admin/ickeyloan/confirmSK/'+loan.id).then(function(response) {

            if(response.data.status == 201){
                //$location.path('/loanApply/list');
                location.reload();
            }else{
                alert("确认失败")
            }
        });
    }

    //拒贷
    $scope.confirmJD = function (loan) {
        $http.get('/admin/ickeyloan/confirmJD/'+loan.id).then(function(response) {

            if(response.data.status == 201){
                //$location.path('/loanApply/list');
                location.reload();
            }else{
                alert("确认失败")
            }
        });

    }

};

function DetLoanController($scope, $http, $routeParams,$location) {
    $http.get('/admin/ickeyloan/det?id='+$routeParams.id).then(function (response) {
        $scope.user = response.data.user;
        $scope.product = response.data.product;
        $scope.loan = response.data.loan;
        $scope.infoList = response.data.infoList;
        $scope.urlStatus = response.data.urlStatus;
        $scope.flag = response.data.flag;
        $scope.saleContractUrl = response.data.saleContractUrl;
        $scope.interestType;
        if('ONE_INTEREST'== response.data.product.interestType){
            //一次性还本付息
            $scope.interestType = 0;
        }
        $scope.termType;
        if('MONTH'== response.data.product.termType){
            //月结
            $scope.termType = 0;
        }else if('DAY'== response.data.product.termType){
            //日结
            $scope.termType = 1;
        }
        $scope.infoStatus;
        angular.forEach($scope.infoList, function(data,key){
            if('TODO' == data.status){
                $scope.infoStatus = 0;
            }
            if('SEND' == data.status){
                $scope.infoStatus = 1;
            }
            if('CONFIRM' == data.status){
                $scope.infoStatus = 2;
            }
        });
    });
};