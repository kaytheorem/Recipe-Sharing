// Importing required modules
const express = require("express");
const cors = require("cors");
const connection = require("./db");

const app = express();
// Define a port for the server to listen on
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Define routes

app.post("/addRecipe", (req, res) => {
  const { name, description } = req.body;

  const query = "INSERT INTO recipes (name, description) VALUES (?, ?)";
  connection.query(query, [name, description], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json({
      message: "Recipe added successfully",
      recipeId: results.insertId,
    });
  });
});

app.get("/recipe", (req, res) => {
  connection.query("SELECT * FROM recipes", (error, result) => {
    if (error) throw error;
    res.status(200).json(result);
  });
});

//delete from database
app.delete(`/delete`, (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  connection.query(
    `SELECT * FROM recipes WHERE id = ?`,
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Database query error" });
      }
      if (results.length > 0) {
        //delete id that matches client id button
        connection.query(`DELETE FROM recipes WHERE id = ?`, [id], (error) => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Failed to delete the recipe" });
          }
          return res
            .status(200)
            .json({ message: " recipe deleted successfully" });
        });
      } else {
        return res.status(404).json({ message: "ID not found" });
      }
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
