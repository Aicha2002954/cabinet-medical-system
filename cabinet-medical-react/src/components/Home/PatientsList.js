// src/components/Home/PatientsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const PatientsList = ({ onPatientsUpdate }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8087/v1/users/public/patients');
        const patientsData = response.data;
        // أخذ أول 6 مرضى وتحويلهم إلى صيغة الشهادات
        const formattedPatients = patientsData.slice(0, 6).map(patient => ({
          id: patient.id,
          name: `${patient.firstName} ${patient.lastName}`,
          role: "Patient",
          comment: `Très satisfait(e) des services de MediCare. Le docteur ${patient.firstName} a été à l'écoute.`,
          rating: 5,
          initial: `${patient.firstName?.charAt(0)}${patient.lastName?.charAt(0)}`
        }));
        setPatients(formattedPatients);
        if (onPatientsUpdate) onPatientsUpdate(formattedPatients.length);
      } catch (err) {
        console.error("Erreur chargement patients:", err);
        setError("Impossible de charger les témoignages.");
        // données par défaut
        setPatients([
          { id: 1, name: "Karim Benjelloun", comment: "Excellent service médical.", rating: 5, initial: "KB" },
          { id: 2, name: "Nadia Fassi", comment: "Professionnalisme et écoute.", rating: 5, initial: "NF" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [onPatientsUpdate]);

  if (loading) return <div className="loading-spinner">Chargement des avis...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="testimonials-grid">
      {patients.map(patient => (
        <div className="testimonial-card" key={patient.id}>
          <FaQuoteLeft className="quote-icon" />
          <p className="testimonial-text">"{patient.comment}"</p>
          <div className="testimonial-author">
            <div className="avatar-placeholder">{patient.initial}</div>
            <div>
              <h4>{patient.name}</h4>
              <span>{patient.role}</span>
              <div className="rating">
                {[...Array(patient.rating)].map((_, i) => <FaStar key={i} />)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientsList;