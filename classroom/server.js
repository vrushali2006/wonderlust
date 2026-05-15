const express = require("express");
const app = express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const session=require("express-session")

// app.get("/",(req,res)=>{
//     res.send("hi,i am root");
// })
// app.use("/users",users);
// app.use("/posts",posts);

app.use(session())

app.listen(3000,()=>{
    console.log("server is listening");
});