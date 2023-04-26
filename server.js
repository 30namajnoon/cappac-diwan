const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const app = express();
const multer = require("multer");
const readExelFiele = require("read-excel-file/node");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cd) => {
      cd(null, "./files");
    },
    filename: (req, file, cd) => {
      cd(null, file.originalname);
    },
  }),
});
const pdp = path.join(__dirname, "./public");
const cors = require("cors");
app.use(cors());
app.use(express.static(pdp));
const port = process.env.PORT || 4000;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`server is up on port ${port}!`);
});

app.post("/dataDownload", upload.single("file"), (req, res) => {
  readExelFiele(`./files/${req.file.originalname}`).then((rows) => {
    res.send(rows);
  });
});
