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
    when('/',{templateUrl:'html/manual/loan/list.html',controller:SgLoanController}).
    when('/sgloan/verify',{templateUrl:'html/manual/loan/verify.html',controller:VerifyController}).
    when('/sgloan/add/:loanId/:id',{templateUrl:'html/manual/loan/add.html',controller:AddController}).
    when('/sgloan/:page',{templateUrl:'html/manual/loan/list.html',controller:CallBackController}).
    when('/sgloan/desc/:id/:page',{templateUrl:'html/manual/loan/desc1.html',controller:DescController}).
    when('/sgloan/desc/:id',{templateUrl:'html/manual/loan/desc2.html',controller:DescTrackController}).
    when('/sgloan/edit/:id/:page',{templateUrl:'html/manual/loan/edit1.html',controller:EditController}).
    when('/sgloan/examine/:id/:page',{templateUrl:'html/manual/loan/examine1.html',controller:ExamineController}).
    when('/sgloan/hk/:id/:page',{templateUrl:'html/manual/loan/repay.html',controller:HkController})
}]);

function CallBackController($scope,$http,$routeParams,$window) {

    $scope.callback = function () {
        $window.location.href="sgLoan.html#!/sgloan/"+$routeParams.page;
    };

    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/manual/loan/list?page='+page+'&size='+size).then(function (response) {
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
    };

    layui.use(['layer','form'], function() {
        var $ = layui.jquery,
            layer = layui.layer,
            form = layui.form();

        $scope.verifyLoan = function () {
            layer.open({
                title: '企业校验',
                type: 1,
                content: $("#verify-loan-layer"),
                area: ['560px', '260px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end: function () {
                    $window.location.reload();
                }
            });
            form.on('submit(verify-loan)', function (data) {
                var data = JSON.stringify(data.field);
                $.ajax({
                    type: 'POST',
                    headers: {'Content-type': 'application/json;charset=UTF-8'},
                    url: 'manual/loan/verify',
                    data: data,
                    success: function (res) {
                        if ('SUCCESS' == res.status) {
                            layer.closeAll();
                            $window.location.href = "sgLoan.html#!/sgloan/add/" + res.loanId + "/" + res.id;
                        } else if ('FAIL' == res.status) {
                            layer.msg('企业不存在!');
                            //$window.location.href="sgUser.html#!/manual/consumer/add";
                        } else if ('NOOVER' == res.status) {
                            layer.msg('清先还清借款!!!');
                            //$window.location.href="sgLoan.html";
                        }
                    }
                });
            });
            form.render();
        };
        /**
         * 生成链接
         * @param loan
         */
        $scope.line = function (loan) {
            //$scope.flag = true;
            $http.get('/admin/manual/loan/line?id='+loan.id).then(function(response) {
                $scope.msg = response.data.con;
                if(loan.consumer.structure == 0){
                    layer.open({
                        title: '<span style="font-size:8px">'+loan.consumer.company+'</span>',
                        type: 1,
                        content: $("#sign-link-layer"),
                        area: ['300px', '350px'],
                        shade: 0.3,
                        btnAlign: 'c',
                        shadeClose: true
                    });
                }else {
                    layer.open({
                        title: '<span style="font-size:8px">'+loan.consumer.name+'</span>',
                        type: 1,
                        content: $("#sign-link-layer"),
                        area: ['300px', '350px'],
                        shade: 0.3,
                        btnAlign: 'c',
                        shadeClose: true
                    });
                }

            });
        };

        $scope.confirm = function (loan) {

            $scope.applyAmount = loan.applyAmount;
            $scope.loanAccount = loan.loanAccount;
            $scope.loanAccountNo = loan.loanAccountNo;
            $scope.loanBranch = loan.loanBranch;

            layer.open({
                title: '确认放款',
                type: 1,
                content: $("#confirm-loan-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                btnAlign: 'r',
                btn: ['确认放款', '取消'],
                yes: function(index, layero){
                    $http.put('/admin/manual/loan/editStatus',loan).then(function(response) {
                        if(response.data.code == 1){
                            layer.msg(response.data.msg);
                            return;
                        }
                        if('SUCCESS' == response.data.status){
                            layer.msg("放款成功!");
                            $window.location.reload();
                        }else if('FAIL' == response.data.status){
                            layer.msg('放款失败!');
                        }
                    });
                },
                btn2: function(index, layero){
                    layer.closeAll();
                }

            });
        };

    });
}

function VerifyController($route,$scope,$http,$window,$routeParams,$location,$filter) {

    $scope.verify = function (consumerVo) {
        console.log(consumerVo);
        $http.post('/admin/manual/loan/verify',consumerVo).then(function (response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                $window.location.href="sgLoan.html#!/sgloan/add/"+response.data.id;
            }else if('FAIL' == response.data.status){
                layer.msg('客户不存在!');
                $window.location.href="sgUser.html#!/manual/consumer/add";
            }else if('NOOVER' == response.data.status){
                layer.msg('清先还清借款!!!');
                //$window.location.href="sgLoan.html";
            }
        });
    }
}

function HkController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    $scope.callback = function () {
        $window.location.href="sgLoan.html#!/sgloan/"+$routeParams.page;
    };

    $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.loan = response.data.loan;
        $scope.lists = response.data.lists;
    });

    layui.use('layer', function() {
        var layer = layui.layer;

    
        $scope.repay = function (repayPlan) {
            //var r = confirm('是否确认本次还款');
            layer.confirm('是否确认本次还款？', {
                btn: ['是','否'] //按钮
            }, function(){
                //layer.msg('的确很重要', {icon: 1});
                $http.put('/admin/manual/loan/comfirmRepay',repayPlan).then(function(response) {
                    if('SUCCESS' == response.data.status){
                        layer.msg("确认成功!");
                        $window.location.href="sgLoan.html";
                    }else if('FAIL' == response.data.status){
                        layer.msg('确认失败!');
                    }
                });
            }, function(){

            });
        }

    });
}

function SgLoanController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    layui.use(['layer','form'], function() {
        var $ = layui.jquery,
            layer = layui.layer,
            form = layui.form();


        //借款验证
        // $('#verify-loan').on('click', function() {
        $scope.verifyLoan = function () {
            layer.open({
                title: '企业校验',
                type: 1,
                content: $("#verify-loan-layer"),
                area: ['560px', '260px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $window.location.reload();
                }
            });
            form.on('submit(verify-loan)', function(data){
                var data = JSON.stringify(data.field);
                $.ajax({
                    type : 'POST',
                    headers: {'Content-type': 'application/json;charset=UTF-8'},
                    url : 'manual/loan/verify',
                    data : data,
                    success : function (res) {
                        if('SUCCESS' == res.status){
                            layer.closeAll();
                            $window.location.href="sgLoan.html#!/sgloan/add/"+res.loanId+"/"+res.id;
                        }else if('FAIL' == res.status){
                            layer.msg('企业不存在!');
                            //$window.location.href="sgUser.html#!/manual/consumer/add";
                        }else if('NOOVER' == res.status){
                            layer.msg('清先还清借款!!!');
                            //$window.location.href="sgLoan.html";
                        }
                    }
                });
            });
            form.render();
        };

        form.render();

        /**
         * 生成链接
         * @param loan
         */
        $scope.line = function (loan) {
            //$scope.flag = true;
            $http.get('/admin/manual/loan/line?id='+loan.id).then(function(response) {
                $scope.msg = response.data.con;
                if(loan.consumer.structure == 0){
                    layer.open({
                        title: '<span style="font-size:8px">'+loan.consumer.company+'</span>',
                        type: 1,
                        content: $("#sign-link-layer"),
                        area: ['300px', '350px'],
                        shade: 0.3,
                        btnAlign: 'c',
                        shadeClose: true
                    });
                }else {
                    layer.open({
                        title: '<span style="font-size:8px">'+loan.consumer.name+'</span>',
                        type: 1,
                        content: $("#sign-link-layer"),
                        area: ['300px', '350px'],
                        shade: 0.3,
                        btnAlign: 'c',
                        shadeClose: true
                    });
                }

            });
        };

        $scope.confirm = function (loan) {

            $scope.applyAmount = loan.applyAmount;
            $scope.loanAccount = loan.loanAccount;
            $scope.loanAccountNo = loan.loanAccountNo;
            $scope.loanBranch = loan.loanBranch;

            layer.open({
                title: '确认放款',
                type: 1,
                content: $("#confirm-loan-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                btnAlign: 'r',
                btn: ['确认放款', '取消'],
                yes: function(index, layero){
                    $http.put('/admin/manual/loan/editStatus',loan).then(function(response) {
                        if(response.data.code == 1){
                            layer.msg(response.data.msg);
                            return;
                        }
                        if('SUCCESS' == response.data.status){
                            layer.msg("放款成功!");
                            $window.location.reload();
                        }else if('FAIL' == response.data.status){
                            layer.msg('放款失败!');
                        }
                    });
                },
                btn2: function(index, layero){
                    layer.closeAll();
                }

            });
        };



    });

    var size = 10;
    $scope.refresh=function(page){
        $http.get('/admin/manual/loan/list?page='+page+'&size='+size).then(function (response) {
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



    /**
     * 借款驳回
     * @param loan
     */
    $scope.no = function (loan) {
        $http.get('/admin/manual/loan/no',{params:{id:loan.id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg("借款已驳回!");
                $window.location.reload();
            }else if('FAIL' == response.data.status){
                layer.msg('操作失败!');

            }
        });
    };
    /**
     * 链接失效
     * @param loan
     */
    $scope.invalid = function (loan) {
        $http.get('/admin/manual/loan/invalid',{params:{id:loan.id}}).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg("链接已失效请重新生成链接!");
                //$window.location.reload();
            }else if('FAIL' == response.data.status){
                layer.msg('操作失败!');

            }

        });
    };



}



function AddController($route,$scope,$http,$routeParams,$location,$filter,$window,$compile) {

    $scope.callback = function () {
        $window.location.href="sgLoan.html#!/sgloan/"+$routeParams.page;
    };

    //获取url中loanId
    var temp = $location.url().substring(0,$location.url().lastIndexOf("/"));
    var loanId = temp.substring(temp.lastIndexOf("/")+1);
    //获取url中consumerId
    var id = $location.url().substring($location.url().lastIndexOf("/")+1);

    //获取所属省份
    $http.get('/admin/manual/loan/citys').then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.citys = response.data.data;
    });

    $http.get('/admin/manual/consumer/desc',{params:{id:id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.consumer = response.data.consumer;
        $scope.productScheme = response.data.productScheme;
    });

    //个人负债
    var personArray;
    //企业负债
    var companyArray;
    layui.use('element', function(){
        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            //layer = layui.layer,
            element = layui.element;

        $('#add-personDebtVo').on('click', function() {
            layer.open({
                title: '新增个人负债',
                type: 1,
                content: $("#person-debt-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });

            $scope.personStatus = true;
            //添加个人负债
            $scope.addPersonDebt = function (personDebt,isValidate) {

                if(isValidate){
                    layer.msg("还有必填信息未输入!!");
                    return false;
                }

                if(personDebt.isCalculation){
                    personDebt.isCalculation = 1;
                }else{
                    personDebt.isCalculation = 0;
                }

                if(personDebt.isOperLoan){
                    personDebt.isOperLoan = 1;
                }else{
                    personDebt.isOperLoan = 0;
                }

                $scope.data = {"personDebt":JSON.stringify(personDebt),"loanId":loanId};

                $http.post('/admin/personDebt/add',$scope.data).then(function (response){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.personDebt={};
                    if('SUCCESS' == response.data.status){
                        $http.get('/admin/personDebt/list?loanId='+loanId).then(function (response){
                            $scope.personDebtList = response.data.personDebtList;
                            personArray = response.data.personDebtList;
                            if ($scope.personDebtList.size() != 0) {
                                $scope.personStatus = false;
                            }
                        });
                        layer.msg("创建成功!");
                        layer.closeAll();
                    }else if('FAIL' == response.data.status){
                        layer.msg("创建借款失败!");
                    }
                });
            };
        });



        //添加企业负债
        $('#add-company-loan').on('click', function() {
            layer.open({
                title: '新增企业负债',
                type: 1,
                content: $("#company-debt-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });

            $scope.companyStatus = true;

            $scope.addCompanyDebt = function (companyDebt, isValidate) {

                if(isValidate){
                    layer.msg("还有必填信息未输入!!");
                    return false;
                }

                if (companyDebt.isCalculation) {
                    companyDebt.isCalculation = 1;
                } else {
                    companyDebt.isCalculation = 0;
                }

                if(companyDebt.isOperLoan){
                    companyDebt.isOperLoan = 1;
                }else{
                    companyDebt.isOperLoan = 0;
                }

                $scope.data = {"companyDebt": JSON.stringify(companyDebt), "loanId": loanId};

                $http.post('/admin/companyDebt/add', $scope.data).then(function (response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.companyDebt={};
                    if ('SUCCESS' == response.data.status) {
                        $http.get('/admin/companyDebt/list?loanId=' + loanId).then(function (response) {
                            $scope.companyDebtList = response.data.companyDebtList;
                            companyArray =response.data.companyDebtList;
                            if ($scope.companyDebtList.size() != 0) {
                                $scope.companyStatus = false;
                            }
                        });
                        layer.closeAll();
                    } else if ('FAIL' == response.data.status) {
                        layer.msg("创建借款失败!");
                    }
                });
            };

        });

        layui.use('laydate', function(){

            var laydate = layui.laydate;

            laydate.render({
                elem: '#personCreditDate',
                format : 'yyyy-MM-dd'
            });

            laydate.render({
                elem: '#firstCreditDate',
                format : 'yyyy-MM-dd'
            });

            laydate.render({
                elem: '#companyCreditDate',
                format : 'yyyy-MM-dd'
            });
        });

        $scope.billfileStatus = false;
        $scope.bankfileStatus = false;

        $scope.billFileName='';
        $scope.bankFileName='';

        var billPath = '';
        var bankPath = '';




        layui.use(['layer','form'], function() {
            var form = layui.jquery,
                layer = layui.layer,
                form = layui.form();

            var guaranteeId ;
            $scope.search = function(url,id,hiddenId) {
                $("#id").val('');
                var availableTags = [];
                $('#' + id).autocomplete({
                    autoFill: true,
                    mustMatch: true,
                    source: availableTags,
                    select: function (event, ui) {
                        guaranteeId = $("#" + hiddenId).val(ui.item.id);
                        ui.item.value = ui.item.label;
                    }
                });
                var str = $('#' + id).val();
                $.ajax({
                    url: '/admin/guarantee/search',
                    dataType: 'json',
                    data: {"name": str},
                    success: function (response) {
                        var list = response;
                        $.each(list, function (key, data) {
                            //console.log(data);
                            availableTags.push({id: data.id, label: data.name, value: data.name});
                        });
                    }
                });
            };
        });



        var html = '<div ng-repeat="guarantee in guarantees">'+
            '<blockquote class="layui-elem-quote layui-quote-nm" id="blockquote_{{guarantee.id}}">'+
            '    <a class="delete" ng-click="del(guarantee)"><i class="layui-icon">&#xe640;</i></a>'+
            '    <div class="layui-form-item">'+
            '        <label class="layui-form-label">担保方类型 ：</label>'+
            '        <div class="layui-input-block">'+
            '            <p ng-if="guarantee.type==0">企业</p>'+
            '            <p ng-if="guarantee.type==1">个人</p>'+
            '        </div>'+
            '    </div>'+
            '    <div class="layui-form-item" ng-show="guarantee.type==0">'+
            '        <label class="layui-form-label">企业名称：：</label>'+
            '        <div class="layui-input-block">'+
            '            <p>{{guarantee.name}}</p>'+
            '        </div>'+
            '    </div>'+
            '    <div class="layui-form-item" ng-show="guarantee.type==0">'+
            '        <label class="layui-form-label">营业执照号：</label>'+
            '        <div class="layui-input-block">'+
            '            <p>{{guarantee.businessLicense}}</p>'+
            '        </div>'+
            '    </div>'+
            '    <div class="layui-form-item">'+
            '        <label class="layui-form-label">个人名称：</label>'+
            '        <div class="layui-input-block">'+
            '            <p>{{guarantee.corName}}</p>'+
            '        </div>'+
            '    </div>'+
            '    <div class="layui-form-item">'+
            '        <label class="layui-form-label">身份证号：</label>'+
            '        <div class="layui-input-block">'+
            '            <p>{{guarantee.ipNo}}</p>'+
            '        </div>'+
            '    </div>'+
            '    <div class="layui-form-item">'+
            '        <label class="layui-form-label">手机号：</label>'+
            '        <div class="layui-input-block">'+
            '            <p>{{guarantee.phone}}</p>'+
            '        </div>'+
            '    </div>'+
            '</blockquote>'+
            '</div>';
        $scope.count = 0;
        $scope.guarantees = new Array();
        $scope.save = function(){
            var id = $("#guaranteeId").val();
            if(id == ''){
                layer.msg("未找到该担保方，请重新输入");
                return false;
            } else if(id == undefined){
                layer.msg("未找到该担保方，请重新输入");
                return false;
            }
            if(id!='' && id != undefined && $scope.count < 5){
                $('#show_this').html('');
                $http.get('/admin/guarantee/desc',{params:{id:id}}).then(function(response) {

                    $scope.guarantees.push(response.data.data.guarantee);
                    var template = angular.element(html);
                    var mobileDialogElement = $compile(template)($scope);
                    angular.element($("#show_this")).append(mobileDialogElement);
                    $("#guaranteeName").val('');
                    $("#guaranteeId").val('');
                });
                $scope.count++;
            }else{
                layer.msg("担保人数量不大于5");
                return false;
            }
        };

        $scope.del = function(guarantee){
            var obj = $('#show_this');
            obj.html('');
            $scope.guarantees.splice($.inArray(guarantee, $scope.guarantees), 1);
            var template = angular.element(html);
            var mobileDialogElement = $compile(template)($scope);
            angular.element(obj).append(mobileDialogElement);
            $scope.count--;
        };

    });

//上传
    $scope.submit = function (flag,person,companyIncomeVo) {


        if(flag){
            var fd = new FormData();
            var files = document.querySelector('input[name="billFile"]').files;
            for (var i=0; i<files.length; i++) {
                fd.append("billFile", files[i]);
            }
            fd.append("loanId",loanId);

            $http({
                method:'POST',
                url:"/admin/upload/uploadBillFile",
                data: fd,
                headers: {'Content-Type':undefined}
            })
                .then( function ( response ){
                    //上传成功的操作
                    if(response.data.status == 'SUCCESS'){
                        $scope.billFileName= response.data.fileName;
                        billPath = response.data.billPath;
                        $scope.billfileStatus = true;
                        layer.msg("上传成功");
                    }else if(response.data.status == 'FAIL'){
                        $scope.billFileName= '';
                        $scope.billfileStatus = false;
                        layer.msg("上传失败");
                    }else{
                        $scope.billFileName= '';
                        $scope.billfileStatus = false;
                        layer.msg("上传格式不正确");
                    }

                });
        }else{
            var fd = new FormData();
            var files = document.querySelector('input[name="bankFile"]').files;
            for (var i=0; i<files.length; i++) {
                fd.append("bankFile", files[i]);
            }
            fd.append("loanId",loanId);
            $http({
                method:'POST',
                url:"/admin/upload/uploadBankFile",
                data: fd,
                headers: {'Content-Type':undefined}
            })
                .then( function ( response ){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    //上传成功的操作
                    if(response.data.status == 'SUCCESS'){
                        $scope.bankFileName= response.data.fileName;
                        bankPath = response.data.bankPath;
                        $scope.bankfileStatus = true;
                        layer.msg("上传成功");
                    }else if(response.data.status == 'FAIL'){
                        $scope.bankFileName= '';
                        $scope.bankfileStatus = false;
                        layer.msg("上传失败");
                    }else{
                        $scope.bankFileName= '';
                        $scope.bankfileStatus = false;
                        layer.msg("上传格式不正确");
                    }
                });
        }

    };


    $scope.detPersonDebt = function (p) {
        $http.post('/admin/personDebt/del',JSON.stringify(p)).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if(response.data.status == 'SCCUESS'){
                layer.msg("删除成功");
                $http.get('/admin/personDebt/list?loanId='+loanId).then(function (response){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.personDebtList = response.data.personDebtList;
                    personArray = response.data.personDebtList;
                    if ($scope.personDebtList.size() != 0) {
                        $scope.personStatus = false;
                    }
                });
            }else{
                layer.msg("删除失败");
            }
        });
    };

    $scope.detCompanyDebt = function (c) {
        $http.post('/admin/companyDebt/del',JSON.stringify(c)).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if(response.data.status == 'SCCUESS'){
                layer.msg("删除成功");
                $http.get('/admin/companyDebt/list?loanId=' + loanId).then(function (response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.companyDebtList = response.data.companyDebtList;
                    companyArray =response.data.companyDebtList;
                    if ($scope.companyDebtList.size() != 0) {
                        $scope.companyStatus = false;
                    }
                });
            }else{
                layer.msg("删除失败");
            }
        });
    };


    var number = 0;
    $scope.addLoan = function (loan,person,personDebtVo,companyDebtVo,companyIncomeVo,isValidate) {

        if(!/^1[34578]\d{9}$/.test(person.perPhone)){
            layer.msg("借款人电话号格式不正确!!!");
            return false;
        }

        if(!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(person.perNo)){
            layer.msg("借款人身份证格式不正确!!!");
            return false;
        }

        layui.use('layer', function() {
            var $ = layui.jquery,
                layer = layui.layer;
        });

            if(number > 0){
                layer.msg("不要重复提交!!");
                return false;
            }
            var date1 = $("#personCreditDate").val();
            if(date1 == " "){
                layer.msg("个人征信日期不能为空");
                return false;
            }
            var date2 = $("#firstCreditDate").val();
            if(date2 == " "){
                layer.msg("最早一笔个人征信时间");
                return false;
            }

            if($scope.productScheme.no == 'JYSW'){

            }else{
                if(loan.applyAmount > 500000){
                    layer.msg("申请金额在50000-500000内!!");
                    return false;
                }else if(loan.applyAmount < 50000){
                    layer.msg("申请金额在50000-500000内!!");
                    return false;
                }
            }

            if(isValidate){
                layer.msg("还有必填信息未输入!!");
                return false;
            }

            if(billPath == ''&& bankPath == ''){
                layer.msg("请上传开票文档和银行流水!");
                return false;
            }

            Date.prototype.Format = function (fmt) { //author: meizz
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            };

            var data = new FormData();
            var companyCreditDate = $("#companyCreditDate").val();
            if(companyCreditDate == ' '){
                var date = new Date().Format("yyyy-MM-dd");
                data.append("companyCreditDate",date);
            }else{
                data.append("companyCreditDate",companyCreditDate);
            }
            var personCreditDate = $("#personCreditDate").val();
            var firstCreditDate = $("#firstCreditDate").val();


            data.append("loanId",loanId);
            data.append("consumerId",id);
            data.append("loan",JSON.stringify(loan));
            data.append("person",JSON.stringify(person));
            data.append("personDebtVo",JSON.stringify(personDebtVo));
            data.append("companyDebtVo",JSON.stringify(companyDebtVo));
            data.append("companyArray",JSON.stringify(companyArray));
            data.append("personArray",JSON.stringify(personArray));
            data.append("firstCreditDate",firstCreditDate);
            data.append("personCreditDate",personCreditDate);
            data.append("billPath",billPath);
            data.append("bankPath",bankPath);
            data.append("guarantees",JSON.stringify($scope.guarantees));
            //--------------------------------------------------------------
            data.append("companyName",$scope.consumer.company);
            data.append("loanName",person.perName);
            data.append("flag","0");
            data.append("oneYearsAgoSale",companyIncomeVo.oneYearsAgoSale);
            data.append("twoYearsAgoSale",companyIncomeVo.twoYearsAgoSale);
            data.append("threeYearsAgoSale",companyIncomeVo.threeYearsAgoSale);

            $http({
                method:'POST',
                url:"/admin/manual/loan/test",
                data: data,
                headers: {'Content-Type':undefined}
            }).then(function (response){
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if(response.data.status == 'SUCCESS'){
                    layer.msg("创建成功!");
                    $window.location.href="sgLoan.html";
                }else if(response.data.billstatus == 'BILL_ANALYSIS_ERROR'){
                    layer.msg("开票解析失败!");
                    $window.location.href="sgLoan.html";
                }else if(response.data.bankstatus == 'BANK_ANALYSIS_ERROR'){
                    layer.msg("流水解析失败!");
                    $window.location.href="sgLoan.html";
                }
            });

    };


}

/**
 * 还款跟踪做跳转的
 *
 */
function DescTrackController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    // $scope.callback = function () {
    //     $window.location.href="sgLoan.html#!/sgloan/"+$routeParams.page;
    // };

    $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.loan = response.data.loan; //借款
        $scope.person = response.data.person; //借款人
        $scope.cor = response.data.cor; //法人
        $scope.personDebts = response.data.personDebts; //个人负债列表
        $scope.companyDebts = response.data.companyDebts; //企业负债列表
        $scope.personDebtVo = response.data.personDebtVo; //个人负债vo
        $scope.companyDebtVo = response.data.companyDebtVo; //企业负债vo
        $scope.info = response.data.otherInfo;
        $scope.riskVo = response.data.riskVo; //风控vo
        $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
        $scope.commodityInfos = response.data.commodityInfos;//商品
        $scope.monthSales = response.data.monthSales;//月均销售
        $scope.bankStreams = response.data.bankStreams;//银行流水
        $scope.companyIncomeVo = response.data.companyIncomeVo; //企业收入
        $scope.guaranteeList = response.data.guaranteeList; //担保人列表
        //$scope.guarantee = response.data.guarantee;
        $scope.project = response.data.project; //项目列表
        $scope.logList = response.data.logList; //日志列表
        $scope.lists = response.data.lists; //还款计划
        $scope.voList = response.data.voList; //文件路劲
        $scope.images = response.data.images; //face++图片
        $scope.basePath = response.data.basePath;
    });

    layui.use(['element','layer'], function() {
        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            layer = layui.layer,
            element = layui.element;

        $scope.changePic=function($event){
            var img=$event.srcElement || $event.target;
            angular.element("#bigimage")[0].src=img.src;
            angular.element("#js-imgview")[0].style.display="block";
            angular.element("#js-imgview-mask")[0].style.display="block";
        };
        //点击图片时放小显示图片
        $scope.closePic =function(){
            angular.element("#js-imgview")[0].style.display="none";
            angular.element("#js-imgview-mask")[0].style.display="none";

        };

        $scope.changeFace=function($event){
            var img=$event.srcElement || $event.target;
            angular.element("#bigimage-face")[0].src=img.src;
            angular.element("#js-imgview-face")[0].style.display="block";
            angular.element("#js-imgview-mask-face")[0].style.display="block";
        };
        //点击图片时放小显示图片
        $scope.closeFace =function(){
            angular.element("#js-imgview-face")[0].style.display="none";
            angular.element("#js-imgview-mask-face")[0].style.display="none";

        };

        /**
         * 查看FaceImages图片
         * @param loanId
         * @param fileName
         */
        $scope.selFaceImage = function (loanId, fileName) {
            console.log("###"+$scope.basePath);
            $scope.facePath = $scope.basePath+"/manual/loan/getFaceImages?loanId="+loanId+"&fileName="+fileName;
            layer.open({
                title: '查看图片',
                type: 1,
                content: $("#see-face-layer"),
                area: ['530px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    angular.element("#js-imgview-face")[0].style.display="none";
                    angular.element("#js-imgview-mask-face")[0].style.display="none";
                    layer.closeAll();
                }
            });
        };

        $scope.selectPic = function (loanId,id) {
            $http.get('/admin/track/selPic?loanId='+loanId+'&repayId='+id).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                $scope.pics = response.data.data.pics;
                $scope.url = response.data.data.url;
            });

            layer.open({
                title: '查看截图',
                type: 1,
                content: $("#see-payments-layer"),
                area: ['730px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    angular.element("#js-imgview")[0].style.display="none";
                    angular.element("#js-imgview-mask")[0].style.display="none";
                    layer.closeAll();
                    //$window.location.reload();
                }
            });
        };
        var datas = {};
        $scope.del = function (loanId,repayId,id) {
            var data = new FormData();
            data.append("id",id);

            $http({
                method:'POST',
                url:"/admin/track/del",
                data: data,
                headers: {'Content-Type':undefined}
            }).then(function (response){
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if(response.data.code == 0){
                    layer.msg("删除成功");
                    $http.get('/admin/track/selPic?loanId='+loanId+'&repayId='+repayId).then(function (response) {
                        $scope.picss = datas = response.data.data.pics;
                        $scope.url = response.data.data.url;
                    });
                }else{
                    layer.msg("删除失败");
                }
            });
        };

        $scope.upload = function (loanId,loanNum,id) {

            $http.get('/admin/track/selPic?loanId='+loanId+'&repayId='+id).then(function (response) {
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                $scope.picss = datas = response.data.data.pics;
            });

            layer.open({
                title: '上传截图',
                type: 1,
                content: $("#upload-payments-layer"),
                area: ['630px', '360px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    $window.location.reload();
                    layer.closeAll();
                }
            });

            $scope.filename = "";
            $scope.uploadFile = function () {
                var file = document.querySelector('input[type=file]').files[0];
                $scope.filename = file.name;

                angular.forEach(datas,function (value,index) {
                    if(value.picPath == file.name){
                        layer.msg("文件名重复,请重新上传");
                        $scope.filename ='';
                        return false;
                    }
                });
                $scope.$apply();
            };

            $scope.add = function () {
                var file = document.querySelector('input[type=file]').files[0];

                if(file == undefined){
                    layer.msg("文件不能为空");
                    return false;
                }

                //文件,借款id,当前期数,还款计划id
                var fd = new FormData();
                fd.append('file',file);
                fd.append('loanId',loanId);
                fd.append("loanNum",loanNum);
                fd.append('id',id);

                $http({
                    method :'POST',
                    url : '/admin/track/uploadAdd',
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
                        $window.location.reload();
                    }else if(code == 1){
                        layer.msg("保存失败");
                        return false;
                    }
                },function (response) {//失败
                    layer.msg("上传失败");
                    console.log(response.data);
                });
            }
        };
    });

}

function DescController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    $scope.callback = function () {
        $window.location.href="sgLoan.html#!/sgloan/"+$routeParams.page;
    };

    $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.loan = response.data.loan; //借款
        $scope.person = response.data.person; //借款人
        $scope.cor = response.data.cor; //法人
        $scope.personDebts = response.data.personDebts; //个人负债列表
        $scope.companyDebts = response.data.companyDebts; //企业负债列表
        $scope.personDebtVo = response.data.personDebtVo; //个人负债vo
        $scope.companyDebtVo = response.data.companyDebtVo; //企业负债vo
        $scope.info = response.data.otherInfo;
        $scope.riskVo = response.data.riskVo; //风控vo
        $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
        $scope.commodityInfos = response.data.commodityInfos;//商品
        $scope.monthSales = response.data.monthSales;//月均销售
        $scope.bankStreams = response.data.bankStreams;//银行流水
        $scope.companyIncomeVo = response.data.companyIncomeVo; //企业收入
        $scope.guaranteeList = response.data.guaranteeList; //担保人列表
        //$scope.guarantee = response.data.guarantee;
        $scope.project = response.data.project; //项目列表
        $scope.logList = response.data.logList; //日志列表
        $scope.lists = response.data.lists; //还款计划
        $scope.voList = response.data.voList; //文件路劲
        $scope.images = response.data.images; //face++图片
        $scope.basePath = response.data.basePath;
    });

    layui.use(['element','layer'], function() {
        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            layer = layui.layer,
            element = layui.element;

        $scope.changePic=function($event){
            var img=$event.srcElement || $event.target;
            angular.element("#bigimage")[0].src=img.src;
            angular.element("#js-imgview")[0].style.display="block";
            angular.element("#js-imgview-mask")[0].style.display="block";
        };
        //点击图片时放小显示图片
        $scope.closePic =function(){
            angular.element("#js-imgview")[0].style.display="none";
            angular.element("#js-imgview-mask")[0].style.display="none";

        };

        $scope.changeFace=function($event){
            var img=$event.srcElement || $event.target;
            angular.element("#bigimage-face")[0].src=img.src;
            angular.element("#js-imgview-face")[0].style.display="block";
            angular.element("#js-imgview-mask-face")[0].style.display="block";
        };
        //点击图片时放小显示图片
        $scope.closeFace =function(){
            angular.element("#js-imgview-face")[0].style.display="none";
            angular.element("#js-imgview-mask-face")[0].style.display="none";

        };

        /**
         * 查看FaceImages图片
         * @param loanId
         * @param fileName
         */
        $scope.selFaceImage = function (loanId, fileName) {
            console.log("###"+$scope.basePath);
            $scope.facePath = $scope.basePath+"/manual/loan/getFaceImages?loanId="+loanId+"&fileName="+fileName;
            layer.open({
                title: '查看图片',
                type: 1,
                content: $("#see-face-layer"),
                area: ['530px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true,
                end:function () {
                    angular.element("#js-imgview-face")[0].style.display="none";
                    angular.element("#js-imgview-mask-face")[0].style.display="none";
                    layer.closeAll();
                }
            });
        };

        $scope.selectPic = function (loanId,id) {
                $http.get('/admin/track/selPic?loanId='+loanId+'&repayId='+id).then(function (response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.pics = response.data.data.pics;
                    $scope.url = response.data.data.url;
                });

                layer.open({
                    title: '查看截图',
                    type: 1,
                    content: $("#see-payments-layer"),
                    area: ['730px', '460px'],
                    shade: 0.3,
                    btnAlign: 'c',
                    shadeClose: true,
                    end:function () {
                        angular.element("#js-imgview")[0].style.display="none";
                        angular.element("#js-imgview-mask")[0].style.display="none";
                        layer.closeAll();
                        //$window.location.reload();
                    }
                });
            };
            var datas = {};
            $scope.del = function (loanId,repayId,id) {
                var data = new FormData();
                data.append("id",id);

                $http({
                    method:'POST',
                    url:"/admin/track/del",
                    data: data,
                    headers: {'Content-Type':undefined}
                }).then(function (response){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    if(response.data.code == 0){
                        layer.msg("删除成功");
                        $http.get('/admin/track/selPic?loanId='+loanId+'&repayId='+repayId).then(function (response) {
                            $scope.picss = datas = response.data.data.pics;
                            $scope.url = response.data.data.url;
                        });
                    }else{
                        layer.msg("删除失败");
                    }
                });
            };

            $scope.upload = function (loanId,loanNum,id) {

                $http.get('/admin/track/selPic?loanId='+loanId+'&repayId='+id).then(function (response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.picss = datas = response.data.data.pics;
                });

                layer.open({
                    title: '上传截图',
                    type: 1,
                    content: $("#upload-payments-layer"),
                    area: ['630px', '360px'],
                    shade: 0.3,
                    btnAlign: 'c',
                    shadeClose: true,
                    end:function () {
                        $window.location.reload();
                        layer.closeAll();
                    }
                });

                $scope.filename = "";
                $scope.uploadFile = function () {
                    var file = document.querySelector('input[type=file]').files[0];
                    $scope.filename = file.name;

                    angular.forEach(datas,function (value,index) {
                        if(value.picPath == file.name){
                            layer.msg("文件名重复,请重新上传");
                            $scope.filename ='';
                            return false;
                        }
                    });
                    $scope.$apply();
                };

                $scope.add = function () {
                    var file = document.querySelector('input[type=file]').files[0];

                    if(file == undefined){
                        layer.msg("文件不能为空");
                        return false;
                    }

                    //文件,借款id,当前期数,还款计划id
                    var fd = new FormData();
                    fd.append('file',file);
                    fd.append('loanId',loanId);
                    fd.append("loanNum",loanNum);
                    fd.append('id',id);

                    $http({
                        method :'POST',
                        url : '/admin/track/uploadAdd',
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
                            $window.location.reload();
                        }else if(code == 1){
                            layer.msg("保存失败");
                            return false;
                        }
                    },function (response) {//失败
                        layer.msg("上传失败");
                        console.log(response.data);
                    });
                }
            };
    });

}

function EditController($route,$scope,$http,$routeParams,$location,$filter,$window,$compile) {

    $scope.callback = function () {
        $window.location.href="sgLoan.html#!/sgloan/"+$routeParams.page;
    };

    var billPath = '';
    var bankPath = '';


    $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.loan = response.data.loan; //借款
        $scope.person = response.data.person; //借款人
        $scope.cor = response.data.cor; //法人
        $scope.personDebtList= $scope.personDebts = response.data.personDebts; //个人负债列表
        $scope.companyDebtList = $scope.companyDebts = response.data.companyDebts; //企业负债列表
        $scope.personDebtVo = response.data.personDebtVo; //个人负债vo
        $scope.companyDebtVo = response.data.companyDebtVo; //企业负债vo
        $scope.riskVo = response.data.riskVo; //风控vo
        $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
        $scope.commodityInfos = response.data.commodityInfos;//商品
        $scope.monthSales = response.data.monthSales;//月均销售
        $scope.bankStreams = response.data.bankStreams;//银行流水
        $scope.companyIncomeVo = response.data.companyIncomeVo; //企业收入
        console.log("补录的企业收入"+JSON.stringify($scope.companyIncomeVo));
        $scope.guaranteeList = response.data.guaranteeList; //担保人列表
        //$scope.guarantee = response.data.guarantee;
        $scope.project = response.data.project; //项目列表
        $scope.productScheme = response.data.productScheme;
        $scope.logList = response.data.logList; //日志列表
        $scope.lists = response.data.lists; //还款计划
        $scope.voList = response.data.voList; //文件路劲

        billPath = $scope.companyIncomeVo.billDocPath;
        bankPath = $scope.companyIncomeVo.bankStatementPath;
        $scope.billFileName=$scope.companyIncomeVo.billDocPath.substr($scope.companyIncomeVo.billDocPath.lastIndexOf('/')+1);
        $scope.bankFileName=$scope.companyIncomeVo.bankStatementPath.substr($scope.companyIncomeVo.bankStatementPath.lastIndexOf('/')+1);
    });



    //个人负债
    var personArray;
    //企业负债
    var companyArray;
    layui.use('element', function(){
        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            layer = layui.layer,
            element = layui.element;

        $('#add-personDebtVo').on('click', function(){
            layer.open({
                title: '新增个人负债',
                type: 1,
                content: $("#person-debt-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });

            $scope.personStatus = true;
            //添加个人负债
            $scope.addPersonDebt = function (personDebt,isValidate) {

                if(isValidate){
                    layer.msg("还有必填信息未输入!!");
                    return false;
                }

                if(personDebt.isCalculation){
                    personDebt.isCalculation = 1;
                }else{
                    personDebt.isCalculation = 0;
                }

                if(personDebt.isOperLoan){
                    personDebt.isOperLoan = 1;
                }else{
                    personDebt.isOperLoan = 0;
                }

                $scope.data = {"personDebt":JSON.stringify(personDebt),"loanId":$routeParams.id};

                $http.post('/admin/personDebt/add',$scope.data).then(function (response){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.personDebt={};
                    if('SUCCESS' == response.data.status){
                        $http.get('/admin/personDebt/list?loanId='+$routeParams.id).then(function (response){
                            if(response.data.code == 1){
                                layer.msg(response.data.msg);
                                return;
                            }
                            $scope.personDebtList = response.data.personDebtList;
                            personArray = response.data.personDebtList;
                            if ($scope.personDebtList.size() != 0) {
                                $scope.personStatus = false;
                            }
                        });
                        layer.msg("创建成功!");
                        layer.closeAll();
                    }else if('FAIL' == response.data.status){
                        layer.msg("创建借款失败!");
                    }
                });
            };
        });



        //添加企业负债
        $('#add-company-loan').on('click', function() {
            layer.open({
                title: '新增企业负债',
                type: 1,
                content: $("#company-debt-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });

            $scope.companyStatus = true;

            $scope.addCompanyDebt = function (companyDebt, isValidate) {

                if(isValidate){
                    layer.msg("还有必填信息未输入!!");
                    return false;
                }

                if (companyDebt.isCalculation) {
                    companyDebt.isCalculation = 1;
                } else {
                    companyDebt.isCalculation = 0;
                }

                if(companyDebt.isOperLoan){
                    companyDebt.isOperLoan = 1;
                }else{
                    companyDebt.isOperLoan = 0;
                }

                $scope.data = {"companyDebt": JSON.stringify(companyDebt), "loanId": $routeParams.id};

                $http.post('/admin/companyDebt/add', $scope.data).then(function (response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.companyDebt={};
                    if ('SUCCESS' == response.data.status) {
                        $http.get('/admin/companyDebt/list?loanId=' + $routeParams.id).then(function (response) {
                            if(response.data.code == 1){
                                layer.msg(response.data.msg);
                                return;
                            }
                            $scope.companyDebtList = response.data.companyDebtList;
                            companyArray =response.data.companyDebtList;
                            if ($scope.companyDebtList.size() != 0) {
                                $scope.companyStatus = false;
                            }
                        });
                        layer.closeAll();
                    } else if ('FAIL' == response.data.status) {
                        layer.msg("创建借款失败!");
                    }
                });
            };

        });




    layui.use('laydate', function(){

        var laydate = layui.laydate;

        laydate.render({
            elem: '#personCreditDate',
            format : 'yyyy-MM-dd'
        });

        laydate.render({
            elem: '#firstCreditDate',
            format : 'yyyy-MM-dd'
        });

        laydate.render({
            elem: '#companyCreditDate',
            format : 'yyyy-MM-dd'
        });
    });

    $scope.billfileStatus = false;
    $scope.bankfileStatus = false;




    //上传
    $scope.submit = function (flag,person) {

            if(flag){
                var fd = new FormData();
                var files = document.querySelector('input[name="billFile"]').files;
                for (var i=0; i<files.length; i++) {
                    fd.append("billFile", files[i]);
                }
                fd.append("loanId",$routeParams.id);
                $http({
                    method:'POST',
                    url:"/admin/upload/uploadBillFile",
                    data: fd,
                    headers: {'Content-Type':undefined}
                })
                    .then( function ( response ){
                        if(response.data.code == 1){
                            layer.msg(response.data.msg);
                            return;
                        }
                        //上传成功的操作
                        if(response.data.status == 'SUCCESS'){
                            $scope.billFileName= response.data.fileName;
                            billPath = response.data.billPath;
                            $scope.billfileStatus = true;
                            layer.msg("上传成功");
                        }else if(response.data.status == 'FAIL'){
                            $scope.billFileName= '';
                            $scope.billfileStatus = false;
                            layer.msg("上传失败");
                        }else{
                            $scope.billFileName= '';
                            $scope.billfileStatus = false;
                            layer.msg("上传格式不正确");
                        }

                    });
            }else{
                var fd = new FormData();
                var files = document.querySelector('input[name="bankFile"]').files;
                for (var i=0; i<files.length; i++) {
                    fd.append("bankFile", files[i]);
                }
                fd.append("loanId",$routeParams.id);
                $http({
                    method:'POST',
                    url:"/admin/upload/uploadBankFile",
                    data: fd,
                    headers: {'Content-Type':undefined}
                })
                    .then( function ( response ){
                        if(response.data.code == 1){
                            layer.msg(response.data.msg);
                            return;
                        }
                        //上传成功的操作
                        if(response.data.status == 'SUCCESS'){
                            $scope.bankFileName= response.data.fileName;
                            bankPath = response.data.bankPath;
                            $scope.bankfileStatus = true;
                            layer.msg("上传成功");
                        }else if(response.data.status == 'FAIL'){
                            $scope.bankFileName= '';
                            $scope.bankfileStatus = false;
                            layer.msg("上传失败");
                        }else{
                            $scope.bankFileName= '';
                            $scope.bankfileStatus = false;
                            layer.msg("上传格式不正确");
                        }
                    });
            }

    };

    layui.use(['layer','form'], function() {
        var form = layui.jquery,
            layer = layui.layer,
            form = layui.form();

        var guaranteeId ;
        $scope.search = function(url,id,hiddenId) {
            $("#id").val('');
            var availableTags = [];
            $('#' + id).autocomplete({
                autoFill: true,
                mustMatch: true,
                source: availableTags,
                select: function (event, ui) {
                    guaranteeId = $("#" + hiddenId).val(ui.item.id);
                    ui.item.value = ui.item.label;
                }
            });
            var str = $('#' + id).val();
            $.ajax({
                url: '/admin/guarantee/search',
                dataType: 'json',
                data: {"name": str},
                success: function (response) {
                    var list = response;
                    $.each(list, function (key, data) {
                        //console.log(data);
                        availableTags.push({id: data.id, label: data.name, value: data.name});
                    });
                }
            });
        };
    });


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
        $scope.count = 0;
        $scope.guarantees = new Array();

        $scope.initData = function(){
            $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {

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

        $scope.save = function(){
            var id = $("#guaranteeId").val();
            if(id == ''){
                layer.msg("未找到该担保方，请重新输入");
                return false;
            } else if(id == undefined){
                layer.msg("未找到该担保方，请重新输入");
                return false;
            }
            if(id!='' && id != undefined && $scope.count < 5){
                $('#show_this').html('');
                $http.get('/admin/guarantee/desc1',{params:{id:id}}).then(function(response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.guarantees.push(response.data.data[0]);
                    var template = angular.element(html);
                    var mobileDialogElement = $compile(template)($scope);
                    angular.element($("#show_this")).append(mobileDialogElement);
                    $("#guaranteeName").val('');
                    $("#guaranteeId").val('');
                });
                $scope.count++;
            }else{
                layer.msg("担保人数量不大于5");
                return false;
            }
        };

        $scope.del = function(g){
            var obj = $('#show_this');
            obj.html('');
            $scope.guarantees.splice($.inArray(g, $scope.guarantees), 1);
            var template = angular.element(html);
            var mobileDialogElement = $compile(template)($scope);
            angular.element(obj).append(mobileDialogElement);
            $scope.count--;
        };

    });

    $scope.detPersonDebt = function (p) {
        $http.post('/admin/personDebt/del',JSON.stringify(p)).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if(response.data.status == 'SCCUESS'){
                layer.msg("删除成功");
                $http.get('/admin/personDebt/list?loanId='+$routeParams.id).then(function (response){
                    $scope.personDebtList = response.data.personDebtList;
                    personArray = response.data.personDebtList;
                    if ($scope.personDebtList.size() != 0) {
                        $scope.personStatus = false;
                    }
                });
            }else{
                layer.msg("删除失败");
            }
        });
    };

    $scope.detCompanyDebt = function (c) {
        $http.post('/admin/companyDebt/del',JSON.stringify(c)).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if(response.data.status == 'SCCUESS'){
                layer.msg("删除成功");
                $http.get('/admin/companyDebt/list?loanId=' + $routeParams.id).then(function (response) {
                    $scope.companyDebtList = response.data.companyDebtList;
                    companyArray =response.data.companyDebtList;
                    if ($scope.companyDebtList.size() != 0) {
                        $scope.companyStatus = false;
                    }
                });
            }else{
                layer.msg("删除失败");
            }
        });
    };

    $scope.editLoan = function (loan,person,personDebtVo,companyDebtVo,companyIncomeVo,isValidate) {

        if(!/^1[34578]\d{9}$/.test(person.perPhone)){
            layer.msg("借款人电话号格式不正确!!!");
            return false;
        }

        if(!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(person.perNo)){
            layer.msg("借款人身份证格式不正确!!!");
            return false;
        }

        if(isValidate){
            layer.msg("还有必填信息未输入!!");
            return false;
        }

        if(billPath == ''&& bankPath == ''){
            layer.msg("请上传开票文档和银行流水!");
            return false;
        }

        var companyCreditDate = $("#companyCreditDate").val();
        var personCreditDate = $("#personCreditDate").val();
        var firstCreditDate = $("#firstCreditDate").val();


        if(personCreditDate == " "){
            layer.msg("个人征信日期不能为空");
            return false;
        }

        if(firstCreditDate == " "){
            layer.msg("最早一笔个人征信时间");
            return false;
        }

        // if(loan.applyAmount > 500000){
        //     layer.msg("申请金额在50000-500000内!!");
        //     return false;
        // }else if(loan.applyAmount < 50000){
        //     layer.msg("申请金额在50000-500000内!!");
        //     return false;
        // }

        if($scope.productScheme.no == 'JYSW'){

        }else{
            if(loan.applyAmount > 500000){
                layer.msg("申请金额在50000-500000内!!");
                return false;
            }else if(loan.applyAmount < 50000){
                layer.msg("申请金额在50000-500000内!!");
                return false;
            }
        }

        var data = new FormData();
        data.append("loanId",$scope.loan.id);
        data.append("consumerId",$scope.loan.consumer.id);
        data.append("loan",JSON.stringify(loan));
        data.append("person",JSON.stringify(person));
        data.append("personDebtVo",JSON.stringify(personDebtVo));
        data.append("companyDebtVo",JSON.stringify(companyDebtVo));
        data.append("companyArray",JSON.stringify(companyArray));
        data.append("personArray",JSON.stringify(personArray));
        data.append("firstCreditDate",firstCreditDate);
        data.append("personCreditDate",personCreditDate);
        data.append("companyCreditDate",companyCreditDate);
        data.append("billPath",billPath);
        data.append("bankPath",bankPath);
        data.append("guarantees",JSON.stringify($scope.guarantees));
        data.append("companyIncomeVo",JSON.stringify($scope.companyIncomeVo));
        //-------------------------------
        data.append("companyName",$scope.loan.consumer.company);
        data.append("loanName",person.perName);
        data.append("flag","1");
        data.append("oneYearsAgoSale",companyIncomeVo.oneYearsAgoSale);
        data.append("twoYearsAgoSale",companyIncomeVo.twoYearsAgoSale);
        data.append("threeYearsAgoSale",companyIncomeVo.threeYearsAgoSale);

        //

        $http({
            method:'POST',
            url:"/admin/manual/loan/abc",
            data: data,
            headers: {'Content-Type':undefined}
        }).then(function (response){
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if(response.data.status == 'SUCCESS'){
                layer.msg("修改成功!");
                $window.location.href="sgLoan.html";
            }else if(response.data.billstatus == 'BILL_ANALYSIS_ERROR'){
                layer.msg("开票解析失败!");
                $window.location.href="sgLoan.html";
            }else if(response.data.bankstatus == 'BANK_ANALYSIS_ERROR'){
                layer.msg("流水解析失败!");
                $window.location.href="sgLoan.html";
            }
        });
    };


}

function ExamineController($route,$scope,$http,$routeParams,$location,$filter,$window) {

    $scope.callback = function () {
        $window.location.href="sgLoan.html#!/sgloan/"+$routeParams.page;
    };

    //个人负债
    $scope.personArray=[];
    //企业负债
    $scope.companyArray=[];



    layui.use('element', function() {
        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            layer = layui.layer,
            element = layui.element;


    $http.get('/admin/manual/loan/queryExamineData',{params:{id:$routeParams.id}}).then(function(response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.loan = response.data.loan; //借款
        $scope.person = response.data.person; //借款人
        $scope.cor = response.data.cor; //法人
        $scope.personArray = $scope.personDebts = response.data.personDebts; //个人负债列表
        $scope.companyDebts = response.data.companyDebts; //企业负债列表
        $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
        $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
        $scope.infoModel = response.data.otherInfoModel;
        $scope.riskVo = response.data.riskVo_m; //风控vo
        $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
        $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
        $scope.commodityInfos = response.data.commodityInfos;//商品
        $scope.monthSales = response.data.monthSales;//月均销售
        $scope.bankStreams = response.data.bankStreams;//银行流水
        $scope.guaranteeList = response.data.guaranteeList; //担保人列表
        //$scope.guarantee = response.data.guarantee;
        $scope.project = response.data.project; //项目列表
        $scope.logList = response.data.logList; //日志列表
        $scope.lists = response.data.lists; //还款计划
        $scope.voList = response.data.voList; //文件路劲
    });

    $scope.selected0 = [];
        console.log("------"+$scope.selected0);
    selectedCheckbox0($scope,$scope.selected0);
    $scope.selected1 = [];
    selectedCheckbox1($scope,$scope.selected1);

    $scope.afreshCalculation = function (flag) {
        var data = new FormData();
        if(flag == 0){
            //购买方
            data.append("loanId",$scope.loan.id);
            data.append("companyName",$scope.loan.consumer.company);
            data.append("recountType",flag);
            data.append("recountList",$scope.selected0);
        }else if(flag == 1){
            //商品
            data.append("loanId",$scope.loan.id);
            data.append("companyName",$scope.loan.consumer.company);
            data.append("recountType",flag);
            data.append("recountList",$scope.selected1);
        }
        $http({
            method:'POST',
            url:"/admin/manual/loan/afreshCalculation",
            data: data,
            headers: {'Content-Type':undefined}
        }).then(function (response){
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg('重新计算成功!');
                $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
                    $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
                    $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
                    $scope.riskVo = response.data.riskVo_m; //风控vo
                    $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
                    $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
                    $scope.commodityInfos = response.data.commodityInfos;//商品
                    $scope.monthSales = response.data.monthSales;//月均销售
                    $scope.bankStreams = response.data.bankStreams;//银行流水
                });
            }else if('FAIL' == response.data.status){
                layer.msg('重新计算失败!');
            }else if('ERROR' == response.data.status){
                layer.msg('重新计算异常!');
            }
            //$window.location.reload();
        });
    };

    /* 购买方勾选 */
    function selectedCheckbox0($scope,selected0){

        var updateSelected0 = function(action,id,name){

            if(action == 'add' && selected0.indexOf(id) == -1){
                selected0.push(id);
            }
            if(action == 'remove' && selected0.indexOf(id)!=-1){
                var idx = selected0.indexOf(id);
                selected0.splice(idx,1);
            }
        };
        $scope.updateSelection0 = function($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected0(action,id,checkbox.name);
        };
        $scope.isSelected0 = function(id){
            return selected0.indexOf(id)>=0;
        }
    }
    /* 商品勾选 */
    function selectedCheckbox1($scope,selected1){

        var updateSelected = function(action,id,name){

            if(action == 'add' && selected1.indexOf(id) == -1){
                selected1.push(id);
            }
            if(action == 'remove' && selected1.indexOf(id)!=-1){
                var idx = selected1.indexOf(id);
                selected1.splice(idx,1);
            }
        };
        $scope.updateSelection = function($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id,checkbox.name);
        };
        $scope.isSelected = function(id){
            return selected1.indexOf(id)>=0;
        }
    }

    $scope.resCommit = function (loan,person,riskVo,personDebtVo) {
        var data = new FormData();
        data.append("loan",JSON.stringify(loan));
        data.append("person",JSON.stringify(person));
        data.append("riskVo",JSON.stringify(riskVo));
        data.append("personDebtVo",JSON.stringify(personDebtVo));

        $http({
            method:'POST',
            url:"/admin/manual/loan/resCommit",
            data: data,
            headers: {'Content-Type':undefined}
        }).then(function (response){
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg('风控审核通过');
                $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
                    $scope.loan = response.data.loan; //借款
                    $scope.person = response.data.person; //借款人
                    $scope.cor = response.data.cor; //法人
                    $scope.personDebts = response.data.personDebts_m; //个人负债列表
                    $scope.companyDebts = response.data.companyDebts_m; //企业负债列表
                    $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
                    $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
                    $scope.riskVo = response.data.riskVo_m; //风控vo
                    $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
                    $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
                    $scope.commodityInfos = response.data.commodityInfos;//商品
                    $scope.monthSales = response.data.monthSales;//月均销售
                    $scope.bankStreams = response.data.bankStreams;//银行流水
                    $scope.guaranteeList = response.data.guaranteeList; //担保人列表
                    //$scope.guarantee = response.data.guarantee;
                    $scope.project = response.data.project; //项目列表
                    $scope.logList = response.data.logList; //日志列表
                    $scope.lists = response.data.lists; //还款计划
                    $scope.voList = response.data.voList; //文件路劲
                });
                //$scope.reloadRoute();
            }else if('RULE_REJECT' == response.data.status){
                layer.msg('规则拒绝');
                $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
                    $scope.loan = response.data.loan; //借款
                    $scope.person = response.data.person; //借款人
                    $scope.cor = response.data.cor; //法人
                    $scope.personDebts = response.data.personDebts_m; //个人负债列表
                    $scope.companyDebts = response.data.companyDebts_m; //企业负债列表
                    $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
                    $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
                    $scope.riskVo = response.data.riskVo_m; //风控vo
                    $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
                    $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
                    $scope.commodityInfos = response.data.commodityInfos;//商品
                    $scope.monthSales = response.data.monthSales;//月均销售
                    $scope.bankStreams = response.data.bankStreams;//银行流水
                    $scope.guaranteeList = response.data.guaranteeList; //担保人列表
                    //$scope.guarantee = response.data.guarantee;
                    $scope.project = response.data.project; //项目列表
                    $scope.logList = response.data.logList; //日志列表
                    $scope.lists = response.data.lists; //还款计划
                    $scope.voList = response.data.voList; //文件路劲
                });
                //$scope.reloadRoute();
            }else if('MODEL_REJECT' == response.data.status){
                layer.msg('模型拒绝');
                $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.loan = response.data.loan; //借款
                    $scope.person = response.data.person; //借款人
                    $scope.cor = response.data.cor; //法人
                    $scope.personDebts = response.data.personDebts_m; //个人负债列表
                    $scope.companyDebts = response.data.companyDebts_m; //企业负债列表
                    $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
                    $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
                    $scope.riskVo = response.data.riskVo_m; //风控vo
                    $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
                    $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
                    $scope.commodityInfos = response.data.commodityInfos;//商品
                    $scope.monthSales = response.data.monthSales;//月均销售
                    $scope.bankStreams = response.data.bankStreams;//银行流水
                    $scope.guaranteeList = response.data.guaranteeList; //担保人列表
                    //$scope.guarantee = response.data.guarantee;
                    $scope.project = response.data.project; //项目列表
                    $scope.logList = response.data.logList; //日志列表
                    $scope.lists = response.data.lists; //还款计划
                    $scope.voList = response.data.voList; //文件路劲
                });
                //$scope.reloadRoute();
            }
        });
    };

        $scope.detPersonDebt = function (p,index) {
            var data = new FormData();
            data.append("personDebt",JSON.stringify(p));
            data.append("index",index);
            $http({
                method:'POST',
                url:"/admin/personDebt/tempDel",
                data: data,
                headers: {'Content-Type':undefined}
            }).then(function (response){
                if(response.data.code == 1){
                    layer.msg(response.data.msg);
                    return;
                }
                if(response.data.status == 'SCCUESS'){
                    layer.msg("删除成功");
                    $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
                        $scope.loan = response.data.loan; //借款
                        $scope.person = response.data.person; //借款人
                        $scope.cor = response.data.cor; //法人
                        $scope.personDebts = response.data.personDebts_m; //个人负债列表
                        $scope.companyDebts = response.data.companyDebts_m; //企业负债列表
                        $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
                        $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
                        $scope.riskVo = response.data.riskVo_m; //风控vo
                        $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
                        $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
                        $scope.commodityInfos = response.data.commodityInfos;//商品
                        $scope.monthSales = response.data.monthSales;//月均销售
                        $scope.bankStreams = response.data.bankStreams;//银行流水
                        $scope.guaranteeList = response.data.guaranteeList; //担保人列表
                        //$scope.guarantee = response.data.guarantee;
                        $scope.project = response.data.project; //项目列表
                        $scope.logList = response.data.logList; //日志列表
                        $scope.lists = response.data.lists; //还款计划
                        $scope.voList = response.data.voList; //文件路劲
                    });
                }else{
                    layer.msg("删除失败");
                }
            });
        };

        $scope.detCompanyDebt = function (c,index) {
            var data = new FormData();
            data.append("companyDebt",JSON.stringify(c));
            data.append("index",index);
            $http({
                method:'POST',
                url:"/admin/companyDebt/tempDel",
                data: data,
                headers: {'Content-Type':undefined}
            }).then(function (response){
                if(response.data.status == 'SCCUESS'){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    layer.msg("删除成功");
                    $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
                        $scope.loan = response.data.loan; //借款
                        $scope.person = response.data.person; //借款人
                        $scope.cor = response.data.cor; //法人
                        $scope.personDebts = response.data.personDebts_m; //个人负债列表
                        $scope.companyDebts = response.data.companyDebts_m; //企业负债列表
                        $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
                        $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
                        $scope.riskVo = response.data.riskVo_m; //风控vo
                        $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
                        $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
                        $scope.commodityInfos = response.data.commodityInfos;//商品
                        $scope.monthSales = response.data.monthSales;//月均销售
                        $scope.bankStreams = response.data.bankStreams;//银行流水
                        $scope.guaranteeList = response.data.guaranteeList; //担保人列表
                        //$scope.guarantee = response.data.guarantee;
                        $scope.project = response.data.project; //项目列表
                        $scope.logList = response.data.logList; //日志列表
                        $scope.lists = response.data.lists; //还款计划
                        $scope.voList = response.data.voList; //文件路劲
                    });
                }else{
                    layer.msg("删除失败");
                }
            });
        };

        $scope.reloadRoute = function () {
            $window.location.reload();

        };

        $scope.queryData = function () {

        };

    $scope.examine = function(riskVo,num,phone){

            var content = $("#content").val();
            if(content == ''){
                layer.msg("审核内容不能为空!");
                return false;
            }
            if(num == 1){
                $scope.data = {
                    "loan":JSON.stringify($scope.loan),
                    "riskVo":JSON.stringify(riskVo),
                    "num":JSON.stringify(num),
                    "phone":phone
                };
            }else if(num == 2){
                $scope.data = {
                    "loan":JSON.stringify($scope.loan),
                    "riskVo":JSON.stringify(riskVo),
                    "num":JSON.stringify(num)
                };
            }else if(num == 3){
                $scope.data = {
                    "loan":JSON.stringify($scope.loan),
                    "riskVo":JSON.stringify(riskVo),
                    "num":JSON.stringify(num),
                    "phone":phone
                };
            }


        $http.put('/admin/manual/loan/examine',$scope.data).then(function(response) {
            if(response.data.code == 1){
                layer.msg(response.data.msg);
                return;
            }
            if('SUCCESS' == response.data.status){
                layer.msg("审核完成!");
                $window.location.href="sgLoan.html";
            }else if('FAIL' == response.data.status){
                layer.msg('审核失败!');
            }else if('OK' == response.data.status){
                layer.msg('该公司已经添加到e签保中!');
            }
        });
    };
   });


    layui.use('element', function(){
        var $ = layui.jquery,
            layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
            layer = layui.layer,
            element = layui.element;

        $('#add-personal-loan').on('click', function() {
            layer.open({
                title: '新增个人负债',
                type: 1,
                content: $("#person-debt-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });

            $scope.personStatus = true;
            //添加个人负债
            $scope.addPersonDebt = function (personDebt,isValidate) {

                if(isValidate){
                    layer.msg("还有必填信息未输入!!");
                    return false;
                }

                if(personDebt.isCalculation){
                    personDebt.isCalculation = 1;
                }else{
                    personDebt.isCalculation = 0;
                }

                if(personDebt.isOperLoan){
                    personDebt.isOperLoan = 1;
                }else{
                    personDebt.isOperLoan = 0;
                }

                $scope.data = {"personDebt":JSON.stringify(personDebt),"loanId":$routeParams.id};

                $http.post('/admin/personDebt/tempAdd',$scope.data).then(function (response){
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.personDebt={};
                    if('SUCCESS' == response.data.status){
                        layer.msg("创建成功!");
                        layer.closeAll();
                        $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
                            $scope.loan = response.data.loan; //借款
                            $scope.person = response.data.person; //借款人
                            $scope.cor = response.data.cor; //法人
                            $scope.personDebts = response.data.personDebts_m; //个人负债列表
                            $scope.companyDebts = response.data.companyDebts_m; //企业负债列表
                            $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
                            $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
                            $scope.riskVo = response.data.riskVo_m; //风控vo
                            $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
                            $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
                            $scope.commodityInfos = response.data.commodityInfos;//商品
                            $scope.monthSales = response.data.monthSales;//月均销售
                            $scope.bankStreams = response.data.bankStreams;//银行流水
                            $scope.guaranteeList = response.data.guaranteeList; //担保人列表
                            //$scope.guarantee = response.data.guarantee;
                            $scope.project = response.data.project; //项目列表
                            $scope.logList = response.data.logList; //日志列表
                            $scope.lists = response.data.lists; //还款计划
                            $scope.voList = response.data.voList; //文件路劲
                        });
                    }else if('FAIL' == response.data.status){
                        layer.msg("创建借款失败!");
                    }
                });
            };
        });



        //添加企业负债
        $('#add-company-loan').on('click', function() {
            layer.open({
                title: '新增企业负债',
                type: 1,
                content: $("#company-debt-layer"),
                area: ['630px', '460px'],
                shade: 0.3,
                btnAlign: 'c',
                shadeClose: true
            });

            $scope.companyStatus = true;

            $scope.addCompanyDebt = function (companyDebt, isValidate) {

                if(isValidate){
                    layer.msg("还有必填信息未输入!!");
                    return false;
                }

                if (companyDebt.isCalculation) {
                    companyDebt.isCalculation = 1;
                } else {
                    companyDebt.isCalculation = 0;
                }

                if(companyDebt.isOperLoan){
                    companyDebt.isOperLoan = 1;
                }else{
                    companyDebt.isOperLoan = 0;
                }

                $scope.data = {"companyDebt": JSON.stringify(companyDebt), "loanId": $routeParams.id};

                $http.post('/admin/companyDebt/tempAdd', $scope.data).then(function (response) {
                    if(response.data.code == 1){
                        layer.msg(response.data.msg);
                        return;
                    }
                    $scope.companyDebt={};
                    if ('SUCCESS' == response.data.status) {
                        $http.get('/admin/manual/loan/query',{params:{id:$routeParams.id}}).then(function(response) {
                            $scope.loan = response.data.loan; //借款
                            $scope.person = response.data.person; //借款人
                            $scope.cor = response.data.cor; //法人
                            $scope.personDebts = response.data.personDebts_m; //个人负债列表
                            $scope.companyDebts = response.data.companyDebts_m; //企业负债列表
                            $scope.personDebtVo = response.data.personDebtVo_m; //个人负债vo
                            $scope.companyDebtVo = response.data.companyDebtVo_m; //企业负债vo
                            $scope.riskVo = response.data.riskVo_m; //风控vo
                            $scope.companyIncomeVo = response.data.companyIncomeVo_m; //企业收入
                            $scope.buyerCompanyInfos = response.data.buyerCompanyInfos;//买方企业
                            $scope.commodityInfos = response.data.commodityInfos;//商品
                            $scope.monthSales = response.data.monthSales;//月均销售
                            $scope.bankStreams = response.data.bankStreams;//银行流水
                            $scope.guaranteeList = response.data.guaranteeList; //担保人列表
                            //$scope.guarantee = response.data.guarantee;
                            $scope.project = response.data.project; //项目列表
                            $scope.logList = response.data.logList; //日志列表
                            $scope.lists = response.data.lists; //还款计划
                            $scope.voList = response.data.voList; //文件路劲
                        });
                        layer.closeAll();
                    } else if ('FAIL' == response.data.status) {
                        layer.msg("创建借款失败!");
                    }
                });
            };

        });

    });

}




