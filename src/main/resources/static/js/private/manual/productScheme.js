var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/productScheme/list.html',controller:ProductSchemeController}).
    when('/productScheme/desc/:id',{templateUrl:'html/productScheme/desc.html',controller:DescController}).
    when('/productScheme/edit/:id',{templateUrl:'html/productScheme/edit.html',controller:EditController}).
    when('/productScheme/add',{templateUrl:'html/productScheme/add.html',controller:AddController})
}]);

/**
 * 列表
 * @param $route
 * @param $scope
 * @param $http
 * @param $routeParams
 * @param $location
 * @param $filter
 * @param $window
 * @constructor
 */
function ProductSchemeController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    layui.use(['layer','form'], function() {
        var form = layui.jquery,
            layer = layui.layer,
            form = layui.form();


        //创建产品
        $('#add-product').on('click', function() {
            $scope.add = function (productScheme,isValidate) {
                if(isValidate){
                    layer.msg("您还有资料未填写!!!");

                    return false;
                }

                $http.post('/admin/manual/productScheme/add',productScheme).then(function (response){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    if('SUCCESS' == response.data.status){
                        layer.msg('创建成功!');
                        layer.closeAll();
                        $window.location.href="productScheme.html";
                    }else if('FAIL' == response.data.status){
                        layer.msg('创建失败!');
                        return false;
                    }else if('CHECK_ONLY_ERROR' == response.data.status){
                        layer.msg('该产品方案已存在!');
                        return false;
                    }
                });
            };
            layer.open({
                title: '创建产品方案',
                type: 1,
                content: $("#add-product-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });
        });
    });

    //修改产品方案
    $scope.edit = function (id) {
        $http.get('/admin/manual/productScheme/desc',{params:{id:id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.productScheme = response.data.productScheme;
        });

        layui.use(['layer','form'],function () {
            var $ = layui.jquery,
                layer = layui.layer,
                form = layui.form();
            layer.open({
                title: '修改产品方案',
                type: 1,
                content: $("#edit-product-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $scope.productScheme ={};
                }
            });
        });
    };

    $scope.update = function (productScheme,isValidate) {
        if(isValidate){
            layer.msg("您还有资料未填写!!!");
            return false;
        }
        $http.put('/admin/manual/productScheme/edit',productScheme).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg("修改成功!");
                layer.closeAll();
                $window.location.href="productScheme.html";
            }else if('FAIL' == response.data.status){
                layer.msg("修改失败!");
            }else if('CHECK_ONLY_ERROR' == response.data.status){
                layer.msg('该产品方案已存在!');
                return false;
            }
        });
    };

    //产品详情
    $scope.desc = function (id) {
        $http.get('/admin/manual/productScheme/desc',{params:{id:id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.productScheme = response.data.productScheme;
        });

        layui.use('layer',function () {
            var $ = layui.jquery,
                layer = layui.layer;

            layer.open({
                title: '产品方案详情',
                type: 1,
                content: $("#detail-product-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });
        });
    };

    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/manual/productScheme/list?page='+page+'&size='+size).then(function (response) {
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
    }


}

function EditController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    $http.get('/admin/manual/productScheme/desc',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.productScheme = response.data.productScheme;
    });

    $scope.edit = function (productScheme,isValidate) {

        if(isValidate){
            alert("您还有资料未填写!!!");
            return false;
        }

        $http.put('/admin/manual/productScheme/edit',productScheme).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                alert('修改成功!');
                $window.location.href="productScheme.html";
            }else if('FAIL' == response.data.status){
                alert('修改失败!');
                return false;
            }
        });
    }
}

/**
 * 详情
 * @param $route
 * @param $scope
 * @param $http
 * @param $routeParams
 * @param $location
 * @param $filter
 * @param $window
 * @constructor
 */
function DescController($route,$scope,$http,$routeParams,$location,$filter,$window) {
    $http.get('/admin/manual/productScheme/desc',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.productScheme = response.data.productScheme;
    });
}

/**
 * 新增
 * @param $route
 * @param $scope
 * @param $http
 * @param $routeParams
 * @param $location
 * @param $filter
 * @param $window
 * @constructor
 */
function AddController($route,$scope,$http,$routeParams,$location,$filter,$window) {





}



