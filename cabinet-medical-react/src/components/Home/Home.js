import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import {
  FaStethoscope, FaCalendarCheck, FaUserMd, FaFileInvoice,
  FaStar, FaQuoteLeft, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn
} from 'react-icons/fa';

// استيراد صور الأطباء والمرضى من مجلد assets (تأكدي من وجودها)
import doctor1 from '../../assets/doctor1.jpg';
import doctor2 from '../../assets/doctor2.jpg';
import doctor3 from '../../assets/doctor3.jpg';
import doctor4 from '../../assets/doctor4.jpg';
import patient1 from '../../assets/patient1.jpg';
import patient2 from '../../assets/patient2.jpg';
import patient3 from '../../assets/patient3.jpg';

// صور السلايدر (ضعي صورك في مجلد assets بنفس الأسماء)
import slide1 from '../../assets/slide1.jpg';
import slide2 from '../../assets/slide2.jpg';
import slide3 from '../../assets/slide3.jpg';

const Home = () => {
  const navigate = useNavigate();

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

  // الانتقال إلى صورة معينة عند الضغط على النقطة
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // قائمة الأطباء
  const doctors = [
    { id: 1, name: "Dr. Ahmed Benali", specialty: "Médecin généraliste", bio: "Plus de 15 ans d'expérience en médecine générale.", image: doctor1 },
    { id: 2, name: "Dr. Fatima Zahra", specialty: "Pédiatre", bio: "Diplômée de la faculté de médecine de Casablanca.", image: doctor2 },
    { id: 3, name: "Dr. Karim El Mansouri", specialty: "Cardiologue", bio: "Expert en maladies cardiovasculaires.", image: doctor3 },
    { id: 4, name: "Dr. Leila Bennis", specialty: "Dermatologue", bio: "Soins de la peau et esthétique médicale.", image: doctor4 }
  ];

  // شهادات المرضى
  const testimonials = [
    { id: 1, name: "Samira L.", role: "Patiente", comment: "Excellente prise en charge !", rating: 5, image: patient1 },
    { id: 2, name: "Mohamed R.", role: "Patient", comment: "Service rapide et efficace.", rating: 5, image: patient2 },
    { id: 3, name: "Fatima E.", role: "Patiente", comment: "Je recommande vivement.", rating: 5, image: patient3 }
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
        {/* Points indicateurs (dots) */}
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

      {/* ========== NOS MÉDECINS ========== */}
      <section className="doctors-section" id="doctors">
        <div className="container">
          <h2 className="section-title">👨‍⚕️ Nos médecins experts</h2>
          <p className="section-subtitle">Une équipe dévouée à votre santé</p>
          <div className="doctors-grid">
            {doctors.map(doctor => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-image">
                  <img src={doctor.image} alt={doctor.name} />
                </div>
                <h3>{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
                <p className="doctor-bio">{doctor.bio}</p>
                <button className="btn-appointment" onClick={() => navigate('/signup')}>Prendre rendez-vous</button>
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

      {/* ========== TÉMOIGNAGES ========== */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">💬 Ce que disent nos patients</h2>
          <p className="section-subtitle">Ils nous ont fait confiance</p>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div className="testimonial-card" key={t.id}>
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">"{t.comment}"</p>
                <div className="testimonial-author">
                  <img src={t.image} alt={t.name} />
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                    <div className="rating">
                      {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
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