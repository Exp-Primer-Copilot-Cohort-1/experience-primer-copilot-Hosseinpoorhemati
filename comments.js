// create web server
// use express framework
var express = require('express');
var app = express();
// use body parser middleware to get data from POST request
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// use express-session middleware to manage session
var session = require('express-session');
var FileStore = require('session-file-store')(session);
app.use(session({
    secret: 'asdasdasdasdasd',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
// use mysql module
var mysql = require('mysql');
// create mysql connection pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test'
});
// use passport module
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
// create passport strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        pool.query('select * from user where username=?', [username], function (err, results) {
            if (err) {
                done(err);
            } else {
                if (results.length === 0) {
                    done(null, false);
                } else {
                    var user = results[0];
                    if (username === user.username && password === user.password) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                }
            }
        });
    }
));
// serialize and deserialize user
passport.serializeUser(function (user, done) {
    done(null, user.username);
});
passport.deserializeUser(function (username, done) {
    pool.query('select * from user where username=?', [username], function (err, results) {
        if (err) {
            done(err);
        } else {
            var user = results[0];
            done(null, user);
        }
    });
});
// setup static directory
app.use(express.static('public'));
// setup view engine
app.set('views', './views');
app.set('view engine', 'ejs');
// setup routes
app.get('/', function (req, res) {
    res.redirect('/comments');
});
app.get('/comments', function (req, res) {
    pool.query('select * from comment order