
const { application } = require("express");
const { response } = require("express");
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
    last_name : {type : String, required : false}
},
{
    versionKey : false,
    timestamps : true,
});

const Author1 = mongoose.model("author", AuthorSchema);

// Book Schema -->

const BookSchema = new mongoose.Schema({
    name : {type : String, required : true},
    body : {type : String, required : true},
    AuthorId : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "author",
        required : true,
    }
},
{
    timestamps : true,
    
    versionKey : false,
})

const Book1 = mongoose.model("book", BookSchema);

// Section Schema -->

const SectionSchema = new mongoose.Schema({
    BookId : 
    [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "book",
            required : true,
        },
    ],
},
{
    timestamps : true,
    versionKey : false,
});

const Section1 = mongoose.model("section", SectionSchema);

// Checked Out Schema -->

const CheckedSchema = new mongoose.Schema({

    checkedOutTime : {type : Date, required : false, default : null},
    checkedInTime : {type : Date, required : false, default : null},
    
    user : {type : String, required : true},
    BookId :
    [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "book",
            required : true,
        }
    ],
})

const Checked1 = mongoose.model("checked", CheckedSchema);

// Author CRUD -->

app.post("/authors", (req,res) =>
{
    try
    {
        const Author = await Author1.create(req.body);

        return res.status(201).send({Author : Author});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
});


app.get("/authors", async(req,res) =>
{
    try
    {
        const Author = await Author1.find().lean().exec();

        return res.status(201).send({Author : Author});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
})

// find all books written by an author
app.get("/authors/:AuthorId/books", async(req,res) =>
{
    try
    {
        
        const Books = await Book1.find({AuthorId : req.params.AuthorId})
        .populate({path : "AuthorId", select : {first_name : 1, last_name : 1, _id : 0}})
        .lean().exec();

        return res.status(200).send({Books : Books});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
})


// Book CRUD -->

app.post("/books", async(req,res) =>
{
    try
    {
        const Book = await Book1.create(req.body);

        return res.status(201).send({Book : Book});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
});


app.get("/books", async(req,res) =>
{
    try
    {
        const Books = await Book1.find()
        .populate({path : "AuthorId", select : {first_name : 1, last_name : 1, _id : 1}})
        .lean().exec();

        return res.status(200).send({Books : Books});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
});

// Section CRUD -->

app.post("/sections", async(req,res) =>
{

    try
    {
        const Section = await Section1.create(req.body);

        return res.status(201).send({Section : Section});
    }
    catch(error)
    {
       return res.status(500).send({message : error.message});

    }
});

app.get("/sections", async(req,res) =>
{
    try
    {
        const Section = await Section1.find()
        .populate({path : "BookId", select : { name : 1, _id : 0}, populate : {path : "AuthorId", select : {first_name : 1, last_name : 1, _id : 0}}})

        .lean()
        .exec();
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
});



app.get("/sections/:AuthorId/books", async(req,res) =>
{
    try
    {
        const Books = await Book1.find({AuthorId : req.params.AuthorId})
        .populate({path : "AuthorId" , select : {first_name : 1, last_name : 1, _id : 0}})
        .lean()
        .exec();

        return res.status(200).send({Books : Books});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
})


app.get("/sections/:SectionId", async(req,res) =>
{
    try
    {
        const Books = await Section1.find({_id  : req.params.SectionId},{checkedOutTime : null, checkedInTime : null})
        .lean().exec();

        return res.status(200).send({Books : Books});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
});

// Checked Out CRUD -->

app.post("/checkeds", async(req,res) =>
{
    try
    {
        const Checked = await Checked1.create(req.body);

        return res.status(201).send({Checked : Checked});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
});

app.get("/checkeds", async(req,res) =>
{
    try
    {
        const Books = await Book1.find({}, [{checkedOutTime : {$not : {$eq : null}}}, {checkedInTime : {$not : {$eq : null}}}])
        
        .lean().exec();

        return res.status(200).send({Books : Books});
    }
    catch(error)
    {
        return res.status(500).send({message : error.message});
    }
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