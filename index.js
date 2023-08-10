const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());  

const uri = process.env.ATLAS_URI;
mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// Create a Mongoose schema and model
const projSchema = new mongoose.Schema({
    title: String,
    discription: String,
    image: String,
    links: Array
});
  
const Proj = mongoose.model('Proj', projSchema);
  

// Create a new proj
app.post('/new_proj', async (req, res) => {
  try{
    const { title, discription, image, links } = req.body;
    const newProj = new Proj({ title, discription, image, links } );
    res.status(200).json(await newProj.save())
  }
  catch(err) {
    res.status(500).json({ error: 'Failed to create a new proj' })
  }
});
  
// Get all projs
app.get('/all_projs', async (req, res) => {
    res.status(200).json(await Proj.find())
});

// Get a proj
app.get('/proj/:id', async (req, res) => {
  const id = req.params.id
  res.status(200).json(await Proj.findById(id))
});
  
// Update a proj by ID
app.put('/update_proj/:id', async (req, res) => {
  try{  
  const projID = req.params.id
    const { title, discription, image, links }  = req.body

    const proj = Proj.findById(projID)

    res.status(200).json(await proj.updateOne({title, discription, image, links}))
  
  }
  catch(err){
  res.status(500).json('Failed to update the proj')
  }
});
  
// Delete a proj by ID
app.delete('/delete_proj/:id', async (req, res) => {
  try{
    const projID  = req.params.id;
  
    const proj = Proj.findById(projID)

    res.status(200).json(await proj.deleteOne())
  
  }
  catch(err){
  res.status(500).json('Failed to delete the proj')
  }    
});

app.get('/', (req, res) => {
    res.status(200).send("Portfolio Server is Up & Running!")
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});