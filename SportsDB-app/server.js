const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const searchRouter = require('./routes/search');
const config = require('./config.json');
const historyRouter = require('./routes/history');
const port = 8888;

const app = express();
const mongoURL = `mongodb+srv://${config.username}:${config.password}@cluster0.jhsbzxg.mongodb.net/?retryWrites=true&w=majority`;

MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Mongo DB');
    const db = client.db(config.database_name);
    app.locals.db = db;
  })
  .catch(error => console.error(error));

app.use(express.json());
app.use('/search', searchRouter);
app.use('/history', historyRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
