INSERT INTO users (name, email, password, created_at)
VALUES ('David Smith', 'david.smith@gmail.com','password','2018-02-12T08:00:00.000Z'),
('Jessica John', 'jess.john@gmail.com','password','2018-02-12T08:13:20.000Z'),
('Steven Bob', 'steven.bob@gmail.com','password','2018-02-12T08:13:20.000Z');

INSERT INTO quizzes (user_id, name, subject, difficulty, public)
VALUES (1, 'HTTP QUIZ','Web Development','easy',true),
(1, 'Test Quiz','Web Development','easy',true);

INSERT INTO questions (quiz_id, question)
VALUES (1, 'What does HTTP stand for?'),
(1, 'What is the purpose of HTTP?'),
(1, 'What is the difference between HTTP and HTTPS?'),
(1, 'When was the first version of HTTP finalized (HTTP 1.0)?'),
(2, 'test1'),
(2, 'test2'),
(2, 'test3'),
(2, 'test4');

INSERT INTO answers (question_id, answer, correct)
VALUES (1, 'HyperText Total Processing', false),
(1, 'Hypertext Transfer Protocol', true),
(1, 'HyperText Typecasting Program', false),
(2, 'HTTP is the standard markup language for websites', false),
(2, 'HTTP is a standardized system for compiling the font, color, graphics, and other styling for plain text files', false),
(2, 'HTTP is an application layer protocol which determines how website data is transmitted across the internet', true),
(3, 'HTTPS is used when multiple HTTP calls are made', false),
(3, 'HTTPS is the Canadian version of HTTP', false),
(3, 'HTTPS is HTTP with encryption', true),
(4, '1996', true),
(4, '2001', false),
(4, '2004', false),
(5, '1996', true),
(5, '2001', false),
(5, '2004', false),
(6, '1996', true),
(6, '2001', false),
(6, '2004', false),
(7, '1996', true),
(7, '2001', false),
(7, '2004', false),
(8, '1996', true),
(8, '2001', false),
(8, '2004', false);

INSERT INTO attempts (user_id, quiz_id, attempted_at, score)
VALUES (1, 1, '2018-02-13T08:00:00.000Z', 4),
(2, 1, '2018-02-13T08:00:00.000Z', 2),
(3, 1, '2018-02-13T08:00:00.000Z', 3);

INSERT INTO attempted_answers (attempt_id, answer_id)
VALUES (1, 2),
(1, 6),
(1, 9),
(1, 10),
(2, 2),
(2, 5),
(2, 9),
(2, 12),
(3, 1),
(3, 6),
(3, 9),
(3, 12);
