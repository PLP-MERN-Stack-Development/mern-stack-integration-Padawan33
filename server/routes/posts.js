const express = require('express');
const router = express.Router();

// Placeholder route to satisfy server.js
// We will add real logic in Task 2
router.get('/', (req, res) => {
    res.send('Posts route is working (placeholder)');
});

module.exports = router;