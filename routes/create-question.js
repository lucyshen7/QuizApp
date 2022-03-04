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
        console.log('templateVars!!!!', templateVars);
        res.render("new_question", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/new", (req, res) => {
    console.log('REQ.BODY in post IS!!!!!', req.body);
    const userId = req.session.user_id;
    const quizId = req.body.quizId;
    const question = req.body.question;

    const questionNum = Number(req.questionNum);

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
        const isCorrect = 'A' === correctAnswer;
        db.query(`
        INSERT INTO answers (question_id, answer, correct)
        VALUES ($1, $2, $3)
        RETURNING id
        `, [questionId, answer1, isCorrect]);
        return questionId;
      })
      .then((questionId) => {
        const isCorrect = 'B' === correctAnswer;
        db.query(`
        INSERT INTO answers (question_id, answer, correct)
        VALUES ($1, $2, $3)
        RETURNING id
        `, [questionId, answer2, isCorrect]);
        return questionId;
      })
      .then((questionId) => {
        const isCorrect = 'C' === correctAnswer;
        db.query(`
        INSERT INTO answers (question_id, answer, correct)
        VALUES ($1, $2, $3)
        RETURNING id
        `, [questionId, answer3, isCorrect]);
      })
      .catch(err => {
        console.log(err.message);
      });

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
  });

  return router;
};

