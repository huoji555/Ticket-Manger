var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
        when('/',{templateUrl:'html/sys/role/list.html',controller:ListController}).
        when('/role/add',{templateUrl:'html/sys/role/add.html',controller:AddController}).
        when('/role/edit/:id',{templateUrl:'html/sys/role/edit.html',controller:EditController}).
        when('/role/detail/:id',{templateUrl:'html/sys/role/detail.html',controller:DetailController}).
        when('/role/list',{templateUrl:'html/sys/role/list.html',controller:ListController})
}]);

/**
 * 分页列表
 * @param $scope
 * @param $http
 * @constructor
 */
function ListController($scope,$http,$window) {
    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/role/list?page='+page+'&size='+size).then(function (response) {
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

        //创建角色
        $('#add').on('click', function() {
            layer.open({
                title: '创建角色',
                type: 1,
                content: $("#add-role-layer"),
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
         * 添加角色
         * @param role
         * @param isValidata
         * @returns {boolean}
         */
        $scope.add = function (role,isValidata) {
            if(isValidata){
                layer.msg("* 为必填项");
                return false;
            }

            $http.post('/admin/role/add',role).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                var code = response.data.code;
                if(code == 0){
                    layer.closeAll();
                }else{
                    layer.msg("添加失败");
                }
            },function (response) {
                layer.msg("添加请求失败");
            });
        };

        /**
         * 打开修改的弹框
         * @param id
         */
        $scope.check = function (id) {
            $http.get('/admin/role/'+id).then(function (response) {
                $scope.role = response.data.data;
            });
            layer.open({
                title: '修改角色',
                type: 1,
                content: $("#edit-role-layer"),
                area: ['530px', '260px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $window.location.reload();
                }
            });
        };

        /**
         * 修改角色
         * @param role
         * @param isValidata
         * @returns {boolean}
         */
        $scope.editRole = function (role, isValidata) {
            if(isValidata){
                layer.msg("* 为必填项");
                return false;
            }

            $http.post('/admin/role/edit',role).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                var code = response.data.code;
                if(code == 0){
                    layer.closeAll();
                }else{
                    layer.msg("修改失败");
                }
            },function (response) {
                layer.msg("修改请求失败");
            });
        };

        /**
         * 角色详情
         * @param id
         */
        $scope.desc = function (id) {
            $http.get('/admin/role/'+id).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                $scope.role = response.data.data;
            });
            layer.open({
                title: '角色详情',
                type: 1,
                content: $("#desc-role-layer"),
                area: ['530px', '260px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    layer.closeAll();
                }
            });

        }


    });

}

function AddController($scope,$http,$location) {
    $scope.roleStatus = [
        {
            value : '1', name : '禁用'
        },
        {
            value : '0', name : '可用'
        }
    ];
    $scope.role={
        status:'0'
    }
    $scope.add = function (role) {
        $http.post('/admin/role/add',role).then(function (response) {
            var code = response.data.code;
            if(code == 0){
                $location.path("/role/list");
            }else{
                alert("添加失敗");
            }
        },function (response) {
            alert("添加請求失敗");
        });
    }
}

function EditController() {
    
}

function DetailController($scope,$http,$routeParams) {
    $http.get('/admin/role/add/'+$routeParams.id).then(function (response) {
        $scope.role = response.data.data;
    });
}



