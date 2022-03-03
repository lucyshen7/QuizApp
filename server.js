// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(
  cookieSession({
    name: 'session',
    keys: ['lighthouse', 'midterm'],
  })
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
const { cookie } = require("express/lib/response");

const homepage = require("./routes/homepage");
const profileRoutes = require("./routes/profile");

const quizRoutes = require("./routes/quiz");
const quizResultsRoutes = require("./routes/quiz_results");

const createRoutes = require("./routes/create");
const loadPublic = require("./routes/load_public");
// const search = require("./routes/search");

app.use("/quizzes", homepage(db));
app.use("/profile", profileRoutes(db));

app.use("/quiz", quizRoutes(db));
app.use("/quiz/results", quizResultsRoutes(db));

app.use("/quizzes", createRoutes(db));
// app.use("/quizzes", quizNewPostRoutes(db));
app.use("/api/public", loadPublic(db)); // sends JSON, so keep the /api

// app.use("/api/quizzes/search", search(db));

// Home page
app.get("/", (req, res) => {
  res.redirect("/quizzes/public");
});

app.get('/login/:id', (req, res) => {
  req.session.user_id = req.params.id; // cookie-session middleware
  res.cookie('user_id', req.params.id); // cookie-parser middleware
  res.redirect('/'); // send the user somewhere
});

// logout
app.get('/logout', (req, res) => {
  req.session = null;
  res.clearCookie("user_id");
  return res.redirect('/');
});

// Helper function used on quiz page to convert question and answer indices to letters
app.locals.indexToLetter = function(index) {
  const map = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  return map[index];
};

app.listen(PORT, () => {
  console.log(`🎉QuizApp listening on port ${PORT}`);
});
