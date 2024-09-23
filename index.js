import express from "express";

const port = 3000;
const app = express();

// Set up the view engine for rendering 
app.set("view engine", "ejs");

app.get("/generateMeal", (req, res) => {
    res.render("randomMeal.ejs");
});

// Rendering homepage on startup
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});