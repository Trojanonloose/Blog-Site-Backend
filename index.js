//EXPORTS
const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const multer = require('multer');
const path = require('path');

//ROUTE FILE EXPORTS
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")

//NECCESSARY CONFIGS
dotenv.config(); // to migrate env data into process.env
mongoose.set('strictQuery', true); //to avoid strictquery error
app.use(express.json()); //to allow our app to work with json files/data
app.use("/images", express.static(path.join(__dirname, "/images")));

//DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

//IMAGE STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});

//ROUTES
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)

//Telling heroku to search for static page
if (process.env.NODE_ENV == "production") {
    app.use(express.static("frontend/build"));
};

//STARTING SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend is running at port ${PORT}.`)
})

