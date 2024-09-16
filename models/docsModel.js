const mongoose =require("mongoose")

const docsSchema =  new mongoose.Schema({
    department:{
        type: String,
        // enum: ['HR', 'Engineer', 'Senior Developer', 'Director'],
        //HR FINANCE IT DEVELOPENT SERVICE
        required:true
    },
    docs_name:{
        type: String,
        required:true
    }
    
});
module.exports = mongoose.model("Docs", docsSchema);