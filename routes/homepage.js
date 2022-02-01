const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/public", (req, res) => {
    let query = `SELECT name, id FROM quizzes WHERE public = true;
    `;
    console.log(query);
    db.query(query)
      .then(data => {
        const quizzes = data.rows;
        const arr = [];
        quizzes.forEach((x) => {
          arr.push(x.id);
        })
        const str = arr.toString();
        let query2 = `SELECT quizzes.name, quizzes.id, CONCAT(cast(MAX(score) as float) / 4 * 100, '%') as top_score
        FROM attempts
        RIGHT JOIN quizzes ON attempts.quiz_id = quizzes.id
        WHERE quizzes.id IN (${str})
        GROUP BY quizzes.name, quizzes.id
        ;`
        db.query(query2)
        .then(data => {
          const user_id = req.session.user_id;
          const quizzes = data.rows;
          const templateVars = {
          user: user_id,
          quizzes: quizzes
        }
        res.render("index", templateVars);
        })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message })
      });
  });

  router.get("/error", (req, res) => {
    res.render("/error");
  });

  return router;
};
