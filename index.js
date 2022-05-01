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
        const collection = client.db("wmsDb").collection("products");
        await client.connect();
        console.log('DB Connected');

    }
    finally{
        
    }
}
run().catch(console.dir);

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('MongoDB Connected');
//     // perform actions on the collection object
//     client.close();
// });


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log('Listening to-', port);
})