const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/:user_id", (req, res) => {
    const id = req.params.user_id;
    let query = `
    SELECT users.id as user_id, users.name as user_name, quizzes.id as id, quizzes.public, quizzes.name FROM users
    FULL OUTER JOIN quizzes ON users.id = quizzes.user_id
    WHERE users.id = $1;
    `;
    db.query(query, [id])
      .then(data => {
        const quizzes = data.rows;
        console.log('quizzes', quizzes);

        // check if user logged in
        const user_id = req.session.user_id;
        const templateVars = {
          user_name: quizzes[0].user_name,
          user: user_id,
          quizzes: quizzes
        }
        console.log('templateVars', templateVars)
        res.render("profile", templateVars);

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

