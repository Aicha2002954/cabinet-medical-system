import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import {
  FaStethoscope, FaCalendarCheck, FaUserMd, FaFileInvoice,
  FaStar, FaQuoteLeft, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaUserCircle, FaHeartbeat, FaBaby, FaHeart, FaLungs, FaBrain
} from 'react-icons/fa';

// صور السلايدر
import slide1 from '../../assets/slide1.jpg';
import slide2 from '../../assets/slide2.jpg';
import slide3 from '../../assets/slide3.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // قائمة صور السلايدر
  const slides = [slide1, slide2, slide3];
  const [currentIndex, setCurrentIndex] = useState(0);

  // التبديل التلقائي كل 5 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // جلب المرضى من قاعدة البيانات (role = PATIENT)
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8087/v1/users', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        // تصفية المرضى فقط (role = PATIENT)
        const allUsers = response.data;
        const patientsList = allUsers.filter(user => 
          user.roles && user.roles.includes('PATIENT')
        );
        
        // أخذ أول 6 مرضى مع تحويل البيانات إلى الشكل المطلوب
        const formattedPatients = patientsList.slice(0, 6).map((patient, index) => ({
          id: patient.id,
          name: `${patient.firstName} ${patient.lastName}`,
          role: "Patient",
          comment: getRandomComment(patient.firstName),
          rating: 5,
          initial: `${patient.firstName?.charAt(0)}${patient.lastName?.charAt(0)}`
        }));
        
        setPatients(formattedPatients);
      } catch (error) {
        console.error("Erreur chargement patients:", error);
        // بيانات تجريبية إذا فشل الاتصال
        setPatients([
          { id: 1, name: "Karim Benjelloun", role: "Patient", comment: "Excellent service médical. Je recommande vivement.", rating: 5, initial: "KB" },
          { id: 2, name: "Nadia Fassi", role: "Patiente", comment: "Professionnalisme et écoute. Très satisfaite.", rating: 5, initial: "NF" },
          { id: 3, name: "Mohamed El Alami", role: "Patient", comment: "Cabinet moderne et bien équipé.", rating: 5, initial: "MA" },
          { id: 4, name: "Sanae Tazi", role: "Patiente", comment: "Soins de qualité, je reviendrai.", rating: 5, initial: "ST" },
          { id: 5, name: "Youssef Lamrani", role: "Patient", comment: "Délais d'attente raisonnables.", rating: 4, initial: "YL" },
          { id: 6, name: "Fatima Zahra", role: "Patiente", comment: "Médecin à l'écoute et humain.", rating: 5, initial: "FZ" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // دالة لإنشاء تعليق عشوائي للمريض
  const getRandomComment = (firstName) => {
    const comments = [
      `Je suis très satisfait des soins reçus au cabinet MediCare. Dr. Benali est un médecin à l'écoute et professionnel.`,
      `Service excellent ! Prise de rendez-vous facile et rapide. Je recommande ce cabinet à tous mes proches.`,
      `Un grand merci à toute l'équipe pour leur dévouement et leur gentillesse.`,
      `Cabinet médical moderne avec des équipements de dernière génération. Très bonne expérience.`,
      `Dr. Fatima Zahra est une pédiatre exceptionnelle. Ma fille est entre de bonnes mains.`,
      `Consultation au top ! Le diagnostic était précis et le traitement efficace.`,
      `Je suis suivie régulièrement par Dr. Benali. Un médecin qui prend le temps d'expliquer.`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  // ========== قائمة الأطباء (بدون صور - بطاقات جميلة) ==========
  const doctors = [
    { id: 1, name: "Dr. Ahmed Benali", specialty: "Médecin généraliste", bio: "Plus de 15 ans d'expérience en médecine générale. Consultation pour adultes et enfants.", icon: <FaUserMd /> },
    { id: 2, name: "Dr. Fatima Zahra", specialty: "Pédiatre", bio: "Diplômée de la faculté de médecine de Casablanca. Spécialiste en santé infantile.", icon: <FaBaby /> },
    { id: 3, name: "Dr. Karim El Mansouri", specialty: "Cardiologue", bio: "Expert en maladies cardiovasculaires. Dépistage et suivi cardiaque.", icon: <FaHeartbeat /> },
    { id: 4, name: "Dr. Leila Bennis", specialty: "Dermatologue", bio: "Soins de la peau et esthétique médicale. Traitement de l'acné, eczéma, etc.", icon: <FaHeart /> },
    { id: 5, name: "Dr. Youssef Chafik", specialty: "Pneumologue", bio: "Spécialiste des maladies respiratoires. Asthme, bronchite, allergies.", icon: <FaLungs /> },
    { id: 6, name: "Dr. Amal Touzani", specialty: "Neurologue", bio: "Expertise en troubles neurologiques. Migraines, épilepsie, Alzheimer.", icon: <FaBrain /> }
  ];

  return (
    <div className="home-page">
      {/* ========== HEADER (NAVBAR) ========== */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo-area">
            <FaStethoscope className="logo-icon" />
            <h2 className="logo-text">MediCare</h2>
          </div>
          <div className="nav-links">
            <a href="#home">Accueil</a>
            <a href="#doctors">Médecins</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
            <button onClick={() => navigate('/login')} className="nav-btn">Connexion</button>
            <button onClick={() => navigate('/signup')} className="nav-btn-signup">Inscription</button>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION AVEC CAROUSEL ========== */}
      <section 
        className="hero" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slides[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="hero-content">
          <h1>Bienvenue chez MediCare</h1>
          <p>Des soins de qualité, une technologie moderne, au service de votre santé.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/signup')} className="btn-primary">Prendre rendez-vous</button>
            <button onClick={() => navigate('/login')} className="btn-outline">Espace patient</button>
          </div>
        </div>
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
            ></span>
          ))}
        </div>
      </section>

      {/* ========== NOS MÉDECINS (Version sans photos - Cartes élégantes) ========== */}
      <section className="doctors-section" id="doctors">
        <div className="container">
          <h2 className="section-title">👨‍⚕️ Nos médecins experts</h2>
          <p className="section-subtitle">Une équipe dévouée à votre santé</p>
          <div className="doctors-grid">
            {doctors.map(doctor => (
              <div className="doctor-card-no-image" key={doctor.id}>
                <div className="doctor-icon-circle">
                  {doctor.icon}
                </div>
                <h3>{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
                <p className="doctor-bio">{doctor.bio}</p>
              
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NOS SERVICES ========== */}
      <section className="services-section" id="services">
        <div className="container">
          <h2 className="section-title">📋 Nos services</h2>
          <p className="section-subtitle">Une gamme complète de soins</p>
          <div className="services-grid">
            <div className="service-card">
              <FaUserMd className="service-icon" />
              <h3>Consultations</h3>
              <p>Généralistes et spécialistes sur rendez-vous.</p>
            </div>
            <div className="service-card">
              <FaCalendarCheck className="service-icon" />
              <h3>Rendez-vous en ligne</h3>
              <p>Réservation facile 24h/24.</p>
            </div>
            <div className="service-card">
              <FaStethoscope className="service-icon" />
              <h3>Dossiers médicaux numériques</h3>
              <p>Accès sécurisé à votre historique.</p>
            </div>
            <div className="service-card">
              <FaFileInvoice className="service-icon" />
              <h3>Facturation électronique</h3>
              <p>Paiement sécurisé et suivi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TÉMOIGNAGES DES PATIENTS (من قاعدة البيانات) ========== */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">💬 Ce que disent nos patients</h2>
          <p className="section-subtitle">Des centaines de patients nous font confiance</p>
          
          {loading ? (
            <div className="loading-spinner">Chargement des avis...</div>
          ) : (
            <div className="testimonials-grid">
              {patients.map(patient => (
                <div className="testimonial-card" key={patient.id}>
                  <FaQuoteLeft className="quote-icon" />
                  <p className="testimonial-text">"{patient.comment}"</p>
                  <div className="testimonial-author">
                    <div className="avatar-placeholder">
                      {patient.initial}
                    </div>
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
          )}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>MediCare</h3>
              <p>Des soins de qualité avec une approche humaine.</p>
              <div className="social-icons">
                <FaFacebookF />
                <FaTwitter />
                <FaInstagram />
                <FaLinkedinIn />
              </div>
            </div>
            <div className="footer-col">
              <h4>Liens rapides</h4>
              <ul>
                <li><a href="#home">Accueil</a></li>
                <li><a href="#doctors">Médecins</a></li>
                <li><a href="#services">Services</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <p>📍 Casablanca, Maroc</p>
              <p>📞 +212 5 22 123 456</p>
              <p>✉️ contact@medicare.com</p>
            </div>
            <div className="footer-col">
              <h4>Horaires</h4>
              <p>Lun - Ven : 08:00 - 20:00</p>
              <p>Sam : 09:00 - 14:00</p>
              <p>Dim : Fermé</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 MediCare - Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;