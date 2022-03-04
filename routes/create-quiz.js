const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/new", (req, res) => {
    let query = ``;
    db.query(query)
      .then(data => {
        const quizzes = data.rows;
        const userId = req.session.user_id;
        const templateVars = {
          user: userId,
          quizzes: quizzes
        };
        res.render("new_quiz", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/new", (req, res) => {
    console.log('REQ.BODY IS!!!!!', req.body);
    const userId = req.session.user_id;
    db.query(`
      INSERT INTO quizzes (user_id, name, subject, difficulty)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
      `, [userId, req.body.quizName, req.body.subject, req.body.difficulty])
      .then(data => {
        const quizId = data.rows[0].id;
        const templateVars = {
          user: userId,
          questionId: 1, // first question
          quizId: quizId,
          questionNum: 1
        };
        console.log('another one. templateVars!!!!', templateVars);
        return res.render("new_question", templateVars);
      })
      .catch(err => {
        console.log(err);
      });
  });
  return router;
};

