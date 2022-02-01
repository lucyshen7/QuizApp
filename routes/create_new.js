/*
 * All routes for quizzes are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

//comeback to work on

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/new", (req, res) => {
    let query = ``;
    console.log(query);
    db.query(query)
      .then(data => {
        const quizzes = data.rows;
        const user_id = req.session.user_id;
        const templateVars = {
          user: user_id,
          quizzes: quizzes
        }
        res.render("new_quiz", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

