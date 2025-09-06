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
        res.render("index", { files: files, fileToEdit: null });
    });
});

app.post("/create", (req, res) => {
    fs.writeFile(
        `./files/${req.body.title.split(" ").join("")}.txt`,
        req.body.details,
        (err) => {
            if (err) throw err;
            res.redirect("/");
        }
    );
});

app.get("/readfile/:fileName", (req, res) => {
    fs.readFile(`./files/${req.params.fileName}`, "utf-8", (err, data) => {
        res.render("readfile", { fileName: req.params.fileName, data });
    });
});

app.get("/editfile/:fileName", (req, res) => {
    fs.readdir("./files", (err, files) => {
        fs.readFile(`./files/${req.params.fileName}`, (err, data) => {
            res.render("index", {
                files,
                fileToEdit: { fileName: req.params.fileName, data },
            });
        });
    });
});

app.get("/deletefile/:fileName", (req, res) => {
    fs.unlink(`./files/${req.params.fileName}`, (err) => {
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("running server...");
});
