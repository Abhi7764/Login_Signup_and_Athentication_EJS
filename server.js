const express=require("express");
const session=require("express-session");
const cookieparser=require("cookie-parser");
const app=express();
const path=require("path");
const fs=require("fs");
app.use(express.urlencoded({extended:true}));
//app.use(express.static("public"));
app.set("view engine","ejs");
app.use(cookieparser());

let oneday=1000*60*60*24;
app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:"dsmgf%dweiu&*3ddd",
    cookie:{maxAge:oneday}
}));

app.get("/",(req,res)=>{
    if(req.session.username){
        res.redirect("/dashboard");
    }
    else
        res.render("home");
})

app.get("/login",(req,res)=>{
    if(req.session.username)
        res.redirect("/dashboard");
    else
    res.render("login",{message:""});
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})

const userroutes=require("./routing/userroutes");
const adminroutes=require("./routing/adminroutes");

app.use("/admin",admintest,adminroutes);
app.use("/users",usertest,userroutes);

function admintest(req,res,next){
    console.log("Admin side")
    if(req.session.name=="Admin"){
        next();
    }
    else{
        res.redirect("/");
    }
}

function usertest(req,res,next){
    if(req.session.username){
        next();
    }
    else{
        res.redirect("/login");
    }
}

app.get("/dashboard",(req,res)=>{
    if(req.session.username){
        res.render("dashboard",{name:req.session.name});
    }
    else{
        res.redirect("/login");
    }
})

app.post("/Login",(req,res)=>{
    fs.readFile("users.txt","utf-8",(err,data)=>{
        let records=JSON.parse(data);
        let results=records.filter((item)=>{
            if(item.username==req.body.username && item.password==req.body.password){
                return true;
            }
        })
             
        if(results.length==0){
            // res.send("Invalid Username/Password");
            // res.redirect('/Login');
            res.render("login",{message:"Invalid Username/Password"})
        }
        else{
            // res.send("Login Successfully....");
            req.session.username=req.body.username;
            req.session.name=results[0].name;
            //console.log(results[0].name)
            res.redirect("/dashboard");
        }
    })
})

app.post("/Signup",(req,res)=>{
    fs.readFile("users.txt","utf-8",(err,data)=>{
        let records=JSON.parse(data);
        let results=records.filter((item)=>{
            if(item.username==req.body.username){
                return true;
            }
        })
        if(results.length==0){
            let obj={};
            obj.name=req.body.name;
            obj.username=req.body.username;
            obj.password=req.body.password;
            records.push(obj)
            fs.writeFileSync("./users.txt",JSON.stringify(records));
            //res.send("Your Account Created Successfully....")
            res.redirect("/Login")
        }
        else{
            //res.send("Account Already Exits");
            res.redirect("/Login")
        }
    })
})

app.listen(3000,(err)=>{
    console.log("Server Started....");
})