
const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const Connectdb = () =>
{
    return mongoose.connect("mongodb+srv://rahulr41180:Rahul12345@cluster0.jjbeq.mongodb.net/MongodbRelationshipAssignment?retryWrites=true&w=majority")
}


// Author Schema -->

const AuthorSchema = new mongoose.Schema({
    first_name : {type : String, required : true},
    last_name : {type : String, required : false},
},
{
    
    versionKey : false,
    timestamps : true,
})




app.listen(4600, async() =>
{
    try
    {
        await Connectdb();

        console.log("listening on port 4600");
    }
    catch(error)
    {
        console.log("error : ", error);
    }
})