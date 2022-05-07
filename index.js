const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

//MiddleWares:
app.use(express.json());
app.use(cors());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqcx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const itemCollection = client.db("wmsDb").collection("products");
        await client.connect();
        console.log('DB Connected');
        app.post('/additem',async(req,res)=>{
            const newItem = req.body;
            console.log(newItem);
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })
        app.get('/inventories',async(req,res)=>{
            const query = {};
            const cursor = itemCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        })
        
    }
    finally{
        
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log('Listening to-', port);
})