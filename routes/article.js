

const express = require('express'); 
const router = express.Router(); 
const articleCtrl = require('../controllers/article'); 
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); s


// ROUTES //

// POST //
router.post ('/', auth, multer, articleCtrl.createArticle); 

// GET //
router.get('/', auth, articleCtrl.getAllArticle); 


// GET SELECTION //
router.get('/selection', auth, articleCtrl.getSelection);

// GET ONE //
router.get('/:id', auth,  articleCtrl.getOneArticle); 

// PUT MODERATEUR //
router.put('/select/:id', auth, articleCtrl.selectArticle); 


// EXPORT //

module.exports = router;


