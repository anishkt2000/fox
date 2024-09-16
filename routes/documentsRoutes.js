const Router =require('express');
const { uploadDocs, deleteFile,getAllDocsController, getDocsController } = require('../controller/DocsController.js');
const router = Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.delete('/deleteDocs',deleteFile);
router.post('/uploadDocs', upload.single('pdf'), uploadDocs);
router.get('/getAllDocs', getAllDocsController);
router.get('/getDocs/:id', getDocsController);

module.exports = router;

