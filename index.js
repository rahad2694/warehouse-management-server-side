const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

//MiddleWares:
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Server is running')
})

app.listen(port,()=>{
    console.log('Listening to-',port);
})