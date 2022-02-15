const express = require('express');
const { MongoClient } = require('mongodb');

const cors = require('cors');

const app = express();
const ObjectId = require('mongodb').ObjectId;



const port = process.env.PORT || 5000;
require('dotenv').config()



// middle wiew 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://clothShop:ihaeejFczbIcycjK@cluster0.10dvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("clothShop");
        const productCollection = database.collection("products");

        // get products

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })


        // Post Products
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            console.log(result)
            res.json(result)
            // console.log(result);
        })



        // DELETE product API
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result)

        })





    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log('Running the server on the port', port);
})