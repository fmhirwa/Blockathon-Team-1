const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()

const sessConfig = {
    secret: 'well some really hard to decipher text kgl 250 @4313ir1jdjnfb239rhj2',
    cookie: {}
}


app.use(session(sessConfig))

const port = 3000

let miniDb = {}

app.use(express.static('public')); // everything in the public directory is public

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
})


app.post('/signup', (req, res) => {
    // unsafe signup starts here: passwords need to be hashed and saved to db for real world apps.
    // minidb will clear itself everytime you restart the server.
    let username;
    if (req.body.username)
        username = req.body.username.trim();
    const password = req.body.password;
    if (!username || !password) return res.status({ message: "Missing required fields." }).json(400);

    miniDb[username] = {
        name: "",// you can define a name field and save the data posted here.
        // you can save a bunch of stuff on this object using key: username.
        password
    };

    return res.status({ username }).json(201);

})
app.post('/signin', (req, res) => {
    console.log("is this it: ", req.body)
    // unsafe signin starts here: passwords need to be hashed and saved to db for real world apps.
    // minidb will clear itself everytime you restart the server.
    let username;
    if (req.body.username)
        username = req.body.username.trim();
    const password = req.body.password;
    if (!username || !password) return res.status(400).json({ message: "Missing required fields." });
    if (!miniDb[username]) return res.status(401).json({ message: "User not found" });
    if (miniDb[username].password != password) return res.status(401).json({ message: "Wrong password!" });

    // persist the session
    req.session.username = username; // this allows us to know which user is logged in.

    return res.status(200).json({ username });
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    return res.json({});
})

app.get('/user', (req, res) => { // check currently logged in user
    return res.json({ username: req.session.username });
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})