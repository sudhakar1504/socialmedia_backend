import express from 'express';
import {db} from './db.js';
import Auth from './route/auth.js';
import Post from './route/post.js';
import cors from 'cors'
import bodyParser  from'body-parser'

const app = express();
// app.use(express.static('public')); 
app.use('/images', express.static('images'));

app.use(express.json())
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())

app.use('/api/auth',Auth)
app.use('/api/post',Post)
app.listen(8800,()=>{
    console.log('connected');
})

