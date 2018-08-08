var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/sys/errorMsg/list.html',controller:LogController}).
    when('/desc/:id',{templateUrl:'html/sys/errorMsg/desc.html',controller:DescController})
}]);

function LogController($scope,$http) {
    var size = 20;
    $scope.refresh=function(page){
        $http.get('/admin/log/list?page='+page+'&size='+size).then(function (response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.totalNum = response.data.data.totalElements;//数据总数
            $scope.pages = response.data.data.totalPages;//页数
            $scope.currPage = response.data.data.number;//当前页
            $scope.isFirstPage = response.data.data.first;//是否是首页
            $scope.isLastPage = response.data.data.last;//是否是尾页
            $scope.lastUpPage = $scope.pages - 1;//倒数第二页
            $scope.lists = response.data.data.content;
        });
    };

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
    };
}

/**
 * 详情
 * @param $scope
 * @param $http
 * @param $window
 * @param $routeParams
 * @constructor
 */
function DescController($scope,$http,$window,$routeParams) {
    $http.get('/admin/log/queryData',{params:{id:$routeParams.id}}).then(function (response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.msg = response.data.data;
    });
}