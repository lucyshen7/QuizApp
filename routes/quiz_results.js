const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:quiz_id/attempt/:attempt_id/", (req, res) => {
    const quiz_id = req.params.quiz_id;
    const attempt_id = req.params.attempt_id;
    let query = `SELECT users.name as attempt_user, attempts.id as attempt_id, attempted_answers.id as attempted_answers_id, attempted_answers.answer_id as attempted_answer, correct, score as total, quizzes.name as quiz_name, questions.quiz_id, questions.id as question_id, questions.question, answers.id as answer_id, answers.answer
    FROM attempts
    JOIN quizzes ON attempts.quiz_id = quizzes.id
    JOIN attempted_answers ON attempts.id = attempt_id
    JOIN answers ON answers.id = attempted_answers.answer_id
    JOIN questions ON answers.question_id = questions.id
    JOIN users ON attempts.user_id = users.id
    WHERE attempts.quiz_id = $1 AND attempt_id = $2
    ORDER BY questions.id;
    `;
    db.query(query, [quiz_id, attempt_id])
      .then(data => {
        const results = data.rows;

        // check if user logged in
        const user_id = req.session.user_id;
        const templateVars = {
          user: user_id,
          attempt_user: results[0].attempt_user,
          attempt_score: results[0].total,
          quiz_name: results[0].quiz_name,
          quiz_id: results[0].quiz_id,
          attempt_id: results[0].attempt_id
        };

        const questions = [];
        data.rows.forEach((i) => {
          if (!questions.includes(i.question)) {
            questions.push(i.question);
          }
        });
        templateVars.questions = questions.map((i) => {
          const answers = data.rows.filter((j) => j.question === i);
          return {
            question:i,
          }
        });
        const selected_answers = [];
        const scores = [];
        data.rows.forEach((x) => {
          selected_answers.push(x.answer);
        })
        data.rows.forEach((x) => {
          x.correct ? scores.push(1) : scores.push(0);
        })
        let index = 0;
        templateVars.questions.forEach((x) => {
          x.attempted_answer = selected_answers[index];
          x.score = scores[index];
          index++;
        })
        res.render("quiz_results", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
