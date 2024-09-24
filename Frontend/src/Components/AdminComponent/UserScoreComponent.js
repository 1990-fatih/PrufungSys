import React, { useEffect, useState } from "react";
import axios from "axios";

const UserScoreList = () => {
  const [users, setUsers] = useState([]);

 // Funktion zum Abrufen der Ergebnisse aller Benutzer
  useEffect((userId) => {
    axios.get(`http://localhost:5000/${userId}/scores`)
      .then(response => {
        setUsers(response.data); //Alle Benutzer und ihre Ergebnisse werden aufgezeichnet

        console.log("asdadasd",response.data)
      })
      .catch(error => console.error("Fehler beim Abrufen der Benutzer:", error));
  }, []);

  // Benutzerfunktion löschen
  
  const handleDeleteUser = (userId) => {
    axios.delete(`http://localhost:5000/score/${userId}`)
      .then(() => {
        console.log("id hier ",userId)
        alert("Der Benutzer wurde erfolgreich gelöscht.");
        setUsers(users.filter(user => user.id !== userId)); //Entfernen des Benutzers aus der Tabelle
      })
      .catch(error => {
        console.error("Fehler beim Löschen des Benutzers:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h1>Liste der Benutzerbewertungen</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Nachname</th>
            <th>Punktzahl</th>
            <th>Löschen</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.score}</td>
              <td>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id)}>
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserScoreList;
