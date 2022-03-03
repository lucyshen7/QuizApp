const express = require('express');
const router = express.Router();
const { indexToLetter } = require('../helpers/helperFuncs.js');

module.exports = (db) => {
  router.get("/new", (req, res) => {
    let query = ``;
    console.log(query);
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

    // save the quiz info
    db.query(`
      INSERT INTO quizzes (user_id, name, subject, difficulty)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
      `
    , [userId, req.body.quizName, req.body.subject, req.body.difficulty])
      .then(data => { // save the questions for quiz
        const quizId = data.rows[0].id;
        // console.log('quizId', quizId);

        const promises = [];

        const saveQuestionToDB = async (quizId, question) => { // saves one question to db at a time (in the correct order)
          const data = await db.query(`
          INSERT INTO questions (quiz_id, question)
          VALUES ($1, $2)
          RETURNING id;
          `
          , [quizId, question]);
          const questionId = data.rows[0].id;
          // console.log('the question id ISSSSS', questionId);
          // promises.push(questionId);
          // console.log('promises is', promises);
          return questionId;
        };

        for (const question of req.body.questions) { // save questions
          promises.push(question);
        }
        console.log('promises!!!!!', promises);

        for (let i = 0; i < promises.length; i++) {
          const question = promises[i];
          saveQuestionToDB(quizId, question) // save answers for each question
            .then(questionId => {
              // console.log('i isssss', i);
              const answers = req.body[`answers${i + 1}`];
              // console.log('answers', answers);
              const correctAnswer = req.body[`soln${i + 1}`];
              // console.log('correctAnswer', correctAnswer);
              for (let n = 0; n < answers.length; n++) {
                const letter = indexToLetter(n);
                const isCorrect = letter === correctAnswer;
                // console.log('isCorrect???', isCorrect);
                db.query(`
                INSERT INTO answers (question_id, answer, correct)
                VALUES ($1, $2, $3)
                RETURNING id;
                `
                , [questionId, answers[n], isCorrect])
                  .catch(err => {
                    console.log(err.message);
                  });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
        const userId = req.session.user_id;
        return res.redirect(`/profile/${userId}`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};

