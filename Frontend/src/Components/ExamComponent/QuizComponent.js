import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const QuizComponent = () => {
  const { userId, examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState({});

  useEffect(() => {
    fetchUserName();
  }, [userId]);

  // Fragen aus der Datenbank abrufen
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/exam/${examId}/questions`)
      .then((response) => {
        console.log("Fragen:", response.data); //Um Fragen zu überprüfen
        setQuestions(response.data);
      })
      .catch((error) => console.error(error));
  }, [examId]);

   // Funktion zum Abrufen von Benutzerinformationen
  const fetchUserName = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      console.log(response.data);
      const { first_name, last_name } = response.data;
      setUserName({ first_name, last_name });
    } catch (error) {
      console.error("Fehler beim Abrufen der Benutzerinformationen:", error);
    }
  };

  // Auswahlauswahlfunktion
  const handleChoiceSelection = (questionId, choiceText) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: choiceText, // Wir speichern den Text der ausgewählten Option
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;

    questions.forEach((question) => {
      console.log(
        `Question: ${question.questionText}, Correct Answer: ${
          question.correctAnswerId
        }, Selected Answer: ${selectedAnswers[question.id]}`
      );

      // Wenn die ausgewählte Antwort mit der richtigen Antwort übereinstimmt
      if (selectedAnswers[question.id] === question.correctAnswerId) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsQuizFinished(true);

    //Speichern Sie die Ergebnisse in der Datenbank
    axios
      .post("http://localhost:5000/api/save-result", {
        userId,
        examId,
        score: correctCount,
      })
      .then(() => {
        console.log("Das Ergebnis wurde erfolgreich gespeichert.");
      })
      .catch((error) => {
        console.error("Fehler beim Speichern der Ergebnisse:", error);
      });
  };

  // Ergebnis anzeigen, wenn die Prüfung beendet ist
  if (isQuizFinished) {
    return (
      <div className="container bg-light py-5 mt-5 rounded-end card">
        <h2>Prüfungsergebnisse</h2>
        <p>
        Sehr geehrter Frau/Herr {userName.first_name} {userName.last_name}, Ihr Prüfungsergebnis lautet: {score} von {questions.length} Fragen richtig beantwortet.
        <br/>
        <Link to={/examlist/}>  
        <button
            className="btn btn-primary btn-lg mt-5 float-end"
           
          >
            zu Prüfungen
          </button>
        </Link>
      
        </p>
      </div>
    );
  }

  // Vor- und Zurück-Tasten
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Aktuelle Frage und Optionen anzeigen
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container bg-light py-5 mt-5 rounded-end card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2%",
        }}
        className="justify-content-between p-3"
      >
        <div style={{ textAlign: "left" }} className="quiz-header">
          <h4 style={{ fontFamily: "cursive" }}>BBZ Quiz APP!</h4>
          <span style={{ fontFamily: "italic" }}>
            Herr/Frau {userName.first_name} {userName.last_name}
          </span>
        </div>
      </div>
      <h2 className="text-start">
        {currentQuestion ? currentQuestion.questionText : "Loadin..."}
      </h2>
      {currentQuestion &&
        currentQuestion.choices.map((choice, index) => (
          <button
            className="d-flex justify-content-between list-group"
            key={choice.id}
            onClick={() =>
              handleChoiceSelection(currentQuestion.id, choice.choiceText)
            } // Auswahltext wird gesendet
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2%",
              backgroundColor:
                selectedAnswers[currentQuestion.id] === choice.choiceText
                  ? "lightgreen"
                  : "",
            }}
          >
            {String.fromCharCode(65 + index)}. {choice.choiceText}
          </button>
        ))}
      <div className="d-flex justify-content-between m-2">
        <button
          className="btn btn-secondary btn-lg"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Zurück
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button onClick={calculateScore}>Beenden Sie die Prüfung</button>
        ) : (
          <button
            className="btn btn-primary btn-lg "
            onClick={goToNextQuestion}
          >
            Nachste
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
