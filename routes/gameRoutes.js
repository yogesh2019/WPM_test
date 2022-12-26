const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/game', (req, res)=> {
    console.log(__dirname);
    res.status(200).json({message: 'signed'});
});

module.exports = router;