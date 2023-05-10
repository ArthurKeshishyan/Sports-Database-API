const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const config = require('../config.json');

const mongoURL = `mongodb+srv://${config.username}:${config.password}@cluster0.jhsbzxg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

router.get('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(config.database_name);
        const historyCollection = db.collection('history');

        let history;
        if (req.query.searchTerm) {
            history = await historyCollection.find({ searchTerm: req.query.searchTerm }).toArray();
        } else {
            history = await historyCollection.find({}).toArray();
        }

        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    } finally {
        await client.close();
    }
});

module.exports = router;
