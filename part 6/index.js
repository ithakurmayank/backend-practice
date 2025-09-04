const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    fs.readdir("./files", (err, files) => {
        res.render("index", { files: files });
    });
});

app.post("/create", (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
        if (err) throw err;
        res.redirect('/')
    });
});

app.get("/readfile/:fileName", (req, res) => {
    fs.readFile(`./files/${req.params.fileName}`, "utf-8", (err,data) => {
        if(err) console.log('error reading file', err)
        res.render('readfile',{fileName: req.params.fileName, data})
    })
});

app.listen(3000, () => {
    console.log("running server...");
});
