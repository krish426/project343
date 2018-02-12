var app = angular.module("myApp", ["ngRoute",'ngStorage','ngTable']);
app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
    $routeProvider
    .when("/", {
        templateUrl : "views/pages/login.htm",
        controller: 'myCtrl',


    })
    .when("/adminpanel", {
        templateUrl : "views/pages/adminpanel.htm",
        controller: 'adminpanel',

    })
    .when("/createuser", {
        templateUrl : "views/pages/createuser.htm",
        controller: 'createuser',

    })
    .when("/updateuserad", {
        templateUrl : "views/pages/updateuserad.htm",
        controller: 'updateuserad',

    })
    .when("/editprofilead", {
        templateUrl : "views/pages/editprofilead.htm",
        controller: 'updateadmin',

    })

    .when("/userpanel", {
        templateUrl : "views/pages/userpanel.htm",
        controller: 'userpanel',

    })

    .when("/sharetable", {
        templateUrl : "views/pages/sharetable.htm",
        controller: 'sharetable',

    })
    .when("/assignedtables", {
        templateUrl : "views/pages/assignedtables.htm",
        controller: 'assignedtables',

    })
    .when("/sharedwithme", {
        templateUrl : "views/pages/sharedwithme.htm",
        controller: 'sharedwithme',

    })
    .when("/editprofileuser", {
        templateUrl : "views/pages/editprofileuser.htm",
        controller: 'editprofileuser',

    })
    .when("/createtable", {
        templateUrl : "views/pages/createtable.htm",
        controller: 'createtable',

    })
    .when("/viewtable", {
        templateUrl : "views/pages/viewtable.htm",
        controller: 'viewtable',

    })
    .when("/createrow", {
        templateUrl : "views/pages/createrow.htm",
        controller: 'createrow',

    })
    .when("/updaterow", {
        templateUrl : "views/pages/updaterow.htm",
        controller: 'updaterow',
    })
    .when("/updatetable", {
        templateUrl : "views/pages/updatetable.htm",
        controller: 'updatetable',
    })
    .otherwise({
        template : "<h1>Nothing</h1><p>Nothing has been selected</p>"
    });
});
