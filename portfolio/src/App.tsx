import React, { useState, useEffect } from 'react';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const finflowVercelUrl = 'https://finflow-loan-management-9v78.vercel.app/';
  const githubRepoUrl = 'https://github.com/rajmohit21/Finflow-Loan-Management';
  const githubProfileUrl = 'https://github.com/mohraj2180';
  const linkedinUrl = 'https://linkedin.com/in/mohit-raj-';
  const resumePdfUrl = '/Mohit_Raj_Resume.pdf';
  const masterGuidePdfUrl = '/FinFlow_Master_Guide.pdf';
  const profilePhotoUrl = '/profile.jpg';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSendingMessage(true);
    setContactSubmitted(false);
    setFormError(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/mohitraj2180@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Portfolio Inquiry from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Portfolio Inquiry',
          message: formData.message,
          _template: 'table'
        })
      });

      if (response.ok) {
        setContactSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormError('Failed to deliver message via server. Please try emailing directly.');
      }
    } catch (err) {
      setFormError('Network connection issue. Please send email directly to mohitraj2180@gmail.com.');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="portfolio-root">
      {/* NAVBAR */}
      <header className="portfolio-header">
        <div className="nav-container">
          <a href="#home" className="brand-logo">
            <span style={{ color: 'var(--accent-blue)' }}>Mohit</span> Raj
            <span className="brand-badge">Full Stack</span>
          </a>

          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li><a href="#home" className="nav-link-item" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#about" className="nav-link-item" onClick={() => setMobileMenuOpen(false)}>About</a></li>
            <li><a href="#skills" className="nav-link-item" onClick={() => setMobileMenuOpen(false)}>Skills</a></li>
            <li><a href="#projects" className="nav-link-item" onClick={() => setMobileMenuOpen(false)}>Projects</a></li>
            <li><a href="#training" className="nav-link-item" onClick={() => setMobileMenuOpen(false)}>Training & Certs</a></li>
            <li><a href="#education" className="nav-link-item" onClick={() => setMobileMenuOpen(false)}>Education</a></li>
            <li><a href="#contact" className="nav-link-item" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
            </button>

            <a
              href={resumePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-portfolio"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              <i className="bi bi-file-earmark-pdf-fill"></i> Resume PDF
            </a>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH PROFILE PHOTO */}
      <section id="home" className="section-padding" style={{ paddingTop: '8.5rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="section-title-badge">
              <i className="bi bi-code-slash"></i> Software Engineer & Full Stack Developer
            </div>

            <h1 style={{ fontSize: '3.25rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.25rem' }}>
              Hi, I'm <span style={{ color: 'var(--accent-blue)' }}>Mohit Raj</span> 👋
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '580px' }}>
              Computer Science & Engineering graduate (2026) with hands-on experience building backend services in <strong style={{ color: 'var(--text-main)' }}>Java & Spring Boot</strong>, including microservices architecture, JWT authentication, Eureka discovery, API Gateway, Docker containerization, and modern SPAs.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <a href={resumePdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-portfolio">
                <i className="bi bi-file-earmark-pdf-fill"></i> Open Official Resume PDF
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '1.25rem' }}>
              <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer" title="GitHub Profile" style={{ transition: 'color 0.2s' }}>
                <i className="bi bi-github"></i>
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" style={{ transition: 'color 0.2s' }}>
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="mailto:mohitraj2180@gmail.com" title="Email Direct" style={{ transition: 'color 0.2s' }}>
                <i className="bi bi-envelope-fill"></i>
              </a>
              <a href="tel:+916200206306" title="Phone Call" style={{ transition: 'color 0.2s', fontSize: '1.1rem' }}>
                <i className="bi bi-telephone-fill"></i> <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>+91-6200206306</span>
              </a>
            </div>
          </div>

          {/* Profile Photo Wrapper */}
          <div className="profile-avatar-container">
            <div className="profile-avatar-wrapper">
              <img
                src={profilePhotoUrl}
                alt="Mohit Raj Profile"
                className="profile-avatar-img"
              />
              <div className="profile-status-badge" title="Available for Roles"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT ME / PROFESSIONAL SUMMARY */}
      <section id="about" className="section-padding" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-title-badge"><i className="bi bi-person-badge-fill"></i> Professional Summary</div>
        <h2 className="section-heading">About Me</h2>
        <p className="section-subheading" style={{ maxWidth: '850px', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
          Computer Science and Engineering graduate (2026) with hands-on experience building backend services in Java and Spring Boot, including a microservices-based application with JWT authentication, service discovery, API Gateway, and containerized deployment.
          <br /><br />
          Comfortable across the entire development lifecycle — design, coding, unit testing, debugging, and deployment — with working knowledge of RESTful APIs, ORM/Hibernate, and SQL databases. Strong attention to detail, effective communicator, and quick to pick up new tools and standards within a team environment.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div className="portfolio-card">
            <i className="bi bi-cpu-fill" style={{ fontSize: '2rem', color: 'var(--accent-blue)', display: 'block', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Backend & Microservices</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Spring Boot, Spring Security, Microservices Architecture, RESTful APIs, JPA/Hibernate, Eureka Discovery, API Gateway, RabbitMQ.
            </p>
          </div>

          <div className="portfolio-card">
            <i className="bi bi-window-sidebar" style={{ fontSize: '2rem', color: 'var(--accent-cyan)', display: 'block', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Frontend & Web Technologies</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Angular, React.js, JavaScript, HTML5, CSS3, Zustand, Responsive UI Design, Single Page Application development.
            </p>
          </div>

          <div className="portfolio-card">
            <i className="bi bi-box-seam-fill" style={{ fontSize: '2rem', color: 'var(--accent-indigo)', display: 'block', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Testing, DevOps & Databases</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              MySQL 8.0, JUnit, Mockito, Swagger OpenAPI, Docker containerization, Git & GitHub, Postman API testing, VS Code.
            </p>
          </div>
        </div>
      </section>

      {/* TECHNICAL SKILLS */}
      <section id="skills" className="section-padding">
        <div className="section-title-badge"><i className="bi bi-tools"></i> Resume Skillset</div>
        <h2 className="section-heading">Technical Skills</h2>
        <p className="section-subheading">Core technical stack and competencies verified through hands-on engineering.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Category 1 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-blue)' }}>
              <i className="bi bi-code-square me-2"></i> Programming Languages
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> Java</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> SQL</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> JavaScript</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> C++</span>
            </div>
          </div>

          {/* Category 2 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>
              <i className="bi bi-layers-fill me-2"></i> Backend & Frameworks
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> Spring Boot</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> Spring Security</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> Microservices Architecture</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> RESTful APIs</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> JPA / Hibernate</span>
            </div>
          </div>

          {/* Category 3 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-indigo)' }}>
              <i className="bi bi-diagram-3-fill me-2"></i> Architecture & Messaging
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> Eureka Service Discovery</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> API Gateway</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> RabbitMQ</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> MySQL Database</span>
            </div>
          </div>

          {/* Category 4 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-emerald)' }}>
              <i className="bi bi-shield-check me-2"></i> Testing & Quality
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> JUnit</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> Mockito</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> Swagger OpenAPI</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> Postman</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> Selenium</span>
            </div>
          </div>

          {/* Category 5 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-amber)' }}>
              <i className="bi bi-box-seam me-2"></i> Tools & DevOps
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-warning"></i> GitHub</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-warning"></i> Docker</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-warning"></i> VS Code</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-warning"></i> Vercel Deployment</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-warning"></i> Microsoft Office</span>
            </div>
          </div>

          {/* Category 6 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-blue)' }}>
              <i className="bi bi-stars me-2"></i> Core Competencies
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag">Problem-Solving</span>
              <span className="skill-tag">Attention to Detail</span>
              <span className="skill-tag">Time Management</span>
              <span className="skill-tag">Communication</span>
              <span className="skill-tag">Team Collaboration</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION (EXACT FROM RESUME) */}
      <section id="projects" className="section-padding" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-title-badge"><i className="bi bi-star-fill"></i> Resume Projects</div>
        <h2 className="section-heading">Featured Engineering Projects</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* Project 1: FinFlow — Loan Management System */}
          <div className="portfolio-card" style={{ border: '2px solid var(--accent-blue)', background: 'var(--bg-card)', padding: '2.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>FinFlow — Loan Management System</h3>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', border: '1px solid var(--border-glow)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Dec 2025 – Mar 2026
                  </span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    LIVE ON VERCEL
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px', lineHeight: 1.6 }}>
                  Angular, Spring Boot, Microservices, Spring Security, JWT, MySQL, RabbitMQ, Docker, Eureka, API Gateway
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
                <a href={finflowVercelUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-portfolio" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="bi bi-box-arrow-up-right"></i> Open Vercel Project
                </a>
                <a href={githubRepoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary-portfolio" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="bi bi-github"></i> GitHub Repository
                </a>
              </div>
            </div>

            {/* Bullet Points from Resume */}
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <li>Developed a microservices-based loan management application with an Angular frontend and Spring Boot backend, covering loan applications, authentication, documents, and admin operations.</li>
              <li>Implemented JWT-based authentication and role-based access control with Spring Security, and built RESTful APIs across Auth, Application, Document, and Admin services.</li>
              <li>Used Eureka Service Discovery and an API Gateway to coordinate microservices, and RabbitMQ for asynchronous inter-service communication.</li>
              <li>Applied JPA/Hibernate for data persistence, containerized services with Docker, and used JUnit, Mockito, Swagger, API documentation, and code quality tools.</li>
            </ul>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
              <span className="skill-tag">Angular</span>
              <span className="skill-tag">Spring Boot</span>
              <span className="skill-tag">Microservices</span>
              <span className="skill-tag">Spring Security</span>
              <span className="skill-tag">JWT</span>
              <span className="skill-tag">MySQL</span>
              <span className="skill-tag">RabbitMQ</span>
              <span className="skill-tag">Docker</span>
              <span className="skill-tag">Eureka</span>
              <span className="skill-tag">API Gateway</span>
            </div>
          </div>

          {/* Project 2: E-Commerce Platform */}
          <div className="portfolio-card" style={{ background: 'var(--bg-card)', padding: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>E-Commerce Platform</h3>
                  <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Apr – May 2025
                  </span>
                  <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    DEPLOYMENT PENDING
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  HTML, CSS, JavaScript, React.js, Postman
                </p>
              </div>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              <li>Built a feature-rich e-commerce application with secure login, shopping cart functionality, and end-to-end order processing.</li>
              <li>Engineered a dynamic admin dashboard with role-based access control for real-time management of product, user, transaction, and order-status data.</li>
              <li>Designed and executed a system test plan across 100+ simulated users, using Postman for API verification and Selenium for automated UI testing.</li>
            </ul>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
              <span className="skill-tag">HTML5 / CSS3</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">React.js</span>
              <span className="skill-tag">Postman</span>
              <span className="skill-tag">Selenium</span>
            </div>
          </div>

          {/* Project 3: Real-Time Chat Application */}
          <div className="portfolio-card" style={{ background: 'var(--bg-card)', padding: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Real-Time Chat Application</h3>
                  <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Jan – Mar 2025
                  </span>
                  <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    DEPLOYMENT PENDING
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  MERN Stack, Socket.IO
                </p>
              </div>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              <li>Developed a real-time chat application using the MERN stack and Socket.IO, with MongoDB-backed user authentication and JWT-secured login.</li>
              <li>Built RESTful APIs with Express for backend services and implemented state management with Zustand.</li>
            </ul>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
              <span className="skill-tag">MongoDB</span>
              <span className="skill-tag">Express.js</span>
              <span className="skill-tag">React.js</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Socket.IO</span>
              <span className="skill-tag">Zustand</span>
            </div>
          </div>

        </div>
      </section>

      {/* RELEVANT TRAINING & CERTIFICATIONS */}
      <section id="training" className="section-padding">
        <div className="section-title-badge"><i className="bi bi-award-fill"></i> Credentials</div>
        <h2 className="section-heading">Relevant Training & Certifications</h2>
        <p className="section-subheading">Formal edtech training and industry certifications.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Training */}
          <div className="portfolio-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              RELEVANT TRAINING (Jun – Jul 2024)
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              GFG (Edtech Company) — Data Structures & Algorithms Training
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Completed a Data Structures and Algorithms curriculum covering arrays, linked lists, stacks, queues, trees, and graphs, and built proficiency in dynamic programming, graph algorithms, and complexity analysis.
            </p>
          </div>

          {/* Certifications List */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Industry Certifications
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              <li>
                <i className="bi bi-patch-check-fill text-primary me-2"></i>
                <strong style={{ color: 'var(--text-main)' }}>Building Web Applications in PHP</strong> — Coursera (Dec 2024)
              </li>
              <li>
                <i className="bi bi-patch-check-fill text-primary me-2"></i>
                <strong style={{ color: 'var(--text-main)' }}>HTML, CSS, and JavaScript for Web Developers</strong> — Coursera (May 2024)
              </li>
              <li>
                <i className="bi bi-patch-check-fill text-primary me-2"></i>
                <strong style={{ color: 'var(--text-main)' }}>Mastering Data Structures and Algorithms using C and C++</strong> — Udemy (Feb 2024)
              </li>
              <li>
                <i className="bi bi-patch-check-fill text-primary me-2"></i>
                <strong style={{ color: 'var(--text-main)' }}>Learn C++ Programming – Beginner to Advance: Deep Dive in C++</strong> — Udemy (Aug 2023)
              </li>
              <li>
                <i className="bi bi-patch-check-fill text-primary me-2"></i>
                <strong style={{ color: 'var(--text-main)' }}>Build Responsive Real-World Websites with HTML and CSS</strong> — Udemy (Dec 2023)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="section-padding" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-title-badge"><i className="bi bi-mortarboard-fill"></i> Academic Credentials</div>
        <h2 className="section-heading">Education</h2>
        <p className="section-subheading">Formal academic degrees and schooling background.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
          {/* Degree */}
          <div className="portfolio-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>Lovely Professional University</h3>
                <div style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem' }}>
                  Bachelor of Technology, Computer Science and Engineering
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Phagwara, Punjab</div>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', fontWeight: 700, padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem' }}>
                2022 – 2026
              </div>
            </div>
          </div>

          {/* Senior Secondary */}
          <div className="portfolio-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>DAV Centenary Public School</h3>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Senior Secondary (Class XII)
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Siwan, Bihar</div>
              </div>
              <div style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', fontWeight: 600, padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                2020 – 2021
              </div>
            </div>
          </div>

          {/* Matriculation */}
          <div className="portfolio-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Kendriya Vidyalaya</h3>
                <div style={{ color: 'var(--accent-indigo)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Matriculation (Class X)
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Siwan, Bihar</div>
              </div>
              <div style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', fontWeight: 600, padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                2018 – 2019
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & DIRECT EMAIL ENQUIRY SECTION */}
      <section id="contact" className="section-padding">
        <div className="section-title-badge"><i className="bi bi-envelope-open-fill"></i> Get In Touch</div>
        <h2 className="section-heading">Connect With Mohit Raj</h2>
        <p className="section-subheading">Send a message directly to <strong>mohitraj2180@gmail.com</strong>. I reply promptly to all inquiries.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Contact Details & Resume Button */}
          <div>
            <div className="portfolio-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))', border: '1px solid var(--border-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Official Resume PDF</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get Mohit's complete verified resume.</p>
                </div>
                <a href={resumePdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-portfolio">
                  <i className="bi bi-file-earmark-pdf-fill"></i> Open Resume PDF
                </a>
              </div>
            </div>

            <div className="portfolio-card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <i className="bi bi-envelope-fill" style={{ margin: 'auto' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Direct Email</div>
                  <a href="mailto:mohitraj2180@gmail.com" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>mohitraj2180@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="portfolio-card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <i className="bi bi-telephone-fill" style={{ margin: 'auto' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone Contact</div>
                  <a href="tel:+916200206306" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>+91-6200206306</a>
                </div>
              </div>
            </div>

            <div className="portfolio-card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <i className="bi bi-linkedin" style={{ margin: 'auto' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>LinkedIn Profile</div>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>linkedin.com/in/mohit-raj-</a>
                </div>
              </div>
            </div>

            <div className="portfolio-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <i className="bi bi-github" style={{ margin: 'auto' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>GitHub Profiles</div>
                  <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>github.com/mohraj2180</a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Enquiry Form -> Emails directly to mohitraj2180@gmail.com */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Send Direct Enquiry</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Submitting this form immediately delivers an email to <strong>mohitraj2180@gmail.com</strong>.
            </p>

            {contactSubmitted && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.9rem', fontWeight: 600 }}>
                <i className="bi bi-check-circle-fill me-2"></i> Thank you! Your enquiry has been emailed directly to Mohit (mohitraj2180@gmail.com). He will get back to you shortly.
              </div>
            )}

            {formError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.9rem', fontWeight: 600 }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {formError}
              </div>
            )}

            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hiring Manager / Recruiter"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Your Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Subject (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Opportunity Inquiry / Full Stack Role"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your enquiry message here..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sendingMessage}
                className="btn-primary-portfolio"
                style={{ width: '100%', justifyContent: 'center', opacity: sendingMessage ? 0.7 : 1 }}
              >
                {sendingMessage ? (
                  <>
                    <i className="bi bi-arrow-repeat spin"></i> Sending Email to Mohit...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill"></i> Send Email to mohitraj2180@gmail.com
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Mohit Raj — Software Engineer & Full Stack Developer</p>
        <p style={{ fontSize: '0.85rem' }}>© 2026 Mohit Raj. All rights reserved.</p>
      </footer>
    </div>
  );
}
