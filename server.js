var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    bodyParser      = require('body-parser'),
    session         = require('express-session'),
    {mongoose}      = require('./db/mongoose.js'),
    datatable       = require('./models/user.js'),
    table           = require('./models/table.js'),
    row             = require('./models/row.js'),
    sharetable      = require('./models/sharetable.js'),
    passportConf    = require('./config/passport'),
      bcrypt = require('bcrypt-nodejs');
        var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

// initialize passposrt and and session for persistent login sessions
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.sendStatus(401);
}



app.get("/", function (req, res) {
    res.send("<p>Hello!</p>");
});

// api endpoints for login, content and logout

app.post("/login",
    passport.authenticate("local", { failureRedirect: "/login"}),
    function (req, res) {
      if(req.user.role==="admin"){
      // console.log("noman"+req.user.username)
        res.send(req.user.role)
      }
      else if(req.user.role==="user"){
        // console.log("noman"+req.user.username)
          res.send(req.user.role)
      }
});
app.get("/admindata", isLoggedIn, function (req, res) {
  if(req.user.role==="admin"){
  // console.log(req.user)
res.send(req.user)}
else{
  res.send()
}
});

app.get("/userdata", isLoggedIn, function (req, res) {
  if(req.user.role==="user"){
res.send(req.user)}
else{
  res.send()
}
});


app.post("/updateadmin",isLoggedIn,function (req, res) {
// console.log(req.body.username)
     bcrypt.hash(req.body.password, null, null, function(err, hash) {
       user ={
         username        : req.body.username,
         password        : hash,
         role            : "admin",
      };
         // Store hash in your password DB.
         datatable.update({_id:req.body.adminid}, user, {upsert: true, 'new': true}, function(err, doc){

         if(err){
             console.log("Something wrong when updating data!");
         }
       res.send("updated")

          })
     });


});

app.get("/userrecords",isLoggedIn,function (req, res) {
    if(req.user.role==="admin"){
    datatable.find({role:"user"}).then(function(data){
      // console.log(data)
      res.send(data);

    })
  }
  else{
    res.send()
  }
});

app.get("/allusers",isLoggedIn,function (req, res) {

    datatable.find({role:"user"}).then(function(data){
      // console.log(data)
      res.send(data);

    })
});

app.post("/sharetable",isLoggedIn,function (req, res) {

      user = new sharetable({
      'sharetoid'    :req.body.sharetoid,
      'sharetoname'  :req.body.sharetoname,
      'tableid'      :req.body.tableid,
      'tableuserid'  :req.body.tableuserid,
      'tableusername':req.body.tableusername,
      'tablename'    :req.body.tablename,
      'tdata'        :req.body.tdata
     });
    user.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('table shared');
            res.redirect("/");
        }});
});
app.post("/assignedtables",isLoggedIn,function (req, res) {

      sharetable.find({tableuserid:req.body.tableuserid}).then(function(data){
        res.send(data);
      })
});
app.post("/sharedwithme",isLoggedIn,function (req, res) {

      sharetable.find({sharetoid:req.body.sharetoid}).then(function(data){
        res.send(data);
      })
});
app.post("/removeassignedtable",isLoggedIn,function (req, res) {
  // console.log(req.body.userid)
    sharetable.remove({_id:req.body.tableid}).then(function(){
        res.redirect("/tablesrecord");
        console.log("table deleted")

    })
});
app.post("/removesharedwithme",isLoggedIn,function (req, res) {
  // console.log(req.body.userid)
    sharetable.remove({_id:req.body.tableid}).then(function(){
        res.redirect("/tablesrecord");
        console.log("table deleted")

    })
});
app.post("/createnewuser",isLoggedIn,function (req, res) {

      user = new datatable({
        username        : req.body.userName,
        password        : req.body.userPassword,
        role            : "user",
        userEmail       : req.body.userEmail,
        phonNumber      : req.body.phonNumber,
     });
      console.log("group added")
    user.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('group Added');
            res.redirect("/");
        }});
});

app.post("/userupdate",isLoggedIn,function (req, res) {

     bcrypt.hash(req.body.userPassword, null, null, function(err, hash) {
  if((req.body.userPassword).length<60){
       user ={
         username        : req.body.userName,
         password        : hash,
         role            : "user",
         userEmail       : req.body.userEmail,
         phonNumber      : req.body.phonNumber,
      };
    }
    else{
      user ={
        username        : req.body.userName,
        password        : req.body.userPassword,
        role            : "user",
        userEmail       : req.body.userEmail,
        phonNumber      : req.body.phonNumber,
     };
    }
             datatable.update({_id:req.body.userid}, user, {upsert: true, 'new': true}, function(err, doc){

             if(err){
                 console.log("Something wrong when updating data!");
             }
           res.send("updated")

              })
        });


});

app.post("/removeuser",isLoggedIn,function (req, res) {
  // console.log(req.body.userid)
    datatable.remove({_id:req.body.userid}).then(function(){
      res.redirect("/userrecords");
      console.log("removed")
    })

});

app.get("/logout", function (req, res) {
    req.logout();
    res.send("logout success!");
});

app.get("/userdata", isLoggedIn, function (req, res) {
  if(req.user.role==="user"){
  console.log("nomaaan")
res.send(req.user.role)}
else{
  res.send()
}
});
app.post("/createtable",isLoggedIn,function (req, res) {

var boo=req.body.tdata.splice(3,Object.keys(req.body.tdata).length)

  user = new table({
            username  : req.body.tdata[0],
            userid    : req.body.tdata[1],
            tablename : req.body.tdata[2],
            viewspace :"viewspace",
            tdata     : boo,
 });
user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('table Added');
        res.redirect("/");
    }});

});

app.post("/tablesrecord",isLoggedIn,function (req, res) {
  // console.log(req.body.id)
    table.find({userid:req.body.id}).then(function(data){
      res.send(data);
    })
});
app.post("/tablesrecordd",isLoggedIn,function (req, res) {
  // console.log(req.body.id)
    table.find({_id:req.body.id}).then(function(data){
      // console.log(data)
      res.send(data);
    })
});
app.post("/createrow",isLoggedIn,function (req, res) {
  // console.log(req.body.rdata)

var bab=req.body.rdata.splice(2,Object.keys(req.body.rdata).length)

  user = new row({
            tableid   : req.body.rdata[0],
            tablename : req.body.rdata[1],
            rdata     : bab,
 });
user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Row Added');
        res.redirect("/");
    }});

});

app.post("/rowsrecord",isLoggedIn,function (req, res) {

    row.find({tableid:req.body.id}).then(function(data){
      res.send(data);
    })
});

app.post("/updaterow",isLoggedIn,function (req, res) {


var bab=req.body.rdata.splice(3,Object.keys(req.body.rdata).length)
// console.log(bab)
  user = {
            tableid   : req.body.rdata[1],
            tablename : req.body.rdata[2],
            rdata     : bab,
            };
 row.update({_id:req.body.rdata[0]}, user, {upsert: true, 'new': true}, function(err, doc){

 if(err){
     console.log("Something wrong when updating data!");
 }
res.send("Row updated")

  })

});
app.post("/removerow",isLoggedIn,function (req, res) {
  // console.log(req.body.userid)
    row.remove({_id:req.body.userid}).then(function(){
      res.redirect("/rowserecord");
      console.log("removed row")
    })

});


app.post("/updatetable",isLoggedIn,function (req, res) {


var bab=req.body.tdata.splice(3,Object.keys(req.body.tdata).length)

  user = {
            userid   : req.body.tdata[1],
            tablename : req.body.tdata[2],
            tdata     : bab,
            };

 table.update({_id:req.body.tdata[0]}, user, {upsert: true, 'new': true}, function(err, doc){
   data = {
          tablename : req.body.tdata[2],
           tdata: bab,
             }
sharetable.update({tableid:req.body.tdata[0]}, data, {upsert: true, 'new': true}, function(err, doc){})
 if(err){
     console.log("Something wrong when updating data!");
 }
res.send("table updated")

  })

});

  app.post("/removetable",isLoggedIn,function (req, res) {
    // console.log(req.body.userid)
      table.remove({_id:req.body.tableid}).then(function(){
      row.remove({tableid:req.body.tableid}).then(function(){
      sharetable.remove({tableid:req.body.tableid}).then(function(){

          res.redirect("/tablesrecord");
          console.log("table deleted")
      })
      })
      })
  });

// launch the app
app.listen(port);
console.log("App running at localhost:3000");

app.get(['/', '/items','/login','*'], function(res, res) {
  res.sendFile(__dirname + '/public/index.html');
})
