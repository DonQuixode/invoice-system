const appConfig = require('./app/config/app-config.js');
const  express = require('express');
const session = require('express-session');
const app = express();
const PORT = appConfig.port;

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(
    session({
      secret: appConfig.session_key,
      resave: true,
      saveUninitialized: true
    })
  );

app.get('/', (req, res) =>{
    res.send('Welcome to Invoice System')
});

require("./app/routes/routes.js")(app);

app.listen(PORT, () =>{
    console.log(`Node running on port ${PORT}`)
});