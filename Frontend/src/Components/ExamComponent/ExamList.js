import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ExamList = () => {
  const { userId } = useParams(); 
  const [exams, setExams] = useState([]);
  const [userName, setUserName] = useState({}); 
  const navigate = useNavigate(); 

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

// Funktion zum Abrufen von Prüfungen
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
    fetchUserName();
    fetchExams();
  }, [userId]);

  
  const handleExamSelection = (examId) => {
    navigate(`/quiz/${examId}/${userId}`);
  };

  return (
    <div className="container">
      <h1>Mevcut Sınavlar</h1>
      <p>Kullanıcı: {userName.first_name} {userName.last_name}</p>  {/* Kullanıcı adını göster */}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Erklärung</th>
            <th>Teilnehmen</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td>{exam.title}</td>
              <td>{exam.description}</td>
              <td>
                <button onClick={() => handleExamSelection(exam.id)} className="btn btn-primary">
                Teilnehmen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamList;
