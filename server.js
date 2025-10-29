const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
require("dotenv").config();
const userRouter = require("./routes/userRouter");

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_CONNECT)
.then(() => {
    console.log("Connected to DB!");
})
.catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"), {index: "login.html"}));

app.use('/api', userRouter);

  

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});