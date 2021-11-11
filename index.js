const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v8i8y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()
        const database = client.db('alica-point')
        const productsCollection = database.collection('products')
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('review')


        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        app.post('/addreview', async (req, res) => {
            const user = req.body;
            const result = await reviewCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Alica Point!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})