import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";

function Home() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/login', { email, password })
      .then(response => {
        const { role, userId } = response.data;

        if (role === 'admin') {
          navigate(`/adminPanel`);
        } else if (role === 'user') {
          navigate(`/examlist/${userId}`);
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message); 
        } else {
          setErrorMessage('Es ist ein Fehler aufgetreten.');
        }
      });
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    role: "user", // 'User' ist standardmäßig ausgewählt
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/users", formData)
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("Benutzer konnte nicht erstellt werden:", error);
        alert("Benutzer konnte nicht erstellt werden.");
      });
  };

  return (
    <div className="container bg-light py-5 mt-5 rounded-end">
      <h1 className="display-5 fw-bold">Willkommen zu unserem Quiz App</h1>
      <br/>
      
      <ul style={{ textAlign: "left" }}>
        <li>In unserem Programm finden Sie Prüfungen für die Niveaus A1, A2 und B1.</li>
        <li>Sie können Ihr Wissen testen und herausfinden, wie gut Sie die Aufgaben in jeder Stufe meistern.</li>
        <li>Nach jeder Prüfung erhalten Sie eine detaillierte Auswertung, um zu sehen, wie viele Fragen Sie richtig beantwortet haben.</li>
      </ul>
      <h1 style={{ fontFamily: "cursive" }}>Viel Erfolg bei Ihren Prüfungen!</h1>
      <form onSubmit={handleLogin}>
        <div
          style={{ fontFamily: "cursive", textAlign: "left" }}
          class="col-md-4 my-3"
        >
          <label for="">Enter your E-mail:</label>
          <input
            
            className="form-control"
            type="email"
           
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div
          style={{ fontFamily: "cursive", textAlign: "left" }}
          class="col-md-4 my-3"
        >
          <label for="">Enter your Password:</label>
          <input
            type="password"
            
           
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div
          style={{ fontFamily: "cursive", textAlign: "left" }}
          class="col-md-4"
        >
          <button
            style={{ float: "left" }}
            
            className="btn btn-primary btn-m"

            type="submit" 
          >
            Log In
          </button>
        </div>

        <div
          style={{ fontFamily: "cursive", textAlign: "end" }}
          className="col-md-4"
        >
          <button
            onClick={handleShow}
            type="button"
            class="btn btn-secondary btn-m "
          >
            Create Account
          </button>
        </div>
      </form>
      <div className="pt-4" style={{ textAlign: "left" }}></div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form onSubmit={handleCreateAccount}>
              <div className="form-group">
                <label>Vorname:</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nachname:</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Geburtsdatum:</label>
                <input
                  type="date"
                  name="birthDate"
                  className="form-control"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button className="ms-2 mt-3 d-flex float-end" type="submit" variant="primary">Senden</Button>
              <Button className="ms-2 mt-3 d-flex" variant="secondary" onClick={handleClose}>Close</Button>
              </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Link to={"/adminPanel"}>
            <button>GECICI bUTTON</button>
          </Link>
          
          
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}

export default Home;
