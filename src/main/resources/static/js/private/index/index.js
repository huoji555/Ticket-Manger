var indexApp = angular.module('index',['ngRoute']);

indexApp.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:"html/index/indexContent.html",controller:indexController})
                  .when('/ticketUpload',{templateUrl:"html/Ticket/ticketUploadContent.html",controller:ticketUploadController})
                  .when('/ticketDiscount',{templateUrl:"html/Ticket/ticketDiscountContent.html",controller:ticketDiscountController})
                  .when('/adminMessage',{templateUrl:"html/Admin/adminMessage.html",controller:adminMessageController})
                  .when('/tradeMessage',{templateUrl:"html/Trade/tradeMessage.html",controller:tradeMessageController})
}]);




/*---------------------------------------首页controller--------------------------------*/
indexApp.controller('indexCon',function ($scope,$http,$window,$rootScope) {

    //退出登录
    $rootScope.quit = function () {

        $http.post("/admin/logOut")
            .then(function (response) {
                var status = response.data.status;
                var msg = response.data.message;

                if (status == 200){
                    $window.location = "login.html";
                } else {
                    alert("退出失败");
                }
            })

    }

    /*判断是否登录*/
    $rootScope.ifLogin = function () {

        $http.post("/admin/ifLogin")
            .then(function (response) {
                var status = response.data.status;
                var msg = response.data.message;

                if (status == 201){
                    alert("您还未登录，请登录后再操作");
                    $window.location = "login.html";
                }
            })
    }

    $rootScope.ifLogin();
    $rootScope.first = '票据管理';


    /*动态赋值*/
    $rootScope.changeName = function (first,second) {
        $rootScope.first = first;
    }


    /*修改密码*/
    $scope.update = function () {

        if( $scope.newPwd != $scope.repPWD) {alert("两次输入密码不一致");return ;}

        if (!checkPassword($scope.repPWD)) {alert("请尝试更复杂的密码");return ;}

        $http.get('/admin/updatePwd?orignalPwd='+$scope.orignPwd+'&newPwd='+$scope.repPWD).then(function (response) {

            var status = response.data.status;
            var msg = response.data.message;

            if (status == 200){
                alert(msg);
            } else if (status == 201){
                alert(msg);
            }
        });

    }

    //验证密码
    function checkPassword(pwd) {

        var strength = 0;
        var value = pwd;
        if (value.length > 7 && value.match(/[\da-zA-Z]+/)) {
            if (value.match(/\d+/)) {
                strength++;
            }
            if (value.match(/[a-z]+/)) {
                strength++;
            }
            if (value.match(/[A-Z]+/)) {
                strength++;
            }
            if (value.match(/[!@*$-_()+=&￥]+/)) {
                strength++;
            }
        }

        if (strength >= 2) {
            return true;
        }
        return false;
    }


});

function indexController($scope,$http,$window,$rootScope) {

}






/*---------------------------------------票据上传controller----------------------------*/
function ticketUploadController($scope,$http,$window,$rootScope,$filter) {

    var pageSize = 20;

    /*票据上传，解析*/
    $scope.upload = function () {

        var file = document.getElementById("file").files[0];

        if(file == undefined){
            alert("请选择文件后再上传");
            return;
        }

        //一会加文件格式检测
        var fd= new FormData();
        fd.append("file",file);

        $http({
            method :'POST',
            url : '/ticket/upload',
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (respose) {

            var status = respose.data.data.status;
            var msg = respose.data.data.message;

            if (status == 200) {
                alert(msg);
                $window.location.reload();
            } else if (status == 202) {
                alert("不支持当前的上传文件格式");
            }


        })

    }


    /*分页*/
    $scope.pagination = function(initPage,pageSize){

        $http.get('/ticket/getPage?page='+initPage+'&size='+pageSize)
            .then(function (response) {
                $scope.totalNum = response.data.data.totalElements;//数据总数
                $scope.pages = response.data.data.totalPages;//页数
                $scope.currPage = response.data.data.number;//当前页
                $scope.isFirstPage = response.data.data.first;//是否是首页
                $scope.isLastPage = response.data.data.last;//是否是尾页
                $scope.lastUpPage = $scope.pages - 1;//倒数第二页
                $scope.lists = response.data.data.content;
            })

    }

    $scope.pagination(0,pageSize);
    $scope.checkQuery = false;

    //分页下部
    $scope.page = function (page,oper) {

        if(oper == 'first'){ //首页
            $scope.pagination(0,pageSize)
        }
        if(oper == 'up'){   //上一页
            if (page == 0){
                return;
            }
            $scope.pagination(page-1,pageSize);
        }
        if(oper == 'next'){ //下一页
            if (page == $scope.pages-1){
                return;
            }
            $scope.pagination(page+1,pageSize);
        }
        if (oper == 'last'){  //末页
            $scope.pagination(page-1,pageSize);
        }
    }


    //赋值
    $scope.show = function (list) {
        $scope.ticketNumber = list.ticketNumber;
        $scope.ticketAmount = list.ticketAmount;
        $scope.ticketType = list.ticketType;
        $scope.ticketName = list.ticketName;
        $scope.nonTransferLogo = list.nonTransferLogo;
        $scope.nonTransferLogoName = list.nonTransferLogoName;
        $scope.ticketingTime = list.ticketingTime;
        $scope.maturityTime = list.maturityTime;
        $scope.billerName = list.billerName;
        $scope.invoiceName = list.invoiceName;
        $scope.acceptorName = list.acceptorName;
        $scope.ticketStatus = list.ticketStatus;
        $scope.handheldName = list.handheldName;
        $scope.handheldAccountNumber = list.handheldAccountNumber;
        $scope.handheldBankNumber = list.handheldBankNumber;
        $scope.originalHandheldName = list.originalHandheldName;
        $scope.originalHandheldBankNumber = list.originalHandheldBankNumber;
        $scope.poolStatus = list.poolStatus;

    }



    /*查询分页*/
    $scope.queryTicket = function(initPage,pageSize){

        $scope.checkQuery = true;

        var type = $("#ticketType").val();
        if (type == "全部") {
            type = "";
        }

        $http.get('/ticket/queryTicket?page='+initPage+'&size='+pageSize+'&ticketNumber='+$scope.queryNumber
            +'&ticketName='+type+'&billerName='+$scope.billerName1)
            .then(function (response) {
                $scope.totalNum = response.data.data.totalElements;//数据总数
                $scope.pages = response.data.data.totalPages;//页数
                $scope.currPage = response.data.data.number;//当前页
                $scope.isFirstPage = response.data.data.first;//是否是首页
                $scope.isLastPage = response.data.data.last;//是否是尾页
                $scope.lastUpPage = $scope.pages - 1;//倒数第二页
                $scope.lists = response.data.data.content;
            })

    }

    /*查询好的分页底部*/
    $scope.pageQuery = function (page,oper) {

        if(oper == 'first'){ //首页
            $scope.queryTicket(0,pageSize)
        }
        if(oper == 'up'){   //上一页
            if (page == 0){
                return;
            }
            $scope.queryTicket(page-1,pageSize);
        }
        if(oper == 'next'){ //下一页
            if (page == $scope.pages-1){
                return;
            }
            $scope.queryTicket(page+1,pageSize);
        }
        if (oper == 'last'){  //末页
            $scope.queryTicket(page-1,pageSize);
        }
    }



    /*计算预期利率(估价)*/
    $scope.calculate = function (list) {

        var now = new Date();
        var currentDate = $filter('date')(now, "yyyy-MM-dd");
        var tradeType = $("#tradeType").val();

        $http.get('/ticket/calculate?currentDate='+currentDate+'&ticketNumber='+list.ticketNumber)
            .then(function (response) {

                var status = response.data.data.status;
                var msg = response.data.data.message;

                if(status == 200){
                    $scope.rateList = response.data.data.list;
                    console.log(msg);
                } else if(status == 201){
                    alert(msg);
                    $scope.rateList = response.data.data.list;
                    return;
                }

            })

    }

}








/*-----------------------------------------票据贴现-----------------------------------------*/
function ticketDiscountController($scope,$http,$window,$rootScope) {

    var pageSize = 20;

    /*票据贴现页面分页*/
    $scope.pagination = function(initPage,pageSize){

        $http.get('/ticketDiscount/getPage?page='+initPage+'&size='+pageSize)
            .then(function (response) {
                $scope.totalNum = response.data.data.totalElements;//数据总数
                $scope.pages = response.data.data.totalPages;//页数
                $scope.currPage = response.data.data.number;//当前页
                $scope.isFirstPage = response.data.data.first;//是否是首页
                $scope.isLastPage = response.data.data.last;//是否是尾页
                $scope.lastUpPage = $scope.pages - 1;//倒数第二页
                $scope.lists = response.data.data.content;
            })

    }



    $scope.pagination(0,pageSize);



    //分页下部
    $scope.page = function (page,oper) {

        if(oper == 'first'){ //首页
            $scope.pagination(0,pageSize)
        }
        if(oper == 'up'){   //上一页
            if (page == 0){
                return;
            }
            $scope.pagination(page-1,pageSize);
        }
        if(oper == 'next'){ //下一页
            if (page == $scope.pages-1){
                return;
            }
            $scope.pagination(page+1,pageSize);
        }
        if (oper == 'last'){  //末页
            $scope.pagination(page-1,pageSize);
        }
    }


    //赋值
    $scope.show = function (list) {
        $scope.ticketNumber = list.ticketNumber;
        $scope.ticketAmount = list.ticketAmount;
        $scope.ticketType = list.ticketType;
        $scope.ticketName = list.ticketName;
        $scope.nonTransferLogo = list.nonTransferLogo;
        $scope.nonTransferLogoName = list.nonTransferLogoName;
        $scope.ticketingTime = list.ticketingTime;
        $scope.maturityTime = list.maturityTime;
        $scope.billerName = list.billerName;
        $scope.invoiceName = list.invoiceName;
        $scope.acceptorName = list.acceptorName;
        $scope.ticketStatus = list.ticketStatus;
        $scope.handheldName = list.handheldName;
        $scope.handheldAccountNumber = list.handheldAccountNumber;
        $scope.handheldBankNumber = list.handheldBankNumber;
        $scope.originalHandheldName = list.originalHandheldName;
        $scope.originalHandheldBankNumber = list.originalHandheldBankNumber;
        $scope.poolStatus = list.poolStatus;

        $scope.freshModal(list.ticketNumber);

    }


    /*刷新模态框*/
    $scope.freshModal = function (ticketNumber) {

        $http.get('/ticketDiscount/getContent?ticketNumber='+ticketNumber)
            .then(function (response) {
                $scope.discount = response.data.data;
            })

    }



    /*贴现保存*/
    $scope.save = function (discount) {

        discount.ticketNumber = $scope.ticketNumber;

        $http.post('/ticketDiscount/save',discount)
            .then(function (response) {
                $scope.freshModal(discount.ticketNumber);
                alert("贴现成功");
            })

    }

}






/*-------------------------  用户信息查看  ------------------------------*/
function adminMessageController($scope,$http,$window,$rootScope) {

    /*获取用户信息*/
    $scope.getMessage = function () {

        $http.get('auditing/getAdminMessage')
             .then(function (response) {
                 $scope.list = response.data.data;
             })

    }


    $scope.getMessage();


    /*显示用户信息*/
    $scope.showMessage = function (url,type) {
             $scope.message = url;
    }

    /*下载文件*/
    $scope.download = function (url) {
            $window.location = url;
    }

}






/*---------------  当日交易价格类型 -------------------*/
function tradeMessageController($scope,$http,$window,$rootScope,$filter) {

    var now = new Date();
    var currentDate = $filter('date')(now, "yyyy-MM-dd");

    /*查询日期*/
    $scope.queryDate = function (queryDate) {

        $http.get('trade/getTradeData?queryDate='+queryDate)
            .then(function (response) {
                $scope.lists = response.data.data;
                if($scope.lists == 0) {
                    alert("没有当天数据");
                    return ;
                }
            })

    }


    /*查询按钮*/
    $scope.queryByDate = function () {

        var queryDate = $("#calendar").val();

        if(queryDate == "") {
            alert("未选择查询日期");
            return false;
        }

        $scope.queryDate(queryDate);

    }

    $scope.queryDate(currentDate);

}


