var app = angular.module('app',['ngRoute']);

app.directive('ngInput', [function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs) {
            element.on('input',oninput);
            scope.$on('$destroy',function(){//销毁的时候取消事件监听
                element.off('input',oninput);
            });
            function oninput(event){
                scope.$evalAsync(attrs['ngInput'],{$event:event,$value:this.value});
            }
        }
    }
}]);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/project/list.html',controller:ProjectController})
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
function ProjectController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    //查询列表
    layui.use(['layer','form'], function() {
        var form = layui.jquery,
            layer = layui.layer,
            form = layui.form();


        //创建项目
        $('#add-project').on('click', function() {
            var schemeId ;
            $scope.search = function(url,id,hiddenId){
                console.log(id);
                console.log(hiddenId);
                $("#id").val('');
                var availableTags = [];
                $('#'+id).autocomplete({
                    autoFill:true,
                    mustMatch:true,
                    source : availableTags,
                    select : function(event, ui) {
                        schemeId =  $("#" + hiddenId).val(ui.item.id);
                        ui.item.value = ui.item.label;
                    }
                });
                var str = $('#'+id).val();
                $.ajax({
                    url:'/admin/manual/productScheme/search',
                    dataType:'json',
                    data:{"name":str},
                    success:function(response){
                        var list = response;
                        $.each(list,function(key,data){
                            console.log(data);
                            availableTags.push({id:data.id,label:data.name, value:data.name});
                        });
                    }
                });
            };
            $http.get('/admin/contract/all',{params:{projectId:''}}).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                $scope.contracts = response.data.data;
            },function (response) {
            });
            form.on('submit(add-project)', function(data){
                var data = JSON.stringify(data.field);
                var str = $("#schemeId").val();
                if(str == undefined || str == ''){
                    layer.msg('产品方案不能为空');
                    return false;
                }
                $.ajax({
                    type : 'POST',
                    headers: {'Content-type': 'application/json;charset=UTF-8'},
                    url : 'project/add',
                    data : data,
                    success : function (res) {
                        if(res.status == 'SUCCESS'){
                            layer.msg("创建成功!");
                            layer.closeAll();
                            $window.location.href="project.html";
                        }else if(res.status == 'FAIL'){
                            layer.msg("创建失败!");
                        }else if(res.status == 'CHECK_ONLY_ERROR'){
                            layer.msg("项目已存在!");
                        }
                    }
                });
            });
            layer.open({
                title: '创建项目',
                type: 1,
                content: $("#add-project-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });
        });
    });

    //项目修改
    $scope.edit = function (id) {

        $http.get('/admin/project/desc',{params:{id:id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.project = response.data.data;
        });
        $http.get('/admin/contract/all',{params:{projectId:id}}).then(function (response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.contracts = response.data.data;
        },function (response) {
        });
        layui.use(['layer','form'],function () {
            var form = layui.jquery,
                layer = layui.layer,
                form = layui.form();

            var schemeId ;
            //模糊查询
            $scope.search = function(url,id,hiddenId){
                $("#id").val('');
                var availableTags = [];
                $('#'+id).autocomplete({
                    autoFill:true,
                    mustMatch:true,
                    source : availableTags,
                    select : function(event, ui) {
                        schemeId =  $("#" + hiddenId).val(ui.item.id);
                        console.log(schemeId);
                        ui.item.value = ui.item.label;
                    }
                });
                var str = $('#'+id).val();
                $.ajax({
                    url:'/admin/manual/productScheme/search',
                    dataType:'json',
                    data:{"name":str},
                    success:function(response){
                        var list = response;
                        $.each(list,function(key,data){
                            availableTags.push({id:data.id,label:data.name, value:data.name});
                        });
                    }
                });
            };

            form.on('submit(edit-project)', function(data){
                var data = JSON.stringify(data.field);
                var str = $("#editId").val();
                if(str == undefined || str == ''){
                    layer.msg('产品方案不能为空');
                    return false;
                }
                $.ajax({
                    type : 'PUT',
                    headers: {'Content-type': 'application/json;charset=UTF-8'},
                    url : 'project/edit',
                    data : data,
                    success : function (res) {
                        if(res.status == 'SUCCESS'){
                            layer.msg("修改成功!");
                            layer.closeAll();
                            $window.location.href="project.html";
                        }else if(res.status == 'FAIL'){
                            layer.msg("修改失败!");
                        }else if(res.status == 'CHECK_ONLY_ERROR'){
                            layer.msg("项目已存在!");
                        }
                    }
                });
            });
            layer.open({
                title: '修改项目',
                type: 1,
                content: $("#edit-project-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });
        });

    };

    //项目详情
    $scope.desc = function (id) {
        $http.get('/admin/project/desc',{params:{id:id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.project = response.data.data;
        });

        layui.use('layer',function () {
            var $ = layui.jquery,
                layer = layui.layer;

            layer.open({
                title: '项目详情',
                type: 1,
                content: $("#detail-project-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });
        });
    };

    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/project/list?page='+page+'&size='+size).then(function (response) {
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




