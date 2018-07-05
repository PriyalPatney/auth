var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongoose://localhost:27017/auth_demo", { useNewUrlParser: true });


app.set('view engine', 'ejs');

app.use(require("express-session")({
    secret: "dont tell ay",
    resave: false,
    saveUninitialized: false
}));
// passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); //encoder decoder

//routes

app.get("/", function(req,res){
    res.send("home");
});

app.get("/secret", function(req,res){
    res.send("secretres");
});

//auth routes
app.get("/register", function(req,res){
    res.render("register");
});
//user signup
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        console.log(user);

        passport.connect("local")(req, res, function(){
           res.render("/secret");
        });
    });
});
app.listen(3000, function(){
    console.log("auth server is up!!");
});