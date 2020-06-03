let express = require('express');
let app= express();
var exphbs  = require('express-handlebars');
let bodyParser = require('body-parser');
let passport = require('passport');
let path = require('path');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const adminSwaggerDocument = require('./swaggeradmin.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/admin-docs',swaggerUi.serve, swaggerUi.setup(adminSwaggerDocument));
let cors=require('cors');
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(cors());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.unsubscribe(fileUpload()); 
app.use('/public',express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
//dbConnection
require('./model/connection');

//api routes
let home = require('./routes/api/home');
app.use('/api',home);
//api routes ends

//admin routes
let adminHome= require('./routes/admin/home');
app.use('/admin',adminHome);
//admin routes ends
require('./config/passport')(passport);
let port = process.env.PORT;
app.listen(port,()=>console.log(`Listening On Port ${port}`));