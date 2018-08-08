var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/manual/consumer/list.html',controller:ConsumerController}).
    when('/manual/consumer/verify',{templateUrl:'html/manual/consumer/verify.html',controller:VerifyController}).
    when('/manual/:page',{templateUrl:'html/manual/consumer/list.html',controller:CallBackController}).
    when('/manual/consumer/companyAdd',{templateUrl:'html/manual/consumer/companyAdd.html',controller:ComAddController}).
    when('/manual/consumer/personAdd',{templateUrl:'html/manual/consumer/personAdd.html',controller:PerAddController}).
    when('/manual/consumer/editCompany/:id/:page',{templateUrl:'html/manual/consumer/companyEdit.html',controller:EditCompanyController}).
    when('/manual/consumer/editPerson/:id/:page',{templateUrl:'html/manual/consumer/personEdit.html',controller:EditPersonController}).
    // when('/manual/consumer/edit/:id',{templateUrl:'html/manual/consumer/edit.html',controller:EditController}).
    when('/manual/consumer/desc/:id/:page',{templateUrl:'html/manual/consumer/desc.html',controller:DescController})
}]);

/**
 * 用户验证
 * @param $route
 * @param $scope
 * @param $http
 * @param $window
 * @param $routeParams
 * @param $location
 * @param $filter
 * @constructor
 */
function VerifyController($route,$scope,$http,$window,$routeParams,$location,$filter) {

    $scope.verify = function (consumerVo,isValidate) {
        if(isValidate){
            layer.msg("您还有资料未填写!!!");
            return false;
        }else{

            $http.post('/admin/manual/consumer/verify',consumerVo).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if('SUCCESS' == response.data.status){
                    layer.msg("客户已经存在");
                    //$window.location.href="sgLoan.html#!/sgloan/add/"+response.data.id;
                }else if('FAIL' == response.data.status){
                    layer.msg('系统中还没有该客户!');
                    if(consumerVo.structure == 0){
                        //企业用户,跳转到企业add页面
                        $window.location.href="sgUser.html#!/manual/consumer/companyAdd";
                    }else if(consumerVo.structure == 1){
                        //个人用户,跳转到个人add页面
                        $window.location.href="sgUser.html#!/manual/consumer/personAdd";
                    }
                }else if('ERROR' == response.data.status){
                    layer.msg('参数错误!');
                }
            });
        }
    }
}

/**
 * 企业新增
 * @param $route
 * @param $scope
 * @param $http
 * @param $window
 * @param $routeParams
 * @param $location
 * @param $filter
 * @constructor
 */
function ComAddController($route,$scope,$http,$window,$routeParams,$location,$filter) {

    layui.use(['element', 'upload', 'form'], function () {

        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            layer = layui.layer,
            element = layui.element,
            form = layui.form(),
            upload = layui.upload;

        $scope.addCompany = function (consumer,cor,isValidate) {

            if(!/^1[34578]\d{9}$/.test(cor.corPhone)){
                layer.msg("法人电话号格式不正确!!!");
                return false;
            }

            if(!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(cor.corNo)){
                layer.msg("法人身份证格式不正确!!!");
                return false;
            }

            if(isValidate){
                layer.msg("还有必填信息未输入!!");
                return false;
            }else{
                $scope.data = {"consumer":JSON.stringify(consumer),"cor":JSON.stringify(cor)};
                $http.post('/admin/manual/consumer/add',$scope.data).then(function (response){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    if('SUCCESS' == response.data.status){
                        layer.msg('创建成功!');
                        $window.location.href="sgUser.html";
                    }else if('FAIL' == response.data.status){
                        layer.msg('新增失败!');
                    }else if('REPEAT' == response.data.status){
                        layer.msg('企业或个人已存在!');
                    }else if('COS_ERROR' == response.data.status){
                        layer.msg("企业调用E签保出错!");
                    }else if('E_ERROR' == response.data.status){
                        layer.msg(response.data.msg);
                    }else if('COR_ERROR' == response.data.status){
                        layer.msg("法人调用E签保出错!");
                    }
                });
            }
        };
    });


    $http.get('/admin/project/listInfo').then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.projectList = response.data.lists;
    });

    $scope.submit = function (corNo,isValidate) {
        //layer.msg(ipNo);
        if(corNo == null || corNo == ''){
            layer.msg("请先填写法人证件号,再上传!!!");
            return false;
        }

        if(isValidate){
            layer.msg("请填必填信息!!");
            return false;
        }
        var fd = new FormData();
        var files = document.querySelector('input[name="files"]').files;
        for (var i=0; i<files.length; i++) {
            //console.log(files[i]);
            fd.append("files", files[i]);
            //console.log(fd[0])
        }
        fd.append("corNo",corNo);
        $.ajax({
            url : '/admin/manual/consumer/upload',
            type : "POST",
            data : fd,
            contentType: false,
            processData: false,
            dataType:'json',
            success : function (data) {
                if(data.status == 'SUCCESS'){
                    layer.msg('上传成功');
                }else if(data.status == 'FAIL'){
                    layer.msg('上传失败');
                }
            }
        })

    };
}

/**
 * 个人新增
 * @param $route
 * @param $scope
 * @param $http
 * @param $window
 * @param $routeParams
 * @param $location
 * @param $filter
 * @constructor
 */
function PerAddController($route,$scope,$http,$window,$routeParams,$location,$filter) {
//查询列表
    $http.get('/admin/project/listInfo').then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.projectList = response.data.lists;
    });

    $scope.submit = function (ipNo) {
        //layer.msg(ipNo);
        if(ipNo == null || ipNo == ''){
            layer.msg("请先填写证件号,再上传!!!");
            return false;
        }
        var fd = new FormData();
        var files = document.querySelector('input[name="files"]').files;
        for (var i=0; i<files.length; i++) {
            //console.log(files[i]);
            fd.append("files", files[i]);
            //console.log(fd[0])
        }
        fd.append("corNo",ipNo);
        $.ajax({
            url : '/admin/manual/consumer/upload',
            type : "POST",
            data : fd,
            contentType: false,
            processData: false,
            dataType:'json',
            success : function (data) {
                if(data.status == 'SUCCESS'){
                    layer.msg('上传成功');
                }else if(data.status == 'FAIL'){
                    layer.msg('上传失败');
                }
            }
        })

    };

    $scope.addPerson = function (consumer,isValidate) {
        if(isValidate){
            layer.msg("您还有资料未填写!!!");
            return false;
        }else{
            $scope.data = {"consumer":JSON.stringify(consumer)};
            $http.post('/admin/manual/consumer/add',$scope.data).then(function (response){
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if('SUCCESS' == response.data.status){
                    layer.msg('创建成功!');
                    $window.location.href="sgUser.html";
                }else if('FAIL' == response.data.status){
                    layer.msg('新增失败!');
                }else if('REPEAT' == response.data.status){
                    layer.msg('个人已存在!');
                }
            });
        }
    }
}

/**
 * 分页列表
 * @param $scope
 * @param $http
 * @constructor
 */
function ConsumerController($scope,$http,$routeParams) {

    var size = 10;

    $scope.refresh=function(page){
        $http.get('/admin/manual/consumer/list?page='+page+'&size='+size).then(function (response) {
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

/**
 * 返回
 * @param $scope
 * @param $http
 * @param $routeParams
 * @constructor
 */
function CallBackController($scope,$http,$routeParams) {
    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/manual/consumer/list?page='+page+'&size='+size).then(function (response) {
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

    $scope.refresh($routeParams.page);

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

    $scope.callback = function () {
        $window.location.href="sgUser.html#!/manual/"+$routeParams.page;
    };

    layui.use(['element', 'upload', 'form'], function () {

        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            layer = layui.layer,
            element = layui.element,
            form = layui.form(),
            upload = layui.upload;


        $http.get('/admin/manual/consumer/desc',{params:{id:$routeParams.id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            $scope.consumer = response.data.consumer;
            $scope.project = response.data.project;
            $scope.voList = response.data.voList;
            $scope.cor = response.data.cor;
        });
    });


}

/**
 * 修改企业
 * @param $route
 * @param $scope
 * @param $http
 * @param $routeParams
 * @param $location
 * @param $filter
 * @param $window
 * @constructor
 */
function EditCompanyController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    $scope.callback = function () {
        $window.location.href="sgUser.html#!/manual/"+$routeParams.page;
    };

    $("select[name=structure]").attr("disabled",true);

    $http.get('/admin/manual/consumer/desc',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.consumer = response.data.consumer;
        $scope.cor = response.data.cor;
        $scope.voList = response.data.voList;
    });

    layui.use(['element', 'upload', 'form'], function () {

        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            layer = layui.layer,
            element = layui.element,
            form = layui.form(),
            upload = layui.upload;


        $scope.editCompany = function (consumer,cor,isValidate) {

            if(!/^1[34578]\d{9}$/.test(cor.corPhone)){
                layer.msg("法人电话号格式不正确!!!");
                return false;
            }

            if(!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(cor.corNo)){
                layer.msg("法人身份证格式不正确!!!");
                return false;
            }

            $("select[name=structure]").attr("disabled",false);

            if(isValidate){
                layer.msg("您还有资料未填写!!!");
                return false;
            }
            $scope.data = {"consumer":JSON.stringify(consumer),"cor":JSON.stringify(cor)};
            $http.put('/admin/manual/consumer/edit',$scope.data).then(function(response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if('SUCCESS' == response.data.status){
                    layer.msg("修改成功!");
                    $window.location.href="sgUser.html";
                }else if('FAIL' == response.data.status){
                    layer.msg("修改失败!");
                }
            });
        }
    });




    // //查询列表
    // $http.get('/admin/project/list').then(function(response) {
    //     $scope.projectList = response.data.lists;
    // });


    $scope.detData = function (vo,consumer) {
        $scope.data = {"vo":JSON.stringify(vo),"consumer":JSON.stringify(consumer)};

        $http.put('/admin/manual/consumer/detData',$scope.data).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg('删除成功!');
                $window.location.reload();
            }else if('FAIL' == response.data.status){
                layer.msg("修改失败!");
            }
        });

    };

    $scope.submit = function (ipNo) {
        //layer.msg(ipNo);
        if(ipNo == null || ipNo == ''){
            layer.msg("请先填写证件号,再上传!!!");
            return false;
        }
        var fd = new FormData();
        var files = document.querySelector('input[name="files"]').files;
        for (var i=0; i<files.length; i++) {
            //console.log(files[i]);
            fd.append("files", files[i]);
            //console.log(fd[0])
        }
        fd.append("ipNo",ipNo);
        $.ajax({
            url : '/admin/manual/consumer/edit/upload',
            type : "POST",
            data : fd,
            contentType: false,
            processData: false,
            dataType:'json',
            success : function (data) {
                if(data.status == 'SUCCESS'){
                    layer.msg('上传成功');
                    $window.location.reload();
                }else if(data.status == 'FAIL'){
                    layer.msg('上传失败');
                }
            }
        })

    };
}

/**
 * 修改个人
 * @param $route
 * @param $scope
 * @param $http
 * @param $routeParams
 * @param $location
 * @param $filter
 * @param $window
 * @constructor
 */
function EditPersonController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    $("select[name=structure]").attr("disabled",true);

    //查询列表
    $http.get('/admin/project/list').then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.projectList = response.data.lists;
    });

    $http.get('/admin/manual/consumer/desc',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.consumer = response.data.consumer;
        $scope.voList = response.data.voList;
    });

    $scope.detData = function (vo,consumer) {
        $scope.data = {"vo":JSON.stringify(vo),"consumer":JSON.stringify(consumer)};

        $http.put('/admin/manual/consumer/detData',$scope.data).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg('删除成功!');
                $window.location.reload();
            }else if('FAIL' == response.data.status){
                layer.msg("修改失败!");
            }
        });

    };

    $scope.submit = function (ipNo) {
        //layer.msg(ipNo);
        if(ipNo == null || ipNo == ''){
            layer.msg("请先填写证件号,再上传!!!");
            return false;
        }
        var fd = new FormData();
        var files = document.querySelector('input[name="files"]').files;
        for (var i=0; i<files.length; i++) {
            //console.log(files[i]);
            fd.append("files", files[i]);
            //console.log(fd[0])
        }
        fd.append("ipNo",ipNo);
        $.ajax({
            url : '/admin/manual/consumer/edit/upload',
            type : "POST",
            data : fd,
            contentType: false,
            processData: false,
            dataType:'json',
            success : function (data) {
                if(data.status == 'SUCCESS'){
                    layer.msg('上传成功');
                    $window.location.reload();
                }else if(data.status == 'FAIL'){
                    layer.msg('上传失败');
                }
            }
        })

    };


    $scope.editPerson = function (consumer) {
        $("select[name=structure]").attr("disabled",false);
        $scope.data = {"consumer":JSON.stringify(consumer)};
        $http.put('/admin/manual/consumer/edit',$scope.data).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg("修改成功!");
                $window.location.href="sgUser.html";
            }else if('FAIL' == response.data.status){
                layer.msg("修改失败!");
            }
        });
    }
}




