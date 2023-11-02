const express=require("express");
const app=express();
const router=express.Router();

router.get("/update",(req,res)=>{
    res.send("Admin Update Profile");
})
router.get("/deleteUser",(req,res)=>{
    res.send("Admin Delete Profile");
})
module.exports=router;