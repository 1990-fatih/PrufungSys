import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [choices, setChoices] = useState([]);

  // Fragen aus der Datenbank abrufen
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/questions"); // Fragen vom Server abrufen
      setQuestions(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Fragen:", error);
    }
  };

// Funktion zum Löschen der Frage
  const deleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/questions/${questionId}`);
      fetchQuestions(); //Fragen nach dem Löschen abrufen
    } catch (error) {
      console.error("Beim Löschen der Frage ist ein Fehler aufgetreten:", error);
    }
  };

//Öffne Modal und lege die Informationen der ausgewählten Frage fest
  const openUpdateModal = (question) => {
    setSelectedQuestion(question);
    setQuestionText(question.questionText);
    setCorrectAnswer(question.correctAnswer);
    setChoices(question.choices);
    setShowModal(true);
  };

 // Funktion zur Fragenaktualisierungsseite umleiten


 //Schließe das Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuestion(null);
  };

// Funktion zum Ändern der Antwortoption
  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };
  // Absenden des Formulars (Aktualisierungsprozess)
  const handleQuestionUpdate = async () => {
    const updatedQuestion = {
      questionText,
      correctAnswer,
      choices,
    };

    try {
      await axios.put(
        `http://localhost:5000/questions/${selectedQuestion.questionId}`,
        updatedQuestion
      );
      alert("Frage erfolgreich aktualisiert");
      fetchQuestions(); // Schreiben Sie die Fragen nach dem Update neu getir
      handleCloseModal();
    } catch (error) {
      console.error("Beim Aktualisieren der Frage ist ein Fehler aufgetreten:", error);
    }
  };

  return (
    <div>
      <div className="container bg-light py-5 mt-5 rounded-end">
      
        <h1 className="display-5 fw-bold">Fragen List</h1>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Frage Id</th>
              <th scope="col">Frage Text</th>
              <th scope="col">Correct Antwort </th>
              <th scope="col">Antworten</th>

              <th scope="col" colSpan={"2"}>
                Process
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => {
              return (
                <tr scope="col" key={question.questionId}>
                  <td scope="col">{question.questionId}</td>

                  <td>{question.questionText}</td>
                  <td>{question.correctAnswer}</td>
                  <td>
                    <ul>
                      {question.choices.map((choice, index) => (
                        <td className="p-2 border-1 rounded-2 border-success" key={index}>{choice} </td>
                      ))}
                    </ul>
                  </td>

                  <th scope="col" colSpan={"2"}>
                    <button
                      onClick={() => deleteQuestion(question.questionId)}
                      type="button"
                      className="btn btn-primary"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary m-1"
                      onClick={() => openUpdateModal(question)}
                    >
                      Update
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Bootstrap Modal - Update */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 style={{ fontFamily: "cursive" }}>Frage Update</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                <h5 style={{ fontFamily: "cursive" }}>Frage Text</h5>
              </Form.Label>
              <Form.Control
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <h5 style={{ fontFamily: "cursive" }}>Correct Antwort</h5>
              </Form.Label>
              <Form.Control
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Label>
              <h5 style={{ fontFamily: "cursive" }}>Antworten</h5>
            </Form.Label>
            {choices.map((choice, index) => (
              <Form.Control
                key={index}
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                required
                className="mb-2"
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleQuestionUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuestionList;
