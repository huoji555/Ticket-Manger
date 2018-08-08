var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/manual/contract/list.html',controller:ContractController}).
    when('/contract/edit/:id',{templateUrl:'html/manual/contract/edit.html',controller:EditController}).
    when('/contract/add',{templateUrl:'html/manual/contract/add.html',controller:AddController}).
    when('/contract/detail/:id',{templateUrl:'html/manual/contract/detail.html',controller:DetailController})
}]);

function ContractController($scope,$http,$route,$window) {
    $scope.query = function (page) {
        $http.get('/admin/contract/query',{params:{page:page,size:10}}).then(function (response) {
            $scope.contracts = response.data.data;
        },function (response) {

        });
    }

    $scope.query(1);

    layui.use(['layer','form'], function() {
        var $ = layui.jquery,
            layer = layui.layer,
            form = layui.form();


        //创建担保人
        $('#add-contract').on('click', function() {

            layer.open({
                title: '创建合同',
                type: 1,
                content: $("#add-contract-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $scope.contract =[];
                }
            });
        });

        $scope.addContract = function (contract) {
            var file = document.querySelector('input[type=file]').files[0];

            if(file == undefined){
                alert("文件不能为空");
                //file = new File([""],"");
            }

            var fd = new FormData();
            var contractVo =JSON.stringify(contract);
            console.log(contractVo);
            fd.append('file', file);
            fd.append("contract",contractVo);

            $http({
                method :'POST',
                url : '/admin/contract/save',
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (response) {//成功
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                var code = response.data.code;

                if(code == 0){
                    layer.closeAll();
                    $window.location.href = "sgContract.html";
                }else if(code == 1){
                    layer.msg("合同已存在");
                    return false;
                }
            },function (response) {//失败
                console.log(response.data);
            });
        };
        $scope.filename = "";
        $scope.uploadFile = function () {
            var file = document.querySelector('input[type=file]').files[0];
            $scope.filename = file.name;
            $scope.$apply();
        };

    });

    $scope.desc = function (id) {
        $http.get('/admin/contract/detail?id='+id).then(function (response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.contract = response.data.data;
        });

        layui.use('layer',function () {
            var $ = layui.jquery,
                layer = layui.layer;

            layer.open({
                title: '合同详情',
                type: 1,
                content: $("#detail-contract-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });
        });
    };

    $scope.update = function (id) {
        $http.get('/admin/contract/detail?id='+id).then(function (response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.contract = response.data.data;
        });

        layui.use(['layer','form'],function () {
            var $ = layui.jquery,
                layer = layui.layer,
                form = layui.form();

            layer.open({
                title: '合同修改',
                type: 1,
                content: $("#edit-contract-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });

            $scope.updateContract = function (contract) {
                var file = document.querySelector('input[type=file]').files[0];

                var fd = new FormData();
                var contractDatas =JSON.stringify(contract);

                if(file == undefined){
                    alert("文件不能为空");
                    //file = new File([""],"");
                }
                fd.append('file', file);
                fd.append("contract",contractDatas);
                console.log(fd);
                $http({
                    method :'POST',
                    url : '/admin/contract/update',
                    data: fd,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).then(function (response) {//成功
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    var code = response.data.code;
                    layer.closeAll();
                    $window.location.href = "sgContract.html";
                },function (response) {//失败
                    console.log(response.data);
                });
            }
        });


    };

    $scope.deleteContract = function (contract) {
        $http.delete('/admin/contract/delete/'+contract[0]).then(function (response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            var code = response.data.code;

            if(response.data.data == '1'){
                alert("此合同有关联项目,不能删除");
            }else{

                if(code == 0){
                    $route.reload();
                }
            }
        },function (response) {

        });
    }
}

function EditController($scope,$http,$routeParams,$location) {
    $http.get('/admin/contract/detail?id='+$routeParams.id).then(function (response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.contract = response.data.data;
    });

    $scope.updateContract = function (contract) {
        var file = document.querySelector('input[type=file]').files[0];

        var fd = new FormData();
        var contractDatas =JSON.stringify(contract);

        if(file == undefined){
            file = new File([""],"");
        }
        fd.append('file', file);
        fd.append("contract",contractDatas);

        $http({
            method :'POST',
            url : '/admin/contract/update',
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {//成功
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            var code = response.data.code;
            $location.path("/");
        },function (response) {//失败
            console.log(response.data);
        });
    }
}

function AddController($scope,$http,$location,$compile) {

    layui.use('layer',function () {
        var layer = layui.layer;
    });

    $scope.addContract = function (contract) {
        var file = document.querySelector('input[type=file]').files[0];

        var fd = new FormData();
        var contractVo =JSON.stringify(contract);
        fd.append('file', file);
        fd.append("contract",contractVo);

        $http({
            method :'POST',
            url : '/admin/contract/save',
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {//成功
            var code = response.data.code;
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }

            if(code == 0){
                $location.path("/");
            }else if(code == 1){
                layer.msg("合同已存在");
                return false;
            }
        },function (response) {//失败
            console.log(response.data);
        });
    };
    $scope.filename = "";
    $scope.uploadFile = function () {
        var file = document.querySelector('input[type=file]').files[0];
        $scope.filename = file.name;
        $scope.$apply();
    };



    /*

    var html = '<div ng-repeat="g in guarantees">'+
        '<blockquote class="layui-elem-quote layui-quote-nm" id="blockquote_{{g[0]}}">'+
        '    <a class="delete" ng-click="del(g)"><i class="layui-icon">&#xe640;</i></a>'+
        '    <div class="layui-form-item">'+
        '        <label class="layui-form-label">担保方类型 ：</label>'+
        '        <div class="layui-input-block">'+
        '            <p ng-if="g[8]==0">企业</p>'+
        '            <p ng-if="g[8]==1">个人</p>'+
        '        </div>'+
        '    </div>'+
        '    <div class="layui-form-item" ng-show="g[8]==0">'+
        '        <label class="layui-form-label">企业名称：</label>'+
        '        <div class="layui-input-block">'+
        '            <p>{{g[5]}}</p>'+
        '        </div>'+
        '    </div>'+
        '    <div class="layui-form-item" ng-show="guarantee.type==0">'+
        '        <label class="layui-form-label">营业执照号：</label>'+
        '        <div class="layui-input-block">'+
        '            <p>{{g[1]}}</p>'+
        '        </div>'+
        '    </div>'+
        '    <div class="layui-form-item">'+
        '        <label class="layui-form-label">个人名称：</label>'+
        '        <div class="layui-input-block">'+
        '            <p>{{g[2]}}</p>'+
        '        </div>'+
        '    </div>'+
        '    <div class="layui-form-item">'+
        '        <label class="layui-form-label">身份证号：</label>'+
        '        <div class="layui-input-block">'+
        '            <p>{{g[4]}}</p>'+
        '        </div>'+
        '    </div>'+
        '    <div class="layui-form-item">'+
        '        <label class="layui-form-label">手机号：</label>'+
        '        <div class="layui-input-block">'+
        '            <p>{{g[6]}}</p>'+
        '        </div>'+
        '    </div>'+
        '</blockquote>'+
        '</div>';

    $scope.guarantees = new Array();
    $scope.count = 0;

    $scope.initData = function(){
        $http.get('/admin/manual/loan/query',{params:{id:'SG201804191626000271'}}).then(function(response) {
            if(response.data.guaranteeList.length > 0){
                $scope.guarantees = response.data.guaranteeList; //担保人列表
                $scope.count = $scope.guarantees.length;
                var template = angular.element(html);
                var mobileDialogElement = $compile(template)($scope);
                angular.element($("#show_this")).append(mobileDialogElement);
            }
        });
    }
    $scope.initData();

    $scope.test = function(){
        var id = $("#input_text").val();
        if(id!='' && id != undefined && $scope.count < 5){
            $('#show_this').html('');
            $http.get('/admin/guarantee/desc1',{params:{id:id}}).then(function(response) {
                $scope.guarantees.push(response.data.data[0]);
                var template = angular.element(html);
                var mobileDialogElement = $compile(template)($scope);
                angular.element($("#show_this")).append(mobileDialogElement);
            });
            $scope.count++;
        }else{
            alert("id不能为空,且担保人个数不能大于5个");
        }
    }

    $scope.del = function(guarantee){
        var obj = $('#show_this');
        obj.html('');
        $scope.guarantees.splice($.inArray(guarantee, $scope.guarantees), 1)
        var template = angular.element(html);
        var mobileDialogElement = $compile(template)($scope);
        angular.element(obj).append(mobileDialogElement);
        $scope.count--;
    }
    */
}

function DetailController($scope,$http,$routeParams) {
    $http.get('/admin/contract/detail?id='+$routeParams.id).then(function (response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.contract = response.data.data;
    });
}