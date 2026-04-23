// src/components/Home/DoctorsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserMd, FaBaby, FaHeartbeat, FaHeart, FaLungs, FaBrain } from 'react-icons/fa';

const DoctorsList = ({ onDoctorsUpdate }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // أيقونات افتراضية (يمكن تعديلها حسب التخصص)
  const getIconByIndex = (index) => {
    const icons = [<FaUserMd />, <FaBaby />, <FaHeartbeat />, <FaHeart />, <FaLungs />, <FaBrain />];
    return icons[index % icons.length];
  };

  const getSpecialtyByIndex = (index) => {
    const specialties = ["Médecin généraliste", "Pédiatre", "Cardiologue", "Dermatologue", "Pneumologue", "Neurologue"];
    return specialties[index % specialties.length];
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8087/v1/users/public/medecins');
        const doctorsData = response.data;
        const formattedDoctors = doctorsData.map((doc, idx) => ({
          id: doc.id,
          name: `Dr. ${doc.firstName} ${doc.lastName}`,
          specialty: getSpecialtyByIndex(idx),
          bio: `Dr. ${doc.firstName} ${doc.lastName} est un médecin spécialiste avec plusieurs années d'expérience.`,
          icon: getIconByIndex(idx)
        }));
        setDoctors(formattedDoctors);
        if (onDoctorsUpdate) onDoctorsUpdate(formattedDoctors.length);
      } catch (err) {
        console.error("Erreur chargement médecins:", err);
        setError("Impossible de charger la liste des médecins.");
        // données par défaut
        setDoctors([
          { id: 1, name: "Dr. Ahmed Benali", specialty: "Médecin généraliste", bio: "Plus de 15 ans d'expérience.", icon: <FaUserMd /> },
          { id: 2, name: "Dr. Fatima Zahra", specialty: "Pédiatre", bio: "Diplômée de la faculté de Casablanca.", icon: <FaBaby /> },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [onDoctorsUpdate]);

  if (loading) return <div className="loading-spinner">Chargement des médecins...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="doctors-grid">
      {doctors.map((doctor) => (
        <div className="doctor-card-no-image" key={doctor.id}>
          <div className="doctor-icon-circle">{doctor.icon}</div>
          <h3>{doctor.name}</h3>
          <p className="doctor-specialty">{doctor.specialty}</p>
          <p className="doctor-bio">{doctor.bio}</p>
          <button className="btn-appointment" onClick={() => window.location.href='/signup'}>Prendre rendez-vous</button>
        </div>
      ))}
    </div>
  );
};

export default DoctorsList;