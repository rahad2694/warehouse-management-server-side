const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require ('jsonwebtoken');

const app = express();

//MiddleWares:
app.use(express.json());
app.use(cors());


//MongoDb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqcx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const itemCollection = client.db("wmsDb").collection("products");
        await client.connect();
        console.log('DB Connected');
        // app.post('/additem', async (req, res) => {
        //     const newItem = req.body;
        //     console.log(newItem);
        //     const result = await itemCollection.insertOne(newItem);
        //     res.send(result);
        // })


        app.post('/additem', async (req, res) => {
            const newItem = req.body;
            const accessTokenInfo = req.headers.authorization;
            const [email, accessToken] = accessTokenInfo.split(' ');
            const decodedEmail = verifyToken(accessToken);
            if (email === decodedEmail) {
              const result = await itemCollection.insertOne(newItem);
              res.send(result);
            } else {
              res.send({ error: '403 ! Access Forbidden' });
            }
        })


        app.get('/inventories', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        })
        app.get('/myinventories', async (req, res) => {
            const email = req.query;
            const query = { email: email.email };
            const cursor = itemCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        })
        app.get('/homeinventories', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const inventories = await cursor.limit(6).toArray();
            res.send(inventories);
        })
        app.get('/iteminfo/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const info = await itemCollection.findOne(query);
            // console.log(info);
            res.send(info);
        })
        app.put('/updateinfo/:id', async (req, res) => {
            const id = req.params.id;
            const newInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedItem = {
                $set: newInfo
            };
            const result = await itemCollection.updateOne(filter, updatedItem, options);
            // console.log(result);
            res.send(result);
        })

        app.delete('/ietm/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })


        /* jwt start */


        // generating decoded mail-token during login
        app.post('/login', async (req, res) => {
            const email = req.body;
            console.log(email);
            const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
            res.send({ accessToken });
        });


        // verifying user with access token info
        function verifyToken(accessToken) {
          let email;
          jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
            if (error) {
              email = 'invalid email';
            } else if (decoded) {
              email = decoded.email;
            }
          })
          return email;
        }

    }
    finally {

    }
}
run().catch(console.dir);

//Initial API
app.get('/', (req, res) => {
    res.send('Server is running')
})

//Listening to port
app.listen(port, () => {
    console.log('Listening to-', port);
})