const path =require('path');
const fs =require('fs');
const pdf =require('pdf-parse');
const Docs =require('../models/docsModel.js');
const uploadedFileDir = path.join(__dirname, '../uploaded_file');
if (!fs.existsSync(uploadedFileDir)) {
  fs.mkdirSync(uploadedFileDir);
}

const uploadDocs =async(req,res)=>{
  try{
    const file = req.file;
    const { department } = req.body;
      if (!file) {
        return res.status(400).send('No PDF file uploaded.');
      }
      if (!department || !['HR', 'Engineer', 'Senior Developer', 'Director'].includes(department)) {
        return res.status(400).send('Invalid department.');
      }
      const originalName = path.parse(file.originalname).name;
      const newDocument = new Docs({
        department: department,
        docs_name: originalName, 
      });
      
      await newDocument.save();
      const filePath = path.join(__dirname, '..', file.path);
      const fileData = fs.readFileSync(filePath);

      const data = await pdf(fileData);
      const pdfText = data.text;
      const txtFilename = `${newDocument._id}.txt`;
      const txtFilePath = path.join(uploadedFileDir, txtFilename);

      fs.writeFileSync(txtFilePath, pdfText);
      fs.unlinkSync(filePath);
      newDocument.docs_name = txtFilename;
      await newDocument.save();
      
   
      res.status(200).json({
        message: 'PDF uploaded and converted to text successfully.',
        department: department,
        filename: `${originalName}.txt`,
        documentId: newDocument._id,
      });
    }catch(err){res.status(500).send("An error occurred while uploading the PDF.");}
  }
const deleteFile = async(req, res) => {
  const documentId =req.body.documentId;
  if(!documentId){
    return res.status(400).send('Document ID is required.');
  }
  try {
   
  const doc = await Docs.findById({ _id: documentId });
 
  if (!doc) {
    return res.status(404).send('Document not found in the database.');
  }
  
  const { docs_name, department } = doc;
 
  const filePath = path.join(uploadedFileDir, docs_name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found.');
  }

  
    fs.unlinkSync(filePath);
    const deletedDoc = await Docs.findOneAndDelete({ _id: documentId });
    if (!deletedDoc) {
      return res.status(404).send('Document not found in the database.');
    }

    res.send('File and document deleted successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while deleting the file.');
  }
};
const getDocsByDeptController = async (req, res) => {
  try {
    const department = req.body.department;
    const docs = await Docs.find({ department });
    
    res.send(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving documents.' });
  }
};
const getAllDocsController =async(req, res)=>{
  try{
    const docs = await Docs.find();
    res.send(docs);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving documents.' });
  }
}

module.exports = {
  uploadDocs,
  deleteFile,
  getDocsByDeptController,
  getAllDocsController,
};