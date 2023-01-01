import {db} from '../db.js';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
export const Register = async(req,res)=>{

    // CHECK USER IS ALREADY EXISTIST
    const q = 'SELECT * FROM user WHERE username = ?';
    db.query(q,[req.body.username],async(err,data)=>{
        if(err) return res.json(err);
        if(data.length) return res.status(409).json({error:true,message:"user already created"});

 const q = 'INSERT INTO user (name, username, password)  VALUES (?)';
    const postdata = req.body;
    // var salt = bcrypt.genSaltSync(10);
    const hash =await bcrypt.hash(postdata.password,13);
                const values = [postdata.name,postdata.username,postdata.password];
                db.query(q,[values],(err,data)=>{
                    if(err) return res.json(err);
var token = jwt.sign({ id: data?.insertId }, 'secret_key');

                    res.status(200).json({error:false,message:"user created successfully",token:token})
                })
       
    })
    // console.log(req);
   
   
}
export const Login = (req,res)=>{
// CHECK USER IS ALREADY EXISTIST
const q = 'SELECT * FROM user WHERE username = ?';
db.query(q,[req.body.username],async(err,data)=>{
    if(err) return res.json(err);
    if(data.length==0) return res.status(409).json({error:true,message:"user not found"});

    if(data.length == 1){
console.log(data[0].password);
        // const ispassword =await bcrypt.compare(req.body.password, data[0].password);
        const ispassword = req.body.password?.match(data[0].password);
        
        if(ispassword){
console.log('successfully');

var token = jwt.sign({ id: data[0].id }, 'secret_key');


return res.status(200).json({error:false,message:"login successfully",token:token})
        }else{
            return res.status(409).json(data)
        }
    }

});
}