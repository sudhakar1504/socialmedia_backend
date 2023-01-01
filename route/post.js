import express from 'express';
import { Createpost } from '../controller/Postcontrol.js';
import multer  from'multer';
import path  from 'path';
import { db } from '../db.js';
import jwt  from 'jsonwebtoken';


const router = express.Router();
//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});
function EnsureToken(req,res,next){
    console.log(req.headers["authorization"]);
    const bearerheader = req.headers["authorization"];
    if(typeof bearerheader!='undefined'){
        const bearer = bearerheader.split(' ')[1];
        req.token=bearer;
        next()
    }else{
        res.status(403).json({error:true,message:"Auth token missing or login again"})
    }
}
// router.post('/create',Createpost)
router.post("/create", [EnsureToken,upload.single('image')], (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        jwt.verify(req.token,'secret_key',(err,data)=>{
            if(err) return res.status(403).json({error:true,message:'Verification failed'});
        
            if(data){
             
                  console.log(req.body.title);
        console.log(req.file.filename)
        const q = 'INSERT INTO posts(title,description,url,date_created,user_id) VALUES(?)';
        const values = [req.body.title,req.body.desc,req.file.filename,new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),data?.id]
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(409).json({error:true,message:"File uploaded failed"});

            if(data) return res.status(200).json({error:false,message:"Post created successfully"})
        })
            }
        })
      
    }
});

router.post('/edit_post',[EnsureToken,upload.single('image')],(req,res)=>{
    console.log(req.body.title);
    // console.log(req.file.filename)
    console.log(req.body.desc)
    console.log(req.body.post_id)
    if (!req.file) {
        console.log("No file upload");

        jwt.verify(req.token,'secret_key',(err,data)=>{
            if(err) return res.status(403).json({error:true,message:'Verification failed'});
        
            if(data){
                const q = 'UPDATE posts SET  title = ?,description=?,date_created=?,user_id=? WHERE id = ?';
                const values = [req.body.title,req.body.desc,new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),data?.id,req.body.post_id]
                db.query(q,values,(err,data)=>{
                    if(err) return res.status(409).json({error:true,message:"File uploaded failed"});
        
                    if(data) return res.status(200).json({error:false,message:"Post updated successfully"})
                })
            }})

      
    } else {
        jwt.verify(req.token,'secret_key',(err,data)=>{
            if(err) return res.status(403).json({error:true,message:'Verification failed'});
        
            if(data){
             
                  console.log(req.body.title);
        console.log(req.file.filename)
        const q = 'UPDATE posts SET  title = ?,description=?,url=?,date_created=?,user_id=? WHERE id = ?';
        const values = [req.body.title,req.body.desc,req.file.filename,new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),data?.id,req.body.post_id]
        db.query(q,values,(err,data)=>{
            if(err) return res.status(409).json({error:true,message:"File uploaded failed"});

            if(data) return res.status(200).json({error:false,message:"Post updated successfully"})
        })
            }
        })
      
    }
})

router.get('/posts',EnsureToken,(req,res)=>{

jwt.verify(req.token,'secret_key',(err,tokendata)=>{
    if(err) return res.status(403).json({error:true,message:'Verification failed'});

    if(tokendata){
       console.log('tokendata id');
       console.log(tokendata.id);
            const q = 'SELECT * FROM posts';
    db.query(q,(err,data)=>{
        if(err) return res.status(400).json({error:true,message:"something went wrong"});
let Postdata= [];
if(data.length){
    for (let i = 0; i < data.length; i++) {
        Postdata.push({
            id:data[i].id,
            title:data[i].title,
            desc:data[i].description,
            url:"https://social-media-be.onrender.com/images/"+ data[i].url,
            date:data[i].date_created,
            is_edit:tokendata.id == data[i].user_id ? true:false
        })
    }
}
        if(data) return res.status(200).json({error:false,message:"Post data",data:Postdata})
    })
    }
})



})


router.post('/delete',EnsureToken,(req,res)=>{
    jwt.verify(req.token,'secret_key',(err,tokendata)=>{
        if(err) return res.status(403).json({error:true,message:'Verification failed'});
    
        if(tokendata){
const q = 'DELETE FROM posts WHERE id = (?)';
db.query(q,[req.body.post_id],(err,data)=>{
    if(err) res.status(409).json({error:true,message:err})

    if(data){
        res.status(200).json({error:false,message:'Deleted successfully'})
    }
})
        } 
    })
})

router.post('/getpost',EnsureToken,(req,res)=>{
     jwt.verify(req.token,'secret_key',(err,tokendata)=>{
        if(err) return res.status(403).json({error:true,message:'Verification failed'});
    
        if(tokendata){

            const q = 'SELECT * FROM posts WHERE id = (?)';
            db.query(q,[req.body.post_id],(err,data)=>{
        if(err) return res.status(403).json({error:true,message:'Something went wrong'});

        if(data){
            let Postdata= [];
if(data.length){
    for (let i = 0; i < data.length; i++) {
        Postdata.push({
            id:data[i].id,
            title:data[i].title,
            desc:data[i].description,
            url:"http://localhost:8800/images/"+ data[i].url,
            date:data[i].date_created,
            is_edit:tokendata.id == data[i].user_id ? true:false
        })
    }
}
            res.status(200).json({error:false,message:"Get post successfully",data:Postdata})
        }

            })
        }})
})

export default router;