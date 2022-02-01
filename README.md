# QuizApp Midterm Project

## Welcome to our midterm project, **QuizApp!** 📚

QuizApp is a full-stack multi-page quiz application built with Express.js, Node.js, PostgreSQL and CSS/Sass. 

# QuizApp features:**
- Ability to create and take a quiz
- Toggle between private and public quizzes
- Top score for public quizzes
- Quiz results page
- Shareable link to take a quiz or view results

## Final Product
!["Screenshot of profile page with public and private quizzes"](/docs/toggle-private.png)

!["Screenshot of creating a quiz"](/docs/create-quiz.png)

!["Screenshot of taking a quiz"](/docs/take-quiz.png)

!["Screenshot of quiz results"](/docs/quiz-results.png)

!["Screenshot of homepage with top score"](/docs/home-top-score.png)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Warnings & Tips

- Use the `npm run db:reset` command each time there is a change to the database schema or seeds. 
  - It runs through each of the files, in order, and executes them against the database. 
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the tables and recreate them.

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- morgan
- express
- nodemon
- cookie-parser
- session-cookie
- sass
