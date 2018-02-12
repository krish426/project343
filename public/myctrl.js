app.controller('myCtrl', ['$scope','$location','$http','$timeout',function($scope,$location,$http,$timeout) {
    $scope.login = function() {
     if($scope.username === undefined || $scope.password === undefined)
     {
      console.log("please insert username or password")
     }
     else
     {

      data ={
            'username'  :angular.lowercase($scope.username),
            'password'  :$scope.password
            }
      $http.post('/login', data).then(function(response){
      if(response.data=="admin"){
        $location.path("/adminpanel")
      }
      else if(response.data=="user"){
        $location.path("/userpanel")
      }
      else{
  $scope.spinner=false;
   $scope.loginErr=!$scope.loginErr;
      }
  })
    $scope.spinner=!$scope.spinner;
    }
    };
    $scope.hideErr=function(){
      $scope.loginErr=false;
    }

}]);
app.controller('adminpanel', ['$scope','$location','$http','$sessionStorage','$rootScope','$interval',function($scope,$location,$http,$sessionStorage,$rootScope,$interval) {

  $http.get("admindata").then(function(response)
  {
  console.log("login")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }
  $scope.adminpnl="active";
  $scope.createUser=function(){
    $location.path("/createuser");
  }
  $http.get("userrecords").then(function(response)
  {

  $sessionStorage.usersRecord=response.data;
  $scope.usersRecord=$sessionStorage.usersRecord
})
  $scope.usersRecord=$sessionStorage.usersRecord

  $scope.selectedUser=function(data){
   $rootScope.selectedUserUp=data;

     $location.path("/updateuserad")
  }

  $scope.removeUser=function(data){
    if (confirm("You are Going to Delete") == true) {
     data={'userid':data}
     $http.post('/removeuser', data).then(function(response)
    {
      $http.get("userrecords").then(function(response)
      {
      $sessionStorage.usersRecord=response.data;
      $scope.usersRecord=$sessionStorage.usersRecord
      })
    })
   } else {
     console.log("You Pressed Cancel")
   }
  }
}]);

app.controller('updateadmin', ['$scope','$location','$http','$timeout','$rootScope',function($scope,$location,$http,$timeout,$rootScope) {
  $http.get("admindata").then(function(response)
  {
  $rootScope.adminid=response.data._id;
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }
$scope.editprof="active";
    $scope.updateadmin = function() {
     if($scope.username === undefined || $scope.password === undefined)
     {
       $scope.adminUpdated=false
      console.log("please insert username or password")
     }
     else
     {
      data ={
            'username'  :angular.lowercase($scope.username),
            'password'  :$scope.password,
            'adminid'   :$rootScope.adminid
          };
      $http.post('/updateadmin', data).then(function(response){
        $scope.adminUpdated=!$scope.adminUpdated;
        $scope.spinner=false
        $timeout(function(){
          $location.path("/adminpanel")
        },1000);
          })
        $scope.spinner=!$scope.spinner;
    }
    }

}]);

app.controller('createuser', ['$scope','$location','$http','$timeout',function($scope,$location,$http,$timeout) {

  $http.get("admindata").then(function(response)
  {
  console.log("login")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }

    $scope.addUser=function(){
      if($scope.userName === undefined || $scope.userPassword === undefined){
          console.log("err")
          $timeout(function(){
        $scope.userErr=!$scope.userErr;
        },100);

        } else{
            $scope.userErr=false
          data ={
                'userName'     :  $scope.userName,
                'userEmail'    :  $scope.userEmail,
                'phonNumber'   :  $scope.phonNumber,
                'userPassword' :  $scope.userPassword,
                }
           $http.post('/createnewuser', data)
          console.log("User Created")
          $timeout(function(){
            $scope.userAdded =!$scope.userAdded;

          },100);
        $timeout(function(){
          $location.path("/adminpanel")
        },1000);

        }
    }
$scope.hideUserErr=function(){
  $scope.userErr=false;
}
}]);

app.controller('updateuserad', ['$scope','$location','$http','$sessionStorage','$rootScope','$timeout',function($scope,$location,$http,$sessionStorage,$rootScope,$timeout) {

  $http.get("admindata").then(function(response)
  {
  console.log("login")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }
if($rootScope.selectedUserUp){
  $scope.uAd=$rootScope.selectedUserUp;
  $scope.userName=$scope.uAd.username;
  $scope.userEmail=$scope.uAd.userEmail;
  $scope.phonNumber=$scope.uAd.phonNumber;

}
else{
  $timeout(function()
    {
    $location.path("/adminpanel")
  },50);
}

$scope.updateUser=function(){

  $scope.userId=$rootScope.selectedUserUp._id
  $scope.defaultPass=$rootScope.selectedUserUp.password
  $scope.userName
  $scope.userEmail
  $scope.phonNumber
  $scope.userNewPassword
  if($scope.userName ===undefined){
     $timeout(function(){
       $scope.userErr =! $scope.userErr
     },100)
     }
  else if($scope.userNewPassword===undefined){
    $scope.userErr=false;
    data ={
          'userid'       :$scope.userId,
          'userName'     :$scope.userName,
          'userEmail'    :$scope.userEmail,
          'phonNumber'   :$scope.phonNumber,
          'userPassword' :$scope.defaultPass,
          }
    $http.post('/userupdate', data).then(function(response){

      console.log("updated")
      $timeout(function(){
    $scope.userUpdated =!$scope.userUpdated
    },100);

      $timeout(function(){
      $location.path("/adminpanel")
    },1000);

    })

  }
else{
  $scope.userErr=false;
  data ={
        'userid'       :$scope.userId,
        'userName'     :$scope.userName,
        'userEmail'    :$scope.userEmail,
        'phonNumber'   :$scope.phonNumber,
        'userPassword' :$scope.userNewPassword,
        }
  $http.post('/userupdate', data).then(function(response){

    console.log("updated")
    $timeout(function(){
  $scope.userUpdated =!$scope.userUpdated
  },100);

    $timeout(function(){
    $location.path("/adminpanel")
  },500);

  })
}
     }

}]);
app.controller('userpanel', ['$scope','$location','$http','$rootScope','$sessionStorage','$timeout','$interval','NgTableParams',function($scope,$location,$http,$rootScope,$sessionStorage,$timeout,$interval,NgTableParams) {
  $http.get("userdata").then(function(response)
  {     $rootScope.userdata=response.data;
      $rootScope.userid=response.data._id;
      data ={
            'id'  :response.data._id,
            }
      $http.post("tablesrecord",data).then(function(response)
      {
        console.log("update")
        $scope.tablesRecord=response.data
      $scope.tableParams = new NgTableParams({}, { dataset: $scope.tablesRecord});
        $sessionStorage.tablesRecord=response.data
          $scope.tablesRecord=  $sessionStorage.tablesRecord
    })

  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
$scope.userpanel="active";
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }


  $scope.createTable=function(){
      $location.path("/createtable")
  }

  $scope.tablesRecord= $sessionStorage.tablesRecord
$scope.tableParams=new NgTableParams({}, { dataset: $scope.tablesRecord});
  $scope.selectedTable=function(id){
      $rootScope.selectedTable=id;
    $location.path("/viewtable")
  }
  $scope.editTable=function(data){
  $rootScope.editTableSelected=data;
  $location.path("/updatetable")
  }

  $scope.removeTable=function(data){

     if (confirm("You are Going to Delete") == true) {
      data={'tableid':data._id,
            'userid':data.userid,
             }

      $http.post('/removetable', data).then(function(response)
     {
       console.log("table deleted")
       data ={
             'id'  :$rootScope.userid,
             }
       $http.post("tablesrecord",data).then(function(response)
       {
         console.log("update")
         $scope.tableParams=new NgTableParams({}, { dataset: response.data});
     })
     })
    } else {
      console.log("You Pressed Cancel")
    }
  }

 $scope.shareTable=function(id){
   $rootScope.sharetableid=id
     $location.path("/sharetable")
 }

}]);

app.controller('sharetable', ['$scope','$location','$http','$rootScope','$timeout','$sessionStorage',function($scope,$location,$http,$rootScope,$timeout,$sessionStorage) {
  $http.get("userdata").then(function(response)
  {
  console.log("User Panel")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
    if($rootScope.userid){
    }
    else{
      $timeout(function()
        {
        $location.path("/userpanel")
      },500);
    }
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }
$scope.sharetableid=$rootScope.sharetableid
$http.get("allusers").then(function(response)
{
$scope.allusers=response.data

})

$scope.shareTheTable=function(userdata){

      if (confirm("You are going to share") == true) {
  data ={
        'sharetoid'     :userdata._id,
        'sharetoname'   :userdata.username,
        'tableid'       :$rootScope.sharetableid._id,
        'tableuserid'   :$rootScope.sharetableid.userid,
        'tableusername' :$rootScope.userdata.username,
        'tablename'     :$rootScope.sharetableid.tablename,
        'tdata'         :$rootScope.sharetableid.tdata,
      };

  $http.post('/sharetable', data).then(function(response){
    console.log('Table Has Been Shared')
})

}
else
{
  console.log("You Pressed Cancel")
}

}
}]);

app.controller('assignedtables', ['$scope','$location','$http','$rootScope','$timeout','$sessionStorage','$routeParams',function($scope,$location,$http,$rootScope,$timeout,$sessionStorage,$routeParams) {

  $http.get("userdata").then(function(response)
  {
    $sessionStorage.shareid=  response.data._id
    $scope.shareid=response.data._id

    data ={
          'tableuserid'  :$scope.shareid,
          }
    $http.post("assignedtables",data).then(function(response)
    {

  $scope.assignedtables=response.data

    })

  console.log("User Panel")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });

  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }

  $scope.astables="active";
  $scope.selectedTable=function(id){

    data={
      _id:id.tableid
    }

    $rootScope.selectedTable=data;
    $location.path("/viewtable")
  }

  $scope.removeAssignedTable=function(data){

     if (confirm("You are Going to Delete") == true) {
      data={'tableid':data._id,
             }
      $http.post('/removeassignedtable', data).then(function(response)
     {

       console.log("table deleted")
       $scope.shareid=$sessionStorage.shareid
       data ={
             'tableuserid'  :$scope.shareid,
             }
       $http.post("assignedtables",data).then(function(response)
       {
     $scope.assignedtables=response.data

       })
     })
    } else {
      console.log("You Pressed Cancel")
    }
  }


  }]);

  app.controller('sharedwithme', ['$scope','$location','$http','$rootScope','$timeout','$sessionStorage',function($scope,$location,$http,$rootScope,$timeout,$sessionStorage) {
    $http.get("userdata").then(function(response)
    {
        $scope.userid=response.data._id
      $sessionStorage.shareid=  response.data._id

$sessionStorage.shareid
      data ={
            'sharetoid'  :$scope.userid,
            }
      $http.post("sharedwithme",data).then(function(response)
      {
    $scope.sharedwithme=response.data

      })
    },function errorCallback(response)
    {
      console.log("login Err")
      $location.path("/")
    });

    $scope.logout=function(){
      $http.get("logout").then(function(response){
        $location.path("/")
      })
    }
    $scope.sharedwme="active";
    $scope.selectedTable=function(id){

      data={
        _id:id.tableid
      }

      $rootScope.selectedTable=data;
      $location.path("/viewtable")
    }

    $scope.removeSharedWithMe=function(data){

       if (confirm("You are Going to Delete") == true) {
        data={'tableid':data._id,
               }
        $http.post('/removesharedwithme', data).then(function(response)
       {

         console.log("table deleted")
         $sessionStorage.shareid
               data ={
                     'sharetoid'  : $sessionStorage.shareid,
                     }
               $http.post("sharedwithme",data).then(function(response)
               {
             $scope.sharedwithme=response.data

               })
       })
      } else {
        console.log("You Pressed Cancel")
      }
    }


    }]);

app.controller('editprofileuser', ['$scope','$location','$http','$timeout','$rootScope',function($scope,$location,$http,$timeout,$rootScope) {
  $http.get("userdata").then(function(response)
  {

  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }

  if($rootScope.userdata){
    $scope.uAd=$rootScope.userdata;
    $scope.userName=$scope.uAd.username;
    $scope.userEmail=$scope.uAd.userEmail;
    $scope.phonNumber=$scope.uAd.phonNumber;

  }
  else{
    $timeout(function()
      {
      $location.path("/userpanel")
    },500);
  }

  $scope.editpro="active";
  $scope.updateUser=function(){

    $scope.userId=$rootScope.userdata._id
    $scope.defaultPass=$rootScope.userdata.password
    $scope.userName
    $scope.userEmail
    $scope.phonNumber
    $scope.userNewPassword
    if($scope.userName ===undefined){
       $timeout(function(){
         $scope.userErr =! $scope.userErr
       },100)
       }
    else if($scope.userNewPassword===undefined){
      $scope.userErr=false;

      data ={
            'userid'       :$scope.userId,
            'userName'     :$scope.userName,
            'userEmail'    :$scope.userEmail,
            'phonNumber'   :$scope.phonNumber,
            'userPassword' :$scope.defaultPass,
            }
      $http.post('/userupdate', data).then(function(response){

        console.log("updated")
        $timeout(function(){
      $scope.userUpdated =!$scope.userUpdated
      },100);

        $timeout(function(){
        $location.path("/userpanel")
      },1000);

      })

    }
  else{
    $scope.userErr=false;
    data ={
          'userid'       :$scope.userId,
          'userName'     :$scope.userName,
          'userEmail'    :$scope.userEmail,
          'phonNumber'   :$scope.phonNumber,
          'userPassword' :$scope.userNewPassword,
          }
    $http.post('/userupdate', data).then(function(response){

      console.log("updated")
      $timeout(function(){
    $scope.userUpdated =!$scope.userUpdated
    },100);

      $timeout(function(){
      $location.path("/userpanel")
    },1000);

    })
  }
       }

}]);


app.controller('createtable', ['$scope','$location','$http','$rootScope','$timeout','$sessionStorage',function($scope,$location,$http,$rootScope,$timeout,$sessionStorage) {
  $http.get("userdata").then(function(response)
  {
  console.log("User Panel")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
    if($rootScope.userid){
    }
    else{
      $timeout(function()
        {
        $location.path("/userpanel")
      },500);
    }

  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }
  $scope.createNewTable=function(){
    var list=[];
    $scope.hideButton=!$scope.hideButton
    for(i=1; i<=$scope.columnNo; i++){
      list.push(i)
    }
    $scope.arr=list;
    $sessionStorage.tableName=$scope.tableName
  }
  $scope.generateTable=function(tdata){
    var baa=[];
    baa.push($rootScope.userdata.username)
    baa.push($rootScope.userid)
    baa.push($sessionStorage.tableName)
    for(i=0;i<Object.keys(tdata).length; i++){
    baa.push(tdata[i])

    }

   data={
          'tdata'   :baa
        };
    $http.post('/createtable', data).then(function(response){
      $location.path("/userpanel")
        })
  }

}]);

app.controller('viewtable', ['$scope','$location','$http','$rootScope','$timeout','$sessionStorage','$interval','NgTableParams',function($scope,$location,$http,$rootScope,$timeout,$sessionStorage,$interval,NgTableParams) {
  $http.get("userdata").then(function(response)
  {
  console.log("User Panel")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
    if($rootScope.selectedTable){
    }
    else{
      $timeout(function()
        {
        $location.path("/userpanel")
      },500);
    }

  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }

tData ={
      'id'  :$rootScope.selectedTable._id,
      }
$http.post("tablesrecordd",tData).then(function(response)
{
// $scope.opp=response.data;
$scope.tRecord=response.data[0].tdata
$scope.tableSName=response.data[0].tablename
})

$scope.addRow=function(data){
  $rootScope.rowNumber=data
 $rootScope.rowNumber
    $location.path("/createrow")

}
  $scope.id=$rootScope.selectedTable._id

  data ={
        'id'  :$scope.id,
        }

  $http.post("rowsrecord",data).then(function(response)
  {

$scope.allRows=response.data

})
$scope.selectedRow=function(data){

  $rootScope.selectedRow=data.rdata;
  $rootScope.completeSelectedRow=data;
    $location.path("/updaterow")
}
 $scope.removeRow=function(data){

    if (confirm("You are Going to Delete") == true) {
     data={'userid':data._id}
     $http.post('/removerow', data).then(function(response)
    {
      $scope.id=$rootScope.selectedTable._id

      data ={
            'id'  :$scope.id,
            }

      $http.post("rowsrecord",data).then(function(response)
      {
    $scope.allRows=response.data
    })
    })
   } else {
     console.log("You Pressed Cancel")
   }
  }


}])

app.controller('createrow', ['$scope','$location','$http','$rootScope','$timeout','$sessionStorage',function($scope,$location,$http,$rootScope,$timeout,$sessionStorage) {
  $http.get("userdata").then(function(response)
  {

  console.log("User Panel")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
    if($rootScope.selectedTable){
    }
    else{
      $timeout(function()
        {
        $location.path("/userpanel")
      },500);
    }
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }

  var list=[];
  for(i=1; i<=$rootScope.rowNumber.length; i++){
    list.push(i)
  }
  $scope.arr=list;

  $scope.generateRow=function(rdata){

    var rowdata=[];
    rowdata.push($rootScope.selectedTable._id)
    rowdata.push($rootScope.selectedTable.tablename)
    for(i=0;i<Object.keys(rdata).length; i++){
    rowdata.push(rdata[i])
    }

   data={
          'rdata'   :rowdata
        };
    $http.post('/createrow', data).then(function(response){
      $location.path("/viewtable")
        })
  }
}]);
app.controller('updaterow', ['$scope','$location','$http','$rootScope','$timeout','$sessionStorage',function($scope,$location,$http,$rootScope,$timeout,$sessionStorage) {
  $http.get("userdata").then(function(response)
  {
  console.log("User Panel")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
    if($rootScope.selectedTable){
    }
    else{
      $timeout(function()
        {
        $location.path("/userpanel")
      },500);
    }
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }

  $scope.updateRow=$rootScope.selectedRow;


  var list=[];
  for(i=0; i<=$scope.updateRow.length-1; i++){
    list.push($scope.updateRow[i])
  }
  $scope.arr=list;
  $scope.rowUpdate=function(rdata){
    var rowdata=[];
    rowdata.push($rootScope.completeSelectedRow._id)
    rowdata.push($rootScope.completeSelectedRow.tableid)
    rowdata.push($rootScope.completeSelectedRow.tablename)
    for(i=0;i<Object.keys(rdata).length; i++){
    rowdata.push(rdata[i])
    }

   rdata={
          'rdata'   :rowdata
        };
    $http.post('/updaterow', rdata).then(function(response){
      $location.path("/viewtable")
        })

  }
}]);

app.controller('updatetable', ['$scope','$location','$http','$rootScope','$timeout','$sessionStorage',function($scope,$location,$http,$rootScope,$timeout,$sessionStorage) {
  $http.get("userdata").then(function(response)
  {
  console.log("User Panel")
  },function errorCallback(response)
  {
    console.log("login Err")
    $location.path("/")
  });
    if($rootScope.editTableSelected){
    }
    else{
      $timeout(function()
        {
        $location.path("/userpanel")
      },500);
    }
  $scope.logout=function(){
    $http.get("logout").then(function(response){
      $location.path("/")
    })
  }


    $scope.editTableData=$rootScope.editTableSelected.tdata
    $scope.editTableName=$rootScope.editTableSelected.tablename


  $scope.tableUpdate=function(tdata){

    var tabledata=[];
    tabledata.push($rootScope.editTableSelected._id)
    tabledata.push($rootScope.editTableSelected.userid)
    tabledata.push($scope.editTableName)
    for(i=0;i<Object.keys(tdata).length; i++){
    tabledata.push(tdata[i])
    }

   tdata={
          'tdata'   :tabledata
        };
    $http.post('/updatetable', tdata).then(function(response){
      $location.path("/userpanel")
        })

  }
}]);
