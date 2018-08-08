var app = angular.module('app',['ngRoute']);

app.config(['$qProvider','$routeProvider',function($qProvider,$routeProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider.
    when('/',{templateUrl:'html/manual/loanAfter/repaymentTrack.html',controller:TrackController})
}]);

function TrackController($scope,$http,$window,$location){

    $http.get('/admin/track/list').then(function (response) {
        if(response.data.code == 1){
            layer.msg(response.data.msg);
            return;
        }
        $scope.lists = response.data.data;
    });


    $scope.jump = function (LoanId) {
        $window.location.href="sgLoan.html#!/sgloan/desc/"+LoanId;
    };

    layui.use(['form','carousel'],function () {
        var form = layui.form,
            carousel = layui.carousel;

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


        $scope.selectPic = function (loanId,id) {

            $http.get('/admin/track/selPic?loanId='+loanId+'&repayId='+id).then(function (response) {
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
                    //$window.location.href = "track.html";
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
                        if(response.data.code == 1){
                            layer.msg(response.data.msg);
                            return;
                        }
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
                $scope.picss = datas  = response.data.data.pics;
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
                        layer.closeAll();
                        $window.location.reload();
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
                            $window.location.href = "track.html";
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