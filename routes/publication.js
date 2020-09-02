

const express = require('express'); 
const router = express.Router(); 
const publicationCtrl = require('../controllers/publication'); 
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); 


// ROUTES //

// POST //
router.post ('/', auth, multer, publicationCtrl.createPublication); 

// GET //
router.get('/', auth, publicationCtrl.getAllPublication); 


// GET SELECTION //
router.get('/selection', auth, publicationCtrl.getSelection);

// GET ONE //
router.get('/:id', auth,  publicationCtrl.getOnePublication); 

// PUT MODERATEUR //
router.put('/select/:id', auth, publicationCtrl.selectPublication); 


// EXPORT //

module.exports = router;


