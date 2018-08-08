var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/sys/menu/list.html',controller:ListController})
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
function ListController($route,$scope,$http,$window) {
    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/sys/menu/list?page='+page+'&size='+size).then(function (response) {
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
            $scope.lists = response.data.data;
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


        //创建项目
        $('#add').on('click', function() {
            layer.open({
                title: '创建一级菜单',
                type: 1,
                content: $("#add-menu-layer"),
                area: ['530px', '260px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $window.location.reload();
                }
            });

        });

        /**
         * 添加一级菜单
         * @param menu
         * @param isValidate
         * @returns {boolean}
         */
        $scope.add = function (menu,isValidate) {
            if(isValidate){
                layer.msg("* 为必填项");
                return false;
            }

            $http.post('/admin/sys/menu/add',menu).then(function(response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if(response.data.code == 1){
                    layer.msg("创建失败");
                    return false;
                }
                layer.closeAll();
            });
        };

        /**
         * 添加二级菜单
         * @param menuId
         */
        $scope.addSecondMenu = function (menuId) {

            layer.open({
                title: '创建二级菜单',
                type: 1,
                content: $("#add-secondMenu-layer"),
                area: ['530px', '310px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $window.location.reload();
                }
            });

            $scope.addSecMenu = function (secondMenu) {
                var data = new FormData();
                data.append("secondMenu",JSON.stringify(secondMenu));
                data.append("menuId",menuId);

                /**
                 * 添加二级菜单
                 */
                $http({
                    method:'POST',
                        url:"/admin/sys/menu/addSecondMenu",
                    data: data,
                    headers: {'Content-Type':undefined}
                }).then(function (response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    if(response.data.code == 1){
                        layer.msg("创建失败");
                        return false;
                    }
                    layer.closeAll();
                });
            }
        };

        /**
         * 弹出授权窗口
         * @param menuId
         */
        $scope.authorize = function (menuId) {
            $http.get('/admin/role/findAll/'+menuId).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                $scope.list = response.data.list;
                $scope.menuList = response.data.menuList;
            });
            layer.open({
                title: '资源授权',
                type: 1,
                content: $("#add-authorize-layer"),
                area: ['530px', '310px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    layer.closeAll();
                    //$window.location.reload();
                }
            });

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

            /**
             * 复选资源
             * @type {Array}
             */
            $scope.menuSelected = [];
            $scope.menuSelected.push(menuId);
            selectedCheckboxMenu($scope,$scope.menuSelected);
            function selectedCheckboxMenu($scope,menuSelected){
                var updateSelected = function(action,id,name){
                    if(action == 'add' && menuSelected.indexOf(id) == -1){
                        menuSelected.push(id);
                        console.log("Menu----"+menuSelected);
                    }
                    if(action == 'remove' && menuSelected.indexOf(id)!=-1){
                        var idx = menuSelected.indexOf(id);
                        menuSelected.splice(idx,1);
                    }
                };
                $scope.updateMenuSelection = function($event, id){
                    var checkbox = $event.target;
                    var action = (checkbox.checked?'add':'remove');
                    updateSelected(action,id,checkbox.name);
                };
                $scope.isMenuSelected = function(id){
                    return menuSelected.indexOf(id)>=0;
                }
            }


            /**
             * 授权
             */
            $scope.auth = function () {

                if($scope.selected.length == 0){
                    layer.msg("授权角色不能为空");
                    return false;
                }

                console.log("len---------"+$scope.menuSelected.length);

                if($scope.menuSelected.length < 2){
                    layer.msg("授权资源不能为空");
                    return false;
                }

                var data = new FormData();
                //data.append("menuId",menuId);
                data.append("roles",$scope.selected);
                data.append("menus",$scope.menuSelected);
                // console.log("role====="+$scope.selected);
                // console.log("menu====="+$scope.menuSelected);
                $http({
                    method:'POST',
                    url:"/admin/sys/menu/auth",
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

            }
        };
    });
}


