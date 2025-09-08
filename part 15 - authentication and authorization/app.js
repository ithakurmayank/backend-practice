const express = require("express");
const app = express();
const path = require("path");
const cookieparser = require("cookie-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set(express.static(path.join(__dirname, "public")));
app.use(cookieparser());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/create", async (req, res) => {
    const { username, email, password, age } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const createUser = await userModel.create({
        username,
        email,
        password: hash,
        age,
    });
    const token = jwt.sign({ email }, "secretstring");
    res.cookie("token", token);
    res.redirect('/login');
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) res.send("Email or password is incorrect");
    bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
            res.send("Email or password is incorrect");
        }
        const token = jwt.sign({ email }, "secretstring");
        res.cookie("token", token);
        res.send("Logged in successfully");
    });
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
});

app.listen(3000);
