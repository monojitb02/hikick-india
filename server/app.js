'use strict';
var lib = require('./lib'),
    router = require('./router'),
    jobScheduler = require('./api/cronjob'),
    server = lib.config.server,
    app = lib.express(),
    message = lib.message,
    bodyParser = lib.bodyParser,
    expressSession = lib.expressSession,
    cookieParser = lib.cookieParser;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.status(200).end();
    } else {
        next();
    }
});

app.use(cookieParser());
app.use(expressSession({
    secret: 'mYsEcReTkEy',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use("/", lib.express.static("./public"));

router(app);
lib.mongoose.connect(lib.config.db);
app.listen(server.port, function() {
    console.log("Listening on: " + server.host + ":" + server.port);
});
