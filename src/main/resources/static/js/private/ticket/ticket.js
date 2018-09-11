var ticket = angular.module('ticketUpload',['ngRoute']);

ticket.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:"html/Ticket/ticketUploadContent.html",controller:ticketUploadController})
}]);


function ticketUploadController($scope,$http,$window,$rootScope,$filter) {

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

    var pageSize = 2;

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

        var type = $("#ticketType").val();
        if (type == "全部") {
            type = "";
        }

        $http.get('/ticket/queryTicket?page='+initPage+'&size='+pageSize+'&ticketNumber='+$scope.queryNumber
                   +'&ticketName='+type+'&billerName='+$scope.billerName)
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