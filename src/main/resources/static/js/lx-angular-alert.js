/*
 * lx-angular-alert
 * user/repo
 *
 * Copyright (c) 2014 
 */

'use strict';

angular.module('lx.alert', [])
/**
 * @ngdoc object
 * @name lx.alert.$lxAlert
 * @requires $timeout
 *
 * @description
 * Service for angular-ui alert handling which shows different alert boxes in an application.
 *
 * For more information look at the [guide](/alert).
 *
 */
    .factory('$lxAlert', function ($timeout) {
        var pub = {};

        // timeout for show alert box.
        pub.timeout = 5000;

        // show or hide alert message box
        pub.visible = false;

        // private for timeout cancel
        var promise = null;

        // private close helper
        var close = function () {
            pub.visible = false;
        };

        // private show helper
        var show = function (type, msg) {
            console.log("Tpye: ",type);
            console.log("MSG: ",msg);

            pub.type = type;
            pub.msg = msg;
            pub.visible = true;

            // timeout for close alert
            if (pub.timeout > 0) {
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function () {
                    close();
                }, pub.timeout);
            }
        };

        /**
         * @ngdoc method
         * @name lx.alert.$lxAlert#setMsgTimeout
         * @methodOf lx.alert.$lxAlert
         *
         * @description
         * sets a new timeout until the alert message is close
         *
         */
        pub.setMsgTimeout = function (time) {
            if(time){
                pub.timeout = time;
            }
        };

        /**
         * @ngdoc method
         * @name lx.alert.$lxAlert#close
         * @methodOf lx.alert.$lxAlert
         *
         * @description
         * Closes the alert message.
         *
         */
        pub.close = function () {
            close();
        };

        /**
         * @ngdoc method
         * @name lx.alert.$lxAlert#info
         * @methodOf lx.alert.$lxAlert
         *
         * @description
         * Shows an info alert message. It shows messages without a warn level.
         *
         * @param {string} message The message to be displayed.
         */
        pub.info = function (message) {
            show('info', message);
        };

        /**
         * @ngdoc method
         * @name lx.alert.$lxAlert#success
         * @methodOf lx.alert.$lxAlert
         *
         * @description
         * Shows a success alert message. It shows a confirmation message.
         *
         * @param {string} message The message to be displayed.
         */
        pub.success = function (message) {
            show('success', message);
        };

        /**
         * @ngdoc method
         * @name lx.alert.$lxAlert#warning
         * @methodOf lx.alert.$lxAlert
         *
         * @description
         * Shows a warning alert message.It shows a message with a middle warn level.
         *
         * @param {string} message The message to be displayed.
         */
        pub.warning = function (message) {
            show('warning', message);
        };

        /**
         * @ngdoc method
         * @name lx.alert.$lxAlert#danger
         * @methodOf lx.alert.$lxAlert
         *
         * @description
         * Shows a danger alert message. It shows a message with a high warn level.
         *
         * @param {string} message The message to be displayed.
         */
        pub.danger = function (message) {
            show('danger', message);
        };

        return pub;
    })
/**
 * @ngdoc directive
 * @name lx.alert.directive:lxAlert
 * @restrict E
 *
 * @description
 * Markup for alert. It is the place holder which contains the DOM-content to show alert messages.
 *
 * For more information look at the [guide](/alert).
 *
 */
    .directive('lxAlert', function () {
        return {
            restrict: 'E',
            replace: true,
            template:
            '<div class="dialog-wrapper" ng-show="service.visible">'+
            '<div class="dialog-bd">'+
            '<p class="dialog-title">提示</p>'+
            '<div class="dialog-msg">'+
            '<alert ng-repeat="alert in alerts" class="ng-cloak" type="{{alert.type}}" close="service.close()">{{ alert.msg }}</alert>' +
            '</div>'+
            '</div>'+
            '</div>',
            // '<div class="lx-alert animate-show" ng-show="service.visible">' +
            //     '<alert ng-repeat="alert in alerts" class="ng-cloak" type="{{alert.type}}" close="service.close()">{{ alert.msg }}</alert>' +
            //     '</div>',
            scope: {
                service: '=',
                msgTimeout: '='
            },
            link: function (scope) {
                scope.alerts = [];
                scope.$watch('msgTimeout',function(val){
                    if(val && val > 100){
                        scope.service.setMsgTimeout(val);
                    } else {
                        scope.service.setMsgTimeout(3000);
                    }
                });

                scope.$watch('service.type',function(){
                    scope.alerts = [];
                    scope.alerts.push({type: scope.service.type, msg: scope.service.msg});
                });
                // 新添加的监控
                scope.$watch('service.msg',function(){
                    scope.alerts = [];
                    scope.alerts.push({type: scope.service.type, msg: scope.service.msg});
                });
            }
        };
    });