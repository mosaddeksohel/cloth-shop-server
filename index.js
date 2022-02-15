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
        const userCollection = database.collection('users')
        const rattingCollection = database.collection('ratting')
        const orderCollection = database.collection('orders')

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



        // GET single products
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log(req.params)
            const product = await productCollection.findOne(query)
            res.send(product)
        })

        // Order send to server
        app.post('/orders', async (req, res) => {
            const order = req.body;
            order.status = 'pending';
            const result = await orderCollection.insertOne(order)
            console.log(result);
            res.json(result)
        });


        // RATING sent to server
        app.post('/ratting', async (req, res) => {
            const ratting = req.body;
            const result = await rattingCollection.insertOne(ratting);
            res.json(result);
        });
        // Rating get to UI
        app.get('/ratting', async (req, res) => {
            const cursor = rattingCollection.find({});
            const ratting = await cursor.toArray();
            res.json(ratting);
        });


        // Change status
        app.put('/modified/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log(req.params)
            const options = { upsert: true }
            const updatedDoc = {
                $set: { status: 'approved' }
            }
            const result = await orderCollection.updateOne(query, updatedDoc, options);
            res.json(result)
        });



        // GET all orders
        app.get('/allOrders', async (req, res) => {
            const cursor = orderCollection.find({});
            const product = await cursor.toArray();
            res.send(product)
        })

        // GET admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // POST user 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result)
            console.log(result)
        });

        // UPDATE user role
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result)
        });



        // get orders based on user email.
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders)
        });


        /// delete order

        app.delete("/deleteOrder/:id", async (req, res) => {
            console.log(req)

            const result = await orderCollection.deleteOne({ _id: ObjectId(req.params.id) });
            console.log(req.params.id)
            res.send(result);
        });



        // Status update
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedUser.name,
                    note: updatedUser.note
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        // delete user order using id 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result);
        });





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