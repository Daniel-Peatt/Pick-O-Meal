import express from "express";
import axios from "axios";

const port = 3000;
const app = express();

// Setting the static files file path to start at public
app.use(express.static("public"));

// Set up the view engine for rendering 
app.set("view engine", "ejs");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.get("/generateMeal", async (req, res) => {
    try {
        
        // Saving the mealType selected to a variable
        const mealType = req.query.mealType;

        // Getting meal list by category
        const resultCategory = await axios.get("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + mealType);
        
        // Generate a random number for random meal selection
        const randomMealNumber = Math.floor(Math.random() * (resultCategory.data.meals.length + 1));

        // Getting meal id based off the randomMealNumber
        const mealId = resultCategory.data.meals[randomMealNumber].idMeal;

        // Using the random mealId to retrieve meal based of category.
        const result = await axios.get("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId); 

        // Logic for loading randomMeal.ejs

        // Saving list of ingredients dynamically
        let i = 1;
        let checkIng = result.data.meals[0]["strIngredient" + i];
        let checkArrIng = [];
        while(checkIng)
        {
            checkArrIng[i - 1] = checkIng;
            i++;
            checkIng = result.data.meals[0]["strIngredient" + i];
        }

        // Saving list of measurments dynamically
        let m = 1;
        let check = result.data.meals[0]["strMeasure" + m];
        let checkArr = [];
        while(check)
        {
            checkArr[m - 1] = check;
            m++;
            check = result.data.meals[0]["strMeasure" + m];
            
        }

        // Splitting up instructions by new line
        const instructionsArray = result.data.meals[0]["strInstructions"].split(/\r?\n|\r/);

        // Reformats the URL to play with iframe
        let youTubeLink = result.data.meals[0].strYoutube;
        if (youTubeLink.includes('watch?v=')) {
            youTubeLink = youTubeLink.replace('watch?v=', 'embed/');
        }

        // Loading webpage
        res.render("randomMeal.ejs", {
            meals : result.data.meals[0], 
            ingredients: checkArrIng,
            measurements: checkArr,
            instructions : instructionsArray,
            youTubeLink : youTubeLink
        });
    } catch (error) {
        res.render("index.ejs");
        console.log("error loading page");
    }
});

// Rendering homepage on startup
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});