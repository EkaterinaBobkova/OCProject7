

const express = require('express'); 
const router = express.Router(); 
const likeCtrl = require('../controllers/like'); 
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); 


// ROUTES //

// POST //
router.post ('/:id', auth, multer, likeCtrl.reactPublication); 




// EXPORT //

module.exports = router;