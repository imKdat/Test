const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require("multer");
const app = express();
const port = 3000;
const crypto=require('crypto')

// Middleware cho static files (CSS, JS, hình ảnh)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
// Cấu hình view engine là Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        const randomName= crypto.randomBytes(8).toString('hex');
        const fileExtension= path.extname(file.originalname);
        cb(null, randomName+fileExtension);
    }
})
const upload = multer({storage: storage});
app.get('/', (req, res) => {
    res.render('index', {title: 'Hey', message: 'Xin chao cac bạn Truong Dai hoc Gia Dinh'})
});
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (username == 'admin' && password == 'admin') {
        res.send('login success');
        return;
    }
    console.log(username, password);
    res.redirect('/upload')
})
app.get('/getUser', (req, res) => {
    console.log(req.query);
    const id = parseInt(req.query.id);
    res.status(200).json({
        id: id,
        username: "ABC",
        age: 20,
    })
})
app.post('/upload', upload.single('file'), (req, res) => {
    const {username, password} = req.body;
    const file = req.file;
    res.send(`userName: ${username}, password: ${password},Uploaded File: ${file.originalname},Saved at:${file.path}`
    )
})
app.get('/upload', (req, res) => {
    res.render('upload');
})
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});