var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/sys/manager/managerList.html',controller:AdminController}).
    when('/manager/add',{templateUrl:'html/sys/manager/add.html',controller:AddController}).
    when('/manager/desc/:id',{templateUrl:'html/sys/manager/desc.html',controller:DescController})
}]);

/**
 * 分页列表
 * @param $route
 * @param $scope
 * @param $http
 * @param $routeParams
 * @param $location
 * @param $filter
 * @constructor
 */
function AdminController($route,$scope,$http,$routeParams,$location,$filter) {
    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/sys/managerList?page='+page+'&size='+size).then(function (response) {
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


        /**
         * 分配角色
         * @param id
         */
        $scope.role = function (id) {
            $http.get('/admin/role/findAll').then(function (response) {
                $scope.list = response.data.list;
            });
            layer.open({
                title: '角色授权',
                type: 1,
                content: $("#add-role-layer"),
                area: ['530px', '310px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    layer.closeAll();
                }
            });

            $scope.auth = function () {
                if($scope.selected.length == 0){
                    layer.msg("授权角色不能为空");
                    return false;
                }

                var data = new FormData();
                data.append("roles",$scope.selected);
                data.append("id",id);

                $http({
                    method:'POST',
                    url:"/admin/sys/auth",
                    data: data,
                    headers: {'Content-Type':undefined}
                }).then(function (response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    if(response.data.code == 1){
                        layer.msg("授权失败");
                        return false;
                    }
                    layer.closeAll();
                });
            };

            /**
             * 复选角色
             * @type {Array}
             */
            $scope.selected = [];
            selectedCheckboxRole($scope,$scope.selected);
            function selectedCheckboxRole($scope,selected){
                var updateSelected = function(action,id,name){
                    if(action == 'add' && selected.indexOf(id) == -1){
                        selected.push(id);
                        console.log("Role----"+selected);
                    }
                    if(action == 'remove' && selected.indexOf(id)!=-1){
                        var idx = selected.indexOf(id);
                        selected.splice(idx,1);
                    }
                };
                $scope.updateRoleSelection = function($event, id){
                    var checkbox = $event.target;
                    var action = (checkbox.checked?'add':'remove');
                    updateSelected(action,id,checkbox.name);
                };
                $scope.isRoleSelected = function(id){
                    return selected.indexOf(id)>=0;
                }
            }
        };
    });
}

function DescController($scope,$http,$window,$routeParams) {

    $scope.flag = 0;
    $scope.status = 0;

    $http.get('/admin/sys/queryData',{params:{id:$routeParams.id}}).then(function (response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.admin = response.data.admin;
        $scope.roles = response.data.roles;
    });

    layui.use(['layer','form'], function() {
        var $ = layui.jquery,
            layer = layui.layer,
            form = layui.form();

        /**
         * 删除角色
         * @param roleId
         * @param adminId
         */
        $scope.delRole = function (roleId, adminId) {
            $http.get('/admin/sys/queryRoleData',{params:{roleId:roleId,adminId:adminId}}).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if(response.data.code == 0){
                    $window.location.reload();
                }else {
                    layer.msg("删除失败");
                }
            });
        };

        /**
         * 删除资源
         * @param menuId
         * @param roleId
         */
        $scope.delMenu = function (menuId, roleId) {
            $http.get('/admin/sys/queryMenuData',{params:{menuId:menuId,roleId:roleId}}).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if(response.data.code == 0){
                    $window.location.reload();
                }else {
                    layer.msg("删除失败");
                }
            });
        };

        /**
         * 查询单个角色拥有的资源
         * @param roleId
         */
        $scope.selAuth = function (roleId) {

            $scope.flag = 1;
            $scope.status = 1;
            $http.get('/admin/sys/queryRoleMenu',{params:{roleId:roleId}}).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if(response.data.code == 0){
                    $scope.menus = response.data.data;
                }else {
                    layer.msg("查询失败");
                }
            });
        }

    });
}

function AddController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    layui.use(['layer','form','element'], function() {
        var $ = layui.jquery,
            form = layui.form(),
            element = layui.element,
            layer = layui.layer;


        $scope.add = function (admin,isValidate) {
            if(isValidate){
                layer.msg("带*的选项为必填");
                return false;
            }

            $http.get('/admin/sys/verify',{params:{name:admin.name}}).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if('SUCCESS' == response.data.status){
                    $http.post('/admin/sys/add',admin).then(function (response){
                        if('SUCCESS' == response.data.status){
                            $window.location.href="manager.html";
                        }else if('FAIL' == response.data.status){
                            layer.msg('创建失败!');
                            return false;
                        }
                    });
                }else if('FAIL' == response.data.status){
                    layer.msg('管理员已存在!');
                    return false;
                }
            });
        }
    });

    function sleep(n) { //n表示的毫秒数
        var start = new Date().getTime();
        while (true) if (new Date().getTime() - start > n) break;
    }

}



