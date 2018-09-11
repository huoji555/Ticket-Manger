var ticketDiscount = angular.module('ticketDiscount',['ngRoute']);

ticketDiscount.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:"html/ticket/ticketDiscountContent.html",controller:ticketDiscountController})
}]);


function ticketDiscountController($scope,$http,$window,$rootScope) {


    var pageSize = 2;


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


        $http.get('/ticketDiscount/getContent?ticketNumber='+list.ticketNumber)
            .then(function (response) {
                $scope.discount = response.data.data;
            })

    }



    /*贴现保存*/
    $scope.save = function (discount) {

        $http.post('/ticketDiscount/save',discount)
            .then(function (response) {
                console.log("保存成功");
            })

    }







}