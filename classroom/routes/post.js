const express=require("express");
const router=express.Router();

//Index-post
router.get("/",(req,res)=>{
    res.send("get for post");
});

//show -post
router.get("/:id",(req,res)=>{
    res.send("get for post id");
});

//post- post

router.post("/",(req,res)=>{
    res.send("post for posts");
});

//delete -post
router.delete("/:id",(req,res)=>{
    res.send("delete for post id");
});

module.exports=router;