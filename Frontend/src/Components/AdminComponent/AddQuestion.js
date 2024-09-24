import React, { useState } from "react";
import axios from "axios";

const AddQuestion = () => {
  const [examId, setExamId] = useState(""); // Dinamik olarak sınav ID'si alınacak
  const [questionText, setQuestionText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [choices, setChoices] = useState([""]); // Başlangıçta tek bir şık olacak

  // Şık değiştirme fonksiyonu
  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  // Şık ekleme fonksiyonu
  const addChoice = () => {
    setChoices([...choices, ""]); // Yeni boş bir şık ekler
  };

  // Şık kaldırma fonksiyonu
  const removeChoice = (index) => {
    const newChoices = choices.filter((_, i) => i !== index);
    setChoices(newChoices);
  };

  // Formu submit etme
  const handleCreateExam = async (e) => {
    e.preventDefault();
    const newQuestion = {
      examId,
      questionText,
      correctAnswer,
      choices,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/addQuestion",
        newQuestion
      );
      alert(response.data);
    } catch (error) {
      console.error("Soru eklenirken hata oluştu:", error);
      alert("Soru eklenirken hata oluştu");
    }
    e.preventDefault();
  };

  return (
    <form className="border rounded-4" onSubmit={handleCreateExam}>
      <h1>Add New frage</h1>
      <div className="mb-3 text-start fs-5 p-2">
        <label>Quiz Id:</label>
        <input
          className="form-control"
          type="text"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          required
        />
      </div>
      <div className="mb-3 text-start fs-5 p-2">
        <label className="form-label">Fragetext</label>
        <input
          className="form-control"
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          rows="3"
        />
      </div>

      <div className="mb-3 text-start fs-5 p-2">
        <label className="form-label">Richtige Antwort</label>
        <input
          type="text"
          className="form-control"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="form-label">Choices</label>
        {choices.map((choice, index) => (
          <div className="d-flex" key={index}>
            <input
              type="text"
              className="form-control h1 w-90 m-2"
              value={choice}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              required
            />
            <button
              className="btn btn-info w-25 m-2"
              type="button"
              onClick={addChoice}
            >
              Add Chocie
            </button>
            <button
              className="btn btn-danger w-25 m-2"
              type="button"
              onClick={() => removeChoice(index)}
            >
              Delete Chocie
            </button>
          </div>
        ))}
        <div className="mt-5 d-flex justify-content-end">
          <button className="btn btn-success ms-3 mb-3 mx-2" type="submit">
            Senden
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddQuestion;
