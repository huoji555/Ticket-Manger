var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/manual/guarantee/list.html',controller:GuaranteeController}).
    when('/guarantee/edit/:id',{templateUrl:'html/manual/guarantee/edit.html',controller:EditController})
}]);

/**
 * 修改担保方
 * @param $route
 * @param $scope
 * @param $http
 * @param $routeParams
 * @param $location
 * @param $filter
 * @param $window
 * @constructor
 */
function EditController($route,$scope,$http,$routeParams,$location,$filter,$window){
    $("select[name=type]").attr("disabled",true);

    $http.get('/admin/guarantee/desc',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.guarantee = response.data.data.guarantee;
    });

    $scope.edit = function (guarantee,isValidate) {
        $("select[name=type]").attr("disabled",false);

        if(isValidate){
            alert("您还有资料未填写!!!");
            return false;
        }
        //$scope.data = {"consumer":JSON.stringify(consumer),"cor":JSON.stringify(cor)};
        $http.put('/admin/guarantee/edit',guarantee).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                alert("修改成功!");
                $window.location.href="sgGuarantee.html";
            }else if('FAIL' == response.data.status){
                alert("修改失败!");
            }
        });
    }
}

/**
 * 分页列表
 * @param $scope
 * @param $http
 * @constructor
 */
function GuaranteeController($scope,$http,$window) {

    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/guarantee/list?page='+page+'&size='+size).then(function (response) {
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


        //创建担保人
        $('#add-guarantee').on('click', function() {

            layer.open({
                title: '创建担保方',
                type: 1,
                content: $("#add-guarantor-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $window.location.reload();
                    $scope.guarantee1 ={};
                }
            });
        });

        var count = 0;
        $scope.add = function (g,isValidate) {

            if(count > 0){
                layer.msg("不要重复提交!!!");
                return false;
            }



            if(isValidate){
                layer.msg("您还有资料未填写!!!");
                return false;
            }
            $http.post('/admin/guarantee/add',g).then(function(response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if('SUCCESS' == response.data.status){
                    layer.msg("创建成功!");
                    layer.closeAll();
                    $window.location.href="sgGuarantee.html";
                }else if('FAIL' == response.data.status){
                    layer.msg("创建失败!");
                }else if('ERROR' == response.data.status){
                    layer.msg("调用E签保出错!");
                }else if('E_ERROR' == response.data.status){
                    layer.msg(response.data.msg);
                }else if('ONLY_ERROR' == response.data.status){
                    layer.msg("担保人已存在");
                }

            });
        }
    });


    //担保人详情
    $scope.desc = function (id) {
        $http.get('/admin/guarantee/desc',{params:{id:id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.guarantee = response.data.data.guarantee;
        });

        layui.use('layer',function () {
            var $ = layui.jquery,
                layer = layui.layer;

            layer.open({
                title: '担保人详情',
                type: 1,
                content: $("#detail-guarantee-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });
        });
    };

    $scope.update = function (guarantee,isValidate) {
        if(isValidate){
            layer.msg("您还有资料未填写!!!");
            return false;
        }
        $http.put('/admin/guarantee/edit',guarantee).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg("修改成功!");
                layer.closeAll();
                $window.location.href="sgGuarantee.html";
            }else if('FAIL' == response.data.status){
                layer.msg("修改失败!");
            }
        });
    };

    $scope.edit = function (id) {
        $http.get('/admin/guarantee/desc',{params:{id:id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.guarantee = response.data.data.guarantee;
        });

        layui.use(['layer'],function () {
            var $ = layui.jquery,
                layer = layui.layer;
            layer.open({
                title: '修改产品方案',
                type: 1,
                content: $("#edit-guarantee-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $scope.guarantee ={};
                }
            });
        });

    };



}




