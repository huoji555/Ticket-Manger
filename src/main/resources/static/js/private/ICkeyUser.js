var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/ickey/ICkeyUserList.html',controller:UserController})/*.
    when('/loanApply/examine/:id',{templateUrl:'html/examine.html',controller:ExamineCtrl}).
    when('/loanApply/desc/:id',{templateUrl:'html/desc.html',controller:DescCtrl}).
    when('/tg/list',{templateUrl:'html/loanList.html',controller:LoanApplyController}).
    when('/bh/list',{templateUrl:'html/loanList.html',controller:LoanApplyController})*/
}]);

function UserController($scope,$http) {

    var size = 50;

    $scope.refresh=function(page){
        $http.get('/admin/ickeyuser/list_page?page='+page+'&size='+size).then(function (response) {
            $scope.totalNum = response.data.data.totalElements;//数据总数
            $scope.pages = response.data.data.totalPages;//页数
            $scope.currPage = response.data.data.number;//当前页
            $scope.isFirstPage = response.data.data.first;//是否是首页
            $scope.isLastPage = response.data.data.last;//是否是尾页
            $scope.lastUpPage = $scope.pages - 1;//倒数第二页
            $scope.lists = response.data.data.content;
            console.log(response.data.data);
            console.log($scope.currPage);
            //console.log(lists);
            /*$scope.showPages = response.data.page
             console.log(response.data.page);*/
        });
    }

    $scope.refresh(0);

    $scope.query = function(page,oper){
        if(oper == 'first'){//首页    1
            $scope.refresh(0);//0-50
        }
        if(oper == 'up'){//上一页
            $scope.refresh(page-1);
        }
        if(oper == 'next'){//下一页
            $scope.refresh(page+1);//currPage
        }
        if(oper == 'last'){//尾页
            $scope.refresh(page-1);//65
        }
    }
};



