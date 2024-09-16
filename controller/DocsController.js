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

      const filePath = path.join(__dirname, '..', file.path);
      const fileData = fs.readFileSync(filePath);

      const data = await pdf(fileData);
      const pdfText = data.text;
      const txtFilename = `${originalName}.txt`;
      const txtFilePath = path.join(uploadedFileDir, txtFilename);

      const existingDoc = await Docs.findOne({ department: department, docs_name: txtFilename });

      if (existingDoc) {
        fs.unlinkSync(filePath); 
        return res.status(409).json({
          message: 'A document with this filename already exists for the given department.',
          department: department,
          filename: txtFilename
        });
      }
      fs.writeFileSync(txtFilePath, pdfText);
      fs.unlinkSync(filePath);

      
      const newDocument = await Docs.create({ department: department, docs_name: txtFilename });
  
      res.status(200).json({
        message: 'PDF uploaded and converted to text successfully.',
        department: department,
        filename: txtFilename
      });
    }catch(err){res.status(500).send("An error occurred while uploading the PDF.");}
  }
const deleteFile = async(req, res) => {
  const { filename, department } = req.body;
  const filePath = path.join(uploadedFileDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found.');
  }

  try {
    fs.unlinkSync(filePath);
    const deletedDoc = await Docs.findOneAndDelete({ docs_name: filename, department: department });

    if (!deletedDoc) {
      return res.status(404).send('Document not found in the database.');
    }

    res.send('File and document deleted successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while deleting the file.');
  }
};
const getDocsController = async (req, res) => {
  try {
    const { department } = req.params;
    const docs = await Docs.find({ department });
    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving documents.' });
  }
};
const getAllDocsController =async (req, res) => {
  try {
    const { email } = req.params; 
    const chats = await Chats.find({ email }).select('document_name'); 
    if (!chats.length) {
      return res.status(404).json({ message: 'No documents found for this email.' });
    }
    const documentNames = chats.map(chat => chat.document_name);

    res.status(200).json({ documentNames });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  uploadDocs,
  deleteFile,
  getAllDocsController,
  getDocsController,
};