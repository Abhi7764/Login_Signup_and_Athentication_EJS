const express=require("express");
const app=express();
const router=express.Router();

router.get("/history",(req,res)=>{
    res.send("User history");
})
router.get("/profile",(req,res)=>{
    res.send("User Profile");
})
router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login");
})
module.exports=router;