const express = require('express');
const router = express.Router();
const api = require('../../cdnjs-module/api.js');

router.get('/', async (req, res) => {
  const keyword = req.query.keyword;
  const results = await api.searchPlayers(keyword);

  const searchResults = results.map(player => ({
    id: player.idPlayer,
    display: `${player.strPlayer} (${player.strTeam} - ${player.strSport})`
  }));

  const historyCollection = req.app.locals.db.collection('history');
  const currentDate = new Date();

  historyCollection.updateOne(
    { searchTerm: keyword },
    {
      $set: { lastSearched: currentDate },
      $inc: { searchCount: searchResults.length },
      $setOnInsert: { searchTerm: keyword, selections: [] }
    },
    { upsert: true }
  );

  res.status(200).json({
    searchTerm: keyword,
    results: searchResults
  });
});

router.get('/:id/details', async (req, res) => {
  const id = req.params.id;
  const searchTerm = req.query.searchTerm;
  const details = await api.lookUpId(id);

  const historyCollection = req.app.locals.db.collection('history');

  historyCollection.updateOne(
    { searchTerm: searchTerm },
    {
      $push: {
        selections: {
          id: details.idPlayer,
          display: `${details.strPlayer} (${details.strTeam} - ${details.strSport})`
        }
      }
    }
  );

  res.status(200).json(details);
});

module.exports = router;
