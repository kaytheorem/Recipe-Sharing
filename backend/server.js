// Importing required modules
const express = require('express');
const cors = require('cors');
const connection = require("./db");

const app = express();
// Define a port for the server to listen on
const PORT =       process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Define routes

app.post("/addRecipe",(req,res)=>{
    const {name ,   description} = req.body;
    
    const query = 'INSERT INTO recipes (name, description) VALUES (?, ?)';
    connection.query(query, [name, description], (error, results) => {
        if (error) {
            console.error('Error inserting data:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Recipe added successfully',     recipeId: results.insertId });
    }); 
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
