import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");

  // Benutzer aus der Datenbank ziehen
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen von Benutzern:", error);
    }
  };

 // Benutzerlöschfunktion
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      fetchUsers(); // Bringen Sie Benutzer nach dem Löschen zurück
    } catch (error) {
      console.error("Fehler beim Löschen des Benutzers:", error);
    }
  };

 // Öffnen Sie ein Modal und legen Sie die Informationen des ausgewählten Benutzers fest
  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setBirthDate(user.birth_date);
    setRole(user.role);
    setPassword(""); 
    setShowModal(true);
  };

 //Modaler Verschluss
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Absenden des Formulars (Benutzeraktualisierungsprozess)
  const handleUserUpdate = async () => {
    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      birth_date: birthDate,
      role,
      password,
    };

    try {
      await axios.put(`http://localhost:5000/users/${selectedUser.id}`, updatedUser);
      alert("Benutzer erfolgreich aktualisierti");
      fetchUsers(); // Bringen Sie Benutzer nach dem Update zurück
      handleCloseModal();
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Benutzers:", error);
    }
  };

  return (
    <div className="container bg-light py-5 mt-5 rounded-end">
      <h1 className="display-5 fw-bold">Benutzerverwaltung</h1>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Nachname</th>
            <th scope="col">Email</th>
            <th scope="col">Geburtsdatum</th>
            <th scope="col">Role</th>
            <th scope="col" colSpan="2">Operation</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.birth_date}</td>
              <td>{user.role}</td>
              <td>
                <Button onClick={() => openUpdateModal(user)}>Update</Button>
                <Button className="ms-2" onClick={() => deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Benutzeraktualisierung Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Benutzer aktualisieren</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nachname</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Geburtsdatum</Form.Label>
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="user">Benutzer</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUserUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserList;
