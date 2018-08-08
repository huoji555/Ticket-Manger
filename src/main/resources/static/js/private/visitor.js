var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/sys/visitor/list.html',controller:ListController})
}]);

function ListController($scope,$http) {
    var size = 20;
    $scope.refresh=function(page){
        $http.get('/admin/visitor/list?page='+page+'&size='+size).then(function (response) {
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


    layui.use(['layer','form'], function() {
        var $ = layui.jquery,
            layer = layui.layer,
            form = layui.form();


        $scope.selectParams = function (data) {
            layer.open({
                title: '参数详情',
                type: 1,
                content: $("#desc-visitor-layer"),
                area: ['680px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    layer.closeAll();
                }
            });

            $scope.params = data;
        }

    });

}

