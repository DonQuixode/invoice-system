const  express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) =>{
    res.send('Welcome to Invoice System')
});

require("./app/routes/routes.js")(app);

app.listen(PORT, () =>{
    console.log(`Node running on port ${PORT}`)
});