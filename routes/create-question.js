const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/new", (req, res) => {
    let query = ``;
    console.log(query);
    db.query(query)
      .then(() => {
        const userId = req.session.user_id;
        const questionId = req.body.questionId;
        const templateVars = {
          user: userId,
          questionId: questionId
        };
        res.render("new_question", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/new", (req, res) => {
    const userId = req.session.user_id;
    const quizId = req.body.quizId;
    const question = req.body.question;
    const questionNum = Number(req.body.questionNum);

    const answer1 = req.body.answer1;
    const answer2 = req.body.answer2;
    const answer3 = req.body.answer3;

    const correctAnswer = req.body.solution;

    db.query(`
        INSERT INTO questions (quiz_id, question)
        VALUES ($1, $2)
        RETURNING id;
        `, [quizId, question])
      .then((data) => {
        const questionId = data.rows[0].id;
        return questionId;
      })
      .then((questionId) => {
        const isCorrect1 = 'A' === correctAnswer;
        const isCorrect2 = 'B' === correctAnswer;
        const isCorrect3 = 'C' === correctAnswer;

        db.query(`
        INSERT INTO answers (question_id, answer, correct)
        VALUES ($1, $2, $5),
        ($1, $3, $6),
        ($1, $4, $7)
        RETURNING *
        `, [questionId, answer1, answer2, answer3, isCorrect1, isCorrect2, isCorrect3])
          .then((data) => {
            console.log('answers saved to db. data.rows', data.rows);
          })
          .catch((err) => {
            console.log('err saving answers', err.message);
          });
        return questionId;
      })
      .then((questionId) => {
        if (questionNum < 4) {
          const templateVars = {
            user: userId,
            questionNum: questionNum + 1,
            questionId: questionId,
            quizId: quizId,
          };
          return res.render("new_question", templateVars);
        } else {
          return res.redirect(`/profile/${userId}`);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  return router;
};

