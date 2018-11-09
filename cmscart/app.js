var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

mongoose.connect(config.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongo");
});


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//express sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//set global errors
app.locals.errors = null;

//express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//set routes
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');

app.use('/', pages);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);

var port = 3000;
app.listen(port, function(){
	console.log('Server started on port' + port);
});


