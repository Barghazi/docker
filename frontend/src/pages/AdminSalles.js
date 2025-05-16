import React, { useState, useEffect } from 'react';
import { getSalles, getTypes, createSalle, updateSalle, deleteSalle } from '../services/salleService';
import equipementService from '../services/equipementService';

import { Button, Table, Modal, Form, Image, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import '../styles/AdminSalles.css';

const AdminSalles = () => {
    const [salles, setSalles] = useState([]);
    const [types, setTypes] = useState([]);
    const [equipements, setEquipements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSalle, setSelectedSalle] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        type: '',
        capacite: '',
        equipement: '',
        localisation: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    useEffect(() => {
        loadSalles();
        loadTypes();
        loadEquipements();
    }, []);

    const loadSalles = async () => {
        try {
            const response = await getSalles();
            setSalles(response.data);
        } catch (error) {
            showAlert('Erreur lors du chargement des salles', 'danger');
        }
    };

    const loadTypes = async () => {
        try {
            const response = await getTypes();
            setTypes(response.data);
        } catch (error) {
            showAlert('Erreur lors du chargement des types', 'danger');
        }
    };

    const loadEquipements = async () => {
        try {
            const response = await equipementService.getAll();
            setEquipements(response.data);
        } catch (error) {
            showAlert('Erreur lors du chargement des équipements', 'danger');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const capacite = parseInt(formData.capacite);
            if (isNaN(capacite)) {
                showAlert('La capacité doit être un nombre', 'danger');
                return;
            }

            const dataToSend = new FormData();
            dataToSend.append('nom', formData.nom);
            dataToSend.append('type', formData.type);
            dataToSend.append('capacite', capacite);
            dataToSend.append('equipement', formData.equipement);
            dataToSend.append('localisation', formData.localisation);
            if (formData.image) dataToSend.append('image', formData.image);

            if (selectedSalle) {
                await updateSalle(selectedSalle.id, dataToSend);
                showAlert('Salle mise à jour avec succès', 'success');
            } else {
                await createSalle(dataToSend);
                showAlert('Salle créée avec succès', 'success');
            }
            setShowModal(false);
            loadSalles();
            resetForm();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            showAlert('Erreur lors de la sauvegarde: ' + errorMessage, 'danger');
        }
    };

    const handleEdit = (salle) => {
        setSelectedSalle(salle);
        setFormData({
            nom: salle.nom,
            type: salle.type,
            capacite: salle.capacite,
            equipement: salle.equipement,
            localisation: salle.localisation,
            image: null
        });
        setPreviewImage(`http://localhost:8000/${salle.image}`);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
            try {
                await deleteSalle(id);
                showAlert('Salle supprimée avec succès', 'success');
                loadSalles();
            } catch (error) {
                showAlert('Erreur lors de la suppression', 'danger');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            nom: '',
            type: '',
            capacite: '',
            equipement: '',
            localisation: '',
            image: null
        });
        setSelectedSalle(null);
        setPreviewImage(null);
    };

    const showAlert = (message, variant) => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
    };

    return (
        <div className="admin-salles-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestion des Salles</h2>
                <Button variant="primary" onClick={() => {
                    resetForm();
                    setShowModal(true);
                }}>
                    <FaPlus /> Nouvelle Salle
                </Button>
            </div>

            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false, message: '', variant: '' })} dismissible>
                    {alert.message}
                </Alert>
            )}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Capacité</th>
                        <th>Équipement</th>
                        <th>Localisation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {salles.map((salle) => (
                        <tr key={salle.id}>
                            <td>
                                {salle.image && (
                                    <Image
                                        src={`http://localhost:8000/${salle.image}`}
                                        alt={salle.nom}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                )}
                            </td>
                            <td>{salle.nom}</td>
                            <td>{salle.type}</td>
                            <td>{salle.capacite}</td>
                            <td>{salle.equipement}</td>
                            <td>{salle.localisation}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(salle)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(salle.id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                resetForm();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedSalle ? 'Modifier la Salle' : 'Nouvelle Salle'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Sélectionner un type</option>
                                {types.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Capacité</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacite"
                                value={formData.capacite}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Équipement</Form.Label>
                            <Form.Select
                                name="equipement"
                                value={formData.equipement}
                                onChange={handleInputChange}
                            >
                                <option value="">Sélectionner un équipement</option>
                                {equipements.map((equipement) => (
                                    <option key={equipement.id} value={equipement.nom}>
                                        {equipement.nom}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Localisation</Form.Label>
                            <Form.Control
                                type="text"
                                name="localisation"
                                value={formData.localisation}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {previewImage && (
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                                />
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}>
                                Annuler
                            </Button>
                            <Button variant="primary" type="submit">
                                {selectedSalle ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminSalles;
