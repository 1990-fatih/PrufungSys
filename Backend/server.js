const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");

// CORS ve JSON yapılandırması
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "bbz_quiz_app_db",
});

//Starten Sie den Server
app.listen(5000, () => {
  console.log("Der Server läuft auf Port 5000...");
});

db.connect((err) => {
  if (err) throw err;
  console.log("Verbunden mit der MySQL-Datenbank...");
});

app.post("/addQuestion", (req, res) => {
  const { examId, questionText, correctAnswer, choices } = req.body;

  const questionQuery = `
    INSERT INTO questions (exam_id, question_text, correct_answer) 
    VALUES (?, ?, ?)
  `;

  db.query(
    questionQuery,
    [examId, questionText, correctAnswer],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send("Beim Hinzufügen der Frage ist ein Fehler aufgetreten.");
      }

      const questionId = result.insertId; // Rufen Sie die ID der neu hinzugefügten Frage ab

      //Antworten hinzufügen
      const choiceQuery = `
      INSERT INTO choices (question_id, choice_text) 
      VALUES (?, ?)
    `;

      choices.forEach((choice) => {
        db.query(choiceQuery, [questionId, choice], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Şıklar eklenirken hata oluştu.");
          }
        });
      });

      res.send("Anworten und Optionen wurden erfolgreich hinzugefügt.");
    }
  );
});

app.get("/questions", (req, res) => {
  const query = `
    SELECT q.id AS questionId, q.question_text AS questionText, q.correct_answer AS correctAnswer, 
           GROUP_CONCAT(c.choice_text) AS choices
    FROM questions q
    LEFT JOIN choices c ON q.id = c.question_id
    GROUP BY q.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Fehler:", err.sqlMessage);
      return res.status(500).send("Sorular alınırken hata oluştu.");
    }

    // Trennen Sie die Optionen als Liste
    const formattedResults = results.map((row) => ({
      ...row,
      choices: row.choices.split(","),
    }));

    res.json(formattedResults);
  });
});

app.delete("/questions/:id", (req, res) => {
  const questionId = req.params.id;
  const deleteChoicesQuery = "DELETE FROM choices WHERE question_id = ?";
  const deleteQuestionQuery = "DELETE FROM questions WHERE id = ?";

  db.query(deleteChoicesQuery, [questionId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Beim Löschen von Optionen ist ein Fehler aufgetreten.");
    }

    db.query(deleteQuestionQuery, [questionId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Beim Löschen der Frage ist ein Fehler aufgetreten.");
      }

      res.send("Die Frage wurde erfolgreich gelöscht.");
    });
  });
});

// PUT: Fragen Update
app.put("/questions/:id", (req, res) => {
  const questionId = req.params.id;
  const { questionText, correctAnswer, choices } = req.body;

  const updateQuestionQuery = `
    UPDATE questions 
    SET question_text = ?, correct_answer = ? 
    WHERE id = ?
  `;

  db.query(
    updateQuestionQuery,
    [questionText, correctAnswer, questionId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Soru güncellenirken hata oluştu.");
      }

      const deleteChoicesQuery = "DELETE FROM choices WHERE question_id = ?";
      const insertChoicesQuery =
        "INSERT INTO choices (question_id, choice_text) VALUES (?, ?)";

      // Zuerst die alten Optionen löschen
      db.query(deleteChoicesQuery, [questionId], (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .send("Beim Löschen von Optionen ist ein Fehler aufgetreten.");
        }

        //Neue Optionen hinzufügen
        choices.forEach((choice) => {
          db.query(insertChoicesQuery, [questionId, choice], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Beim Hinzufügen von Optionen ist ein Fehler aufgetreten.");
            }
          });
        });

        res.send("Die Frage wurde erfolgreich aktualisiert.");
      });
    }
  );
});

// POST: Neu User Hinzufügen************

app.post("/api/users", (req, res) => {
  const { firstName, lastName, birthDate, email, password, role } = req.body;

  const createUserQuery = `
    INSERT INTO users (first_name, last_name, birth_date, email, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    createUserQuery,
    [firstName, lastName, birthDate, email, password, role],
    (err, result) => {
      if (err) {
        console.error("Benutzer konnte nicht erstellt werden:", err);
        return res
          .status(500)
          .send({
            success: false,
            message: "Benutzer konnte nicht erstellt werden.",
          });
      }

      res
        .status(201)
        .send({ success: true, message: "Benutzer erfolgreich erstellt!" });
    }
  );
});

// API zum Abrufen von Prüfungsfragen
app.get("/api/exam/:examId/questions", (req, res) => {
  const examId = req.params.examId;
  const query = `
    SELECT q.id AS questionId, q.question_text, q.correct_answer, c.id AS choiceId, c.choice_text
    FROM questions q
    LEFT JOIN choices c ON q.id = c.question_id
    WHERE q.exam_id = ?
  `;

  db.query(query, [examId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Bearbeiten Sie die Fragen und Optionen und senden Sie sie
    const questions = [];
    results.forEach((row) => {
      let question = questions.find((q) => q.id === row.questionId);
      if (!question) {
        question = {
          id: row.questionId,
          questionText: row.question_text,
          correctAnswerId: row.correct_answer,
          choices: [],
        };
        questions.push(question);
      }
      question.choices.push({ id: row.choiceId, choiceText: row.choice_text });
    });

    res.json(questions);
  });
});

// API zum Speichern des Prüfungsergebnisses
app.post("/api/save-result", (req, res) => {
  const { userId, examId, score } = req.body;
  const query =
    "INSERT INTO exam_results (user_id, exam_id, score) VALUES (?, ?, ?)";

  db.query(query, [userId, examId, score], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Ergebnis erfolgreich gespeichert." });
  });
});

// POST-Route für den Anmeldevorgang
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const loginQuery = `
    SELECT * FROM users WHERE email = ? AND password = ?
  `;

  db.query(loginQuery, [email, password], (err, results) => {
    if (err) {
      console.error("Datenbankfehler:", err);
      return res
        .status(500)
        .send({ success: false, message: "Datenbankfehler:" });
    }

    if (results.length === 0) {
      // Wenn der Benutzer nicht gefunden wird
      return res
        .status(401)
        .send({
          success: false,
          message: "Ungültige E-Mail-Adresse oder ungültiges Passwort",
        });
    }

    // Benutzer gefunden, Antwort basierend auf der Rolle senden
    const user = results[0];
    res.status(200).send({
      success: true,
      message: "Anmeldung erfolgreich",
      userId: user.id,
      role: user.role,
    });
  });
});

//Users abrufen
app.get("/users", (req, res) => {
  const query =
    "SELECT id, first_name, last_name, email, birth_date, role FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Fehler beim Auflisten der Benutzer:", err);
      return res.status(500).send("Datenbankfehler");
    }
    res.json(results);
  });
});

//User Delete
app.delete("/users/:id", (req, res) => {
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [req.params.id], (err) => {
    if (err) {
      console.error("Fehler beim Löschen des Benutzers:", err);
      return res.status(500).send("Der Benutzer konnte nicht gelöscht werden.");
    }
    res.send("Der Benutzer wurde erfolgreich gelöscht.");
  });
});

//User Update
app.put("/users/:id", (req, res) => {
  const { first_name, last_name, email, birth_date, role, password } = req.body;
  const query =
    "UPDATE users SET first_name = ?, last_name = ?, email = ?, birth_date = ?, role = ?, password = ? WHERE id = ?";
  db.query(
    query,
    [first_name, last_name, email, birth_date, role, password, req.params.id],
    (err) => {
      if (err) {
        console.error("Fehler beim Aktualisieren des Benutzers:", err);
        return res
          .status(500)
          .send("Benutzer konnte nicht aktualisiert werden.");
      }
      res.send("Der Benutzer wurde erfolgreich aktualisiert.");
    }
  );
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT id, first_name, last_name FROM users WHERE id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Fehler beim Abrufen der Benutzerinformationen:", err);
      return res.status(500).json({ error: "Datenbankfehler" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }

    res.json(result[0]);
  });
});

// Endpunkt der Prüfungsliste
app.get("/exams", (req, res) => {
  const query = "SELECT * FROM exams";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Fehler beim Abrufen der Prüfungen:", err);
      return res.status(500).send("Prüfungen konnten nicht abgelegt werden.");
    }
    res.json(results);
  });
});

// Endpunkt der Prüfungsfragen prüfen
app.get("/api/exam/:examId/questions", async (req, res) => {
  const { examId } = req.params;

  try {
    const questions = await db.query(
      "SELECT * FROM questions WHERE exam_id = ?",
      [examId]
    );
    if (questions.length === 0) {
      return res.status(404).send({ message: "Frage nicht gefunden" });
    }
    res.json(questions);
  } catch (error) {
    console.error("Beim Abrufen der Fragen ist ein Fehler aufgetreten:", error);
    res.status(500).send({ message: "Serverfehler" });
  }
});

// Endpunkt der Speicherung des Prüfungsergebnisses
app.post("/api/save-result", async (req, res) => {
  const { userId, examId, score } = req.body;

  try {
    await db.query(
      "INSERT INTO exam_results (user_id, exam_id, score, created_at) VALUES (?, ?, ?, NOW())",
      [userId, examId, score]
    );
    res.send({ message: "Das Ergebnis wurde erfolgreich gespeichert." });
  } catch (error) {
    console.error("Fehler beim Speichern der Ergebnisse:", error);
    res
      .status(500)
      .send({ message: "Beim Speichern der Ergebnisse ist ein Fehler aufgetreten." });
  }
});
//Score-Informationen löschen
app.delete("/score/:user_id/", (req, res) => {
 
  const query = "DELETE FROM exam_results WHERE user_id = ?";
  db.query(query, [req.params.user_id], (err) => {
    if (err) {

      console.error("id server",req.params.id )
      console.error("Fehler beim Löschen des Benutzers:", err);
      return res.status(500).send("Der Benutzer konnte nicht gelöscht werden.");
    }
    res.send("Der Benutzer wurde erfolgreich gelöscht.");
  });
});

app.delete("/exam/:id", (req, res) => {
  const query = "DELETE FROM exams WHERE id = ?";
  db.query(query, [req.params.id], (err) => {
    if (err) {
      console.error("id server", req.params.id);
      console.error("Fehler beim Löschen des Benutzers:", err);
      return res.status(500).send("Der Benutzer konnte nicht gelöscht werden.");
    }
    res.send("Der Benutzer wurde erfolgreich gelöscht.");
  });
});

app.get("/:users/scores", (req, res) => {
  const query = `
    SELECT users.id, users.first_name, users.last_name, exam_results.score
    FROM users
    LEFT JOIN exam_results ON users.id = exam_results.user_id;`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Beim Abrufen von Benutzern und Punktzahlen ist ein Fehler aufgetreten:", err);
      return res.status(500).json({ error: "Datenbankfehler" });
    }

    res.json(result); // Alle Benutzer und Bewertungen werden als JSON zurückgegeben
  });
});

app.post("/api/examCreate", (req, res) => {
  const { title, description} = req.body;
  const createExamQuery = `
    INSERT INTO exams (title, description)
    VALUES (?, ?)
  `;
  db.query(
    createExamQuery,
    [title, description],
    (err, result) => {
      if (err) {
        console.error("Exam konnte nicht erstellt werden:", err);
        return res
          .status(500)
          .send({
            success: false,
            message: "Exam konnte nicht erstellt werden.",
          });
      }

      res
        .status(201)
        .send({ success: true, message: "Exam erfolgreich erstellt!" });
    }
  );
});

app.put("/exam/:id", (req, res) => {
  const { title, description } = req.body; 
  const query = `
    UPDATE exams SET title = ?, description = ? WHERE id = ?
  `;
  db.query(query, [title, description, req.params.id], (err) => {
    if (err) {
      console.error("Fehler beim Aktualisieren des Exams:", err);
      return res
        .status(500)
        .send("Exam konnte nicht aktualisiert werden.");
    }
    res.send("Das Exam wurde erfolgreich aktualisiert.");
  });
});
