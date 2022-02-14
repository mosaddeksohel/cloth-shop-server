const express = require('express');
const { MongoClient } = require('mongodb');

const cors = require('cors');

const app = express();

require('dotenv').config()

const port = process.env.PORT || 5000;


// middle wiew 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.10dvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("clothShop");
        const productCollection = database.collection("products");

        // Post Products
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            console.log(result)
            res.json(result)
            // console.log(result);
        })





    } finally {
        await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log('Running the server on the port', port);
})