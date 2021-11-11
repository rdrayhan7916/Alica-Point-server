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


        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
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