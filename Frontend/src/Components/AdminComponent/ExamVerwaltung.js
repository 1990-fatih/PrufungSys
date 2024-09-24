import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const ExamVerwaltung = () => {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ShowCreateModal, setShowCreateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");

  // Funktion zum Abrufen von Exams
  const fetchExams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/exams");
      setExams(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Prüfungen:", error);
    }
  };

  // Benutzer- und Prüfungsinformationen abrufen, wenn die Seite geladen wird
  useEffect(() => {
    fetchExams();
  });

  //Schließe das Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setShowCreateModal(false);
    setSelectedExam(null);
  };

  // Funktion zum Löschen der Examp
  const deleteExam = async (exam_id) => {
    try {
      await axios.delete(`http://localhost:5000/exam/${exam_id}`);
      fetchExams(); // Silme işleminden sonra sınavları tekrar getir
    } catch (error) {
      console.error(
        "Beim Löschen der Frage ist ein Fehler aufgetreten:",
        error
      );
    }
  };

  //Öffne Modal und lege die Informationen der ausgewählten Frage fest
  const openUpdateModal = (exam) => {
    setSelectedExam(exam);
    setExamTitle(exam.title);
    setExamDescription(exam.description);

    setShowModal(true);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleExamUpdate = async () => {
    const updatedExam = {
      title: examTitle,
      description: examDescription,
    };

    console.log("id hiere: ", selectedExam.id);

    try {
      await axios.put(
        `http://localhost:5000/exam/${selectedExam.id}`, // e.id'nin doğru olduğundan emin olun
        updatedExam
      );
      alert("Exam erfolgreich aktualisiert");
      fetchExams(); // Güncellemeden sonra sınavları yeniden yükleyin
      handleCloseModal(); // Modal kapatma işlemi
    } catch (error) {
      console.error(
        "Beim Aktualisieren der Frage ist ein Fehler aufgetreten:",
        error
      );
    }
  };

  const handleCreateExam = async (e) => {
    const newExam = {
      title: examTitle,
      description: examDescription,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/examCreate",
        newExam
      );
      alert(response.data);
    } catch (error) {
      console.error("Exam eklenirken hata oluştu:", error);
      alert("EXMA eklenirken hata oluştu");
    }
  };

  return (
    <div className="container">
      <h1>Verfügbare Prüfungen</h1>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Quiz Id</th>
            <th>Titel</th>
            <th>Erklärung</th>

            <th scope="col" colSpan={"2"}>
              Process
            </th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td>{exam.id}</td>
              <td>{exam.title}</td>
              <td>{exam.description}</td>
              <th scope="col" colSpan={"2"}>
                <button
                  onClick={() => deleteExam(exam.id)}
                  type="button"
                  className="btn btn-primary"
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-primary m-1"
                  onClick={() => openUpdateModal(exam)}
                >
                  Update
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="btn btn-primary m-1"
        onClick={() => openCreateModal()}
      >
        Neu Exam
      </button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 style={{ fontFamily: "cursive" }}>Exam Update</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                <h5 style={{ fontFamily: "cursive" }}>Exam Titel</h5>
              </Form.Label>
              <Form.Control
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <h5 style={{ fontFamily: "cursive" }}>Correct Antwort</h5>
              </Form.Label>
              <Form.Control
                type="text"
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleExamUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={ShowCreateModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 style={{ fontFamily: "cursive" }}>Exam Create</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                <h5 style={{ fontFamily: "cursive" }}>Exam Titel</h5>
              </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setExamTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <h5 style={{ fontFamily: "cursive" }}>Correct Antwort</h5>
              </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setExamDescription(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateExam}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExamVerwaltung;
