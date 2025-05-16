import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Row, Col, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000';
const AUTH_API = `${API_BASE_URL}/api/auth`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        navigate('/');
        return;
      }

      const response = await axios.get(`${AUTH_API}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setError(null);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleApiError = (error) => {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });

    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(error.response.data?.message || 'Une erreur est survenue');
      }
    } else if (error.request) {
      setError('Impossible de contacter le serveur');
    } else {
      setError('Une erreur est survenue');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        // Reset form on error
        setFormData({
          username: '',
          password: '',
          role: 'user'
        });
        navigate('/');
        return;
      }

      await axios.post(`${AUTH_API}/register`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Reset form and show success
      setFormData({
        username: '',
        password: '',
        role: 'user'
      });
      setShowAddModal(false);
      setSuccessMessage('Utilisateur ajouté avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchUsers();
    } catch (error) {
      // Reset form on error
      setFormData({
        username: '',
        password: '',
        role: 'user'
      });
      handleApiError(error);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedUser?._id) {
        setError('Session expirée ou utilisateur non sélectionné');
        return;
      }

      console.log('Edit Request:', {
        url: `${AUTH_API}/users/${selectedUser._id}`,
        token: token ? 'Present' : 'Missing',
        data: { username: formData.username, role: formData.role }
      });

      const response = await axios({
        method: 'put',
        url: `${AUTH_API}/users/${selectedUser._id}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          username: formData.username,
          role: formData.role
        }
      });

      console.log('Edit Response:', response.data);
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ username: '', password: '', role: 'user' });
      setSuccessMessage('Utilisateur modifié avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchUsers();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedUser?._id) {
        setError('Session expirée ou utilisateur non sélectionné');
        return;
      }

      console.log('Delete Request:', {
        url: `${AUTH_API}/users/${selectedUser._id}`,
        token: token ? 'Present' : 'Missing',
        userId: selectedUser._id,
        username: selectedUser.username
      });

      const response = await axios({
        method: 'delete',
        url: `${AUTH_API}/users/${selectedUser._id}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete Response:', response.data);
      setShowDeleteModal(false);
      setSelectedUser(null);
      setSuccessMessage('Utilisateur supprimé avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchUsers();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Liste des Utilisateurs</h2>
        </Col>
      </Row>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row className="mb-3">
        <Col className="text-end">
          <Button 
            variant="success" 
            onClick={() => {
              // Reset form data before showing modal
              setFormData({
                username: '',
                password: '',
                role: 'user'
              });
              setError(null);
              setShowAddModal(true);
            }}
          >
            <i className="fas fa-plus"></i> Ajouter un utilisateur
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Rôle</th>
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData({
                      username: user.username,
                      password: '',
                      role: user.role
                    });
                    setShowEditModal(true);
                  }}
                >
                  <i className="fas fa-edit"></i> Modifier
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="fas fa-trash"></i> Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Ajout Utilisateur */}
      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setError(null);
          // Reset form when closing modal
          setFormData({
            username: '',
            password: '',
            role: 'user'
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un utilisateur</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddUser}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">Utilisateur</option>
                <option value="gestionnaire">Gestionnaire</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false);
              setError(null);
              // Reset form when canceling
              setFormData({
                username: '',
                password: '',
                role: 'user'
              });
            }}>
              Annuler
            </Button>
            <Button variant="success" type="submit">
              Ajouter
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Modification Utilisateur */}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setError(null);
          setFormData({ username: '', password: '', role: 'user' });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'utilisateur</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditUser}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">Utilisateur</option>
                <option value="gestionnaire">Gestionnaire</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              setError(null);
              setFormData({ username: '', password: '', role: 'user' });
            }}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Modifier
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Suppression Utilisateur */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setError(null);
          setSelectedUser(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          {selectedUser && (
            <div>
              <p>Êtes-vous sûr de vouloir supprimer l'utilisateur suivant ?</p>
              <ul>
                <li><strong>Nom d'utilisateur:</strong> {selectedUser.username}</li>
                <li><strong>Rôle:</strong> {selectedUser.role}</li>
              </ul>
              <p className="text-danger">Cette action est irréversible.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowDeleteModal(false);
            setError(null);
            setSelectedUser(null);
          }}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteUser}
            disabled={!selectedUser}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Users; 