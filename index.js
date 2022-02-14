const express = require('express');

const app = express();

require('dotenv').config()

const port = process.env.PORT || 5000;


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.10dvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("insertDB");
        const productCollection = database.collection("clothShop");







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