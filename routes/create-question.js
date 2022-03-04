const express = require('express');
const router = express.Router();
const { indexToLetter } = require('../helpers/helperFuncs.js');

module.exports = (db) => {
  router.get("/:questionId", (req, res) => {
    let query = ``;
    console.log(query);
    db.query(query)
      .then(() => {
        const userId = req.session.user_id;
        const questionId = req.params.questionId;

        const templateVars = {
          user: userId,
          questionId: questionId
        };

        console.log('templateVars!!!!', templateVars);
        res.render("new_question", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:questionId", (req, res) => {
    console.log('REQ.BODY in post IS!!!!!', req.body);
    const userId = req.session.user_id;
    const quizId = req.body.quizId;
    const question = req.body.question;
    const questionNum = Number(req.params.questionId);

    db.query(`
        INSERT INTO questions (quiz_id, question)
        VALUES ($1, $2)
        RETURNING id;
        `, [quizId, question])
      .then((data) => {
        const questionId = data.rows[0].id;

        const answers = req.body.answers;
        const correctAnswer = req.body.solution;

        for (let n = 0; n < answers.length; n++) {
          const letter = indexToLetter(n);
          const isCorrect = letter === correctAnswer;

          db.query(`
          INSERT INTO answers (question_id, answer, correct)
          VALUES ($1, $2, $3)
          RETURNING id;
          `, [questionId, answers[n], isCorrect])
            .catch(err => {
              console.log(err.message);
            });
        }

        if (questionNum < 4) {
          const templateVars = {
            user: userId,
            questionId: questionNum,
            quizId: quizId,
          };
          console.log(' NEXT templateVars!!!!', templateVars);
          return res.render("new_question", templateVars);
        } else {
          return res.redirect(`/profile/${userId}`);
        }
      })
      .catch((err) => {
        console.log('error saving question.', err.message);
      });
  });
  return router;
};

