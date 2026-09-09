import React, { useState, useEffect } from 'react';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const vercelAppUrl = 'https://finflow-loan-management-iuq7.vercel.app';
  const githubRepoUrl = 'https://github.com/rajmohit21/Finflow-Loan-Management';
  const resumePdfUrl = '/Mohit_Raj_Resume.pdf';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
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
              rel="noreferrer"
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

      {/* HERO SECTION */}
      <section id="home" className="section-padding" style={{ paddingTop: '8.5rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="section-title-badge">
              <i className="bi bi-code-slash"></i> Software Engineer & Full Stack Developer
            </div>
            
            <h1 style={{ fontSize: '3.25rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.25rem' }}>
              Hi, I'm <span style={{ color: 'var(--accent-blue)' }}>Mohit Raj</span> 👋
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '540px' }}>
              Computer Science Engineer specialized in <strong style={{ color: 'var(--text-main)' }}>Java Spring Boot Microservices</strong>, <strong style={{ color: 'var(--text-main)' }}>Angular 21 & React</strong> applications, and cloud deployments on Vercel & Docker.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <a href={resumePdfUrl} target="_blank" rel="noreferrer" className="btn-primary-portfolio">
                <i className="bi bi-file-earmark-pdf-fill"></i> Open Resume PDF
              </a>
              <a href={vercelAppUrl} target="_blank" rel="noreferrer" className="btn-secondary-portfolio">
                <i className="bi bi-rocket-takeoff-fill" style={{ color: 'var(--accent-cyan)' }}></i> Live FinFlow App
              </a>
              <a href={githubRepoUrl} target="_blank" rel="noreferrer" className="btn-secondary-portfolio">
                <i className="bi bi-github"></i> GitHub Code
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '1.25rem' }}>
              <a href="https://github.com/rajmohit21" target="_blank" rel="noreferrer" title="GitHub Profile" style={{ transition: 'color 0.2s' }}>
                <i className="bi bi-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/mohit-raj-/" target="_blank" rel="noreferrer" title="LinkedIn Profile" style={{ transition: 'color 0.2s' }}>
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="mailto:mohitraj2180@gmail.com" title="Email Direct" style={{ transition: 'color 0.2s' }}>
                <i className="bi bi-envelope-fill"></i>
              </a>
            </div>
          </div>

          {/* Code Highlight Box */}
          <div className="portfolio-card" style={{ background: 'var(--bg-surface)', fontFamily: 'var(--font-code)', fontSize: '0.88rem', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>mohit-raj-profile.ts</span>
            </div>

            <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', margin: 0, color: 'var(--text-main)' }}>
              <code>
{`const engineer = {
  name: "Mohit Raj",
  role: "Full Stack Engineer",
  education: "B.Tech CSE @ LPU (2022-2026)",
  email: "mohitraj2180@gmail.com",
  featuredProject: {
    name: "FinFlow Loan Management",
    stack: ["Spring Cloud", "Angular 21", "MySQL"],
    vercelApp: "${vercelAppUrl}"
  },
  resume: "${resumePdfUrl}",
  status: "Open to Software Engineering Roles"
};`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ABOUT ME */}
      <section id="about" className="section-padding" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-title-badge"><i className="bi bi-person-badge-fill"></i> Personal & Professional Profile</div>
        <h2 className="section-heading">About Mohit Raj</h2>
        <p className="section-subheading">A passionate Computer Science student and Full-Stack Developer with expertise in enterprise Java microservice architectures and dynamic web platforms.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="portfolio-card">
            <i className="bi bi-cpu-fill" style={{ fontSize: '2rem', color: 'var(--accent-blue)', display: 'block', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Backend Microservices</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Proficient in Java 17, Spring Boot 3, Spring Cloud microservices (Netflix Eureka, Spring API Gateway, Config Server), Spring Security JWT, and RESTful API engineering.
            </p>
          </div>

          <div className="portfolio-card">
            <i className="bi bi-window-sidebar" style={{ fontSize: '2rem', color: 'var(--accent-cyan)', display: 'block', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Frontend Development</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Extensive hands-on experience building Single Page Applications (SPAs) with Angular 21 & React, featuring reactive state management, dark mode design systems, and responsive layouts.
            </p>
          </div>

          <div className="portfolio-card">
            <i className="bi bi-box-seam-fill" style={{ fontSize: '2rem', color: 'var(--accent-indigo)', display: 'block', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Cloud & Deployment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Skilled in Docker, Docker Compose multi-container orchestration, Vercel SPA deployments, environment variable security, and CI/CD pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section-padding">
        <div className="section-title-badge"><i className="bi bi-tools"></i> Technical Expertise</div>
        <h2 className="section-heading">Skills & Stack</h2>
        <p className="section-subheading">Curated technical stack mastered through enterprise training and real-world microservice engineering.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Category 1 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-blue)' }}>
              <i className="bi bi-code-square me-2"></i> Languages & Core
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> Java 17</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> TypeScript</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> JavaScript (ES6+)</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> SQL</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> HTML5 & CSS3</span>
            </div>
          </div>

          {/* Category 2 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>
              <i className="bi bi-layers-fill me-2"></i> Frontend Frameworks
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> Angular 21</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> React 18</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> Bootstrap 5</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> RxJS</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-info"></i> Vite</span>
            </div>
          </div>

          {/* Category 3 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-indigo)' }}>
              <i className="bi bi-server me-2"></i> Backend & Microservices
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> Spring Boot 3</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> Spring Cloud Gateway</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> Eureka Service Discovery</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> Spring Cloud Config</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-primary"></i> JWT Authorization</span>
            </div>
          </div>

          {/* Category 4 */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-emerald)' }}>
              <i className="bi bi-database-fill-gear me-2"></i> Databases & DevOps
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> MySQL 8.0</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> Docker & Docker Compose</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> RabbitMQ Message Broker</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> Vercel Deployment</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> Git & GitHub</span>
              <span className="skill-tag"><i className="bi bi-check2-circle text-success"></i> Swagger OpenAPI</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section id="projects" className="section-padding" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-title-badge"><i className="bi bi-star-fill"></i> Primary Showcase Project</div>
        <h2 className="section-heading">Featured Project (From Resume)</h2>
        <p className="section-subheading">Production-ready, microservices-based loan management system built to full enterprise standards.</p>

        {/* Primary Project Card: FinFlow */}
        <div className="portfolio-card" style={{ border: '2px solid var(--accent-blue)', background: 'var(--bg-card)', padding: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>FinFlow Loan Management System</h3>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                  LIVE ON VERCEL
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px', lineHeight: 1.6 }}>
                An enterprise multi-tenant digital loan application & underwriting platform powered by Spring Cloud microservices, Angular 21, and MySQL. Supports real-time document verification, EMI calculation, profile isolation, role-based workflows, and dark mode.
              </p>
            </div>

            {/* DIRECT VERCEL & GITHUB BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
              <a href={vercelAppUrl} target="_blank" rel="noreferrer" className="btn-primary-portfolio" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="bi bi-box-arrow-up-right"></i> Open Vercel Project
              </a>
              <a href={githubRepoUrl} target="_blank" rel="noreferrer" className="btn-secondary-portfolio" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="bi bi-github"></i> GitHub Repository
              </a>
              <a href={resumePdfUrl} target="_blank" rel="noreferrer" className="btn-secondary-portfolio" style={{ width: '100%', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                <i className="bi bi-file-earmark-pdf-fill"></i> View Master Guide PDF
              </a>
            </div>
          </div>

          {/* Key Architecture Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Architecture</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>Spring Cloud Microservices</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Frontend SPA</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>Angular 21 + Reactive Forms</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Discovery & Gateway</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>Eureka + Spring Cloud Gateway</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Deployment</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>Vercel SPA + Docker Stack</div>
            </div>
          </div>

          {/* Features List */}
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--accent-blue)' }}>Key Technical Features:</h4>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.5rem', listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Multi-service orchestration (Auth, Application, Document, Admin, Gateway)</li>
            <li><i className="bi bi-check-circle-fill text-primary me-2"></i> JWT Role-based Authorization (Applicant vs Underwriter Portals)</li>
            <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Scanned Document Viewer Modal with Zoom, Rotation & Hash Verification</li>
            <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Automated Financial EMI Repayment Calculation & Breakdown</li>
            <li><i className="bi bi-check-circle-fill text-primary me-2"></i> High-Contrast Dark/Light Mode Theme Switcher</li>
          </ul>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="skill-tag">Java 17</span>
            <span className="skill-tag">Spring Boot 3</span>
            <span className="skill-tag">Spring Cloud Gateway</span>
            <span className="skill-tag">Eureka</span>
            <span className="skill-tag">Angular 21</span>
            <span className="skill-tag">MySQL</span>
            <span className="skill-tag">Docker Compose</span>
            <span className="skill-tag">Vercel SPA</span>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="section-padding">
        <div className="section-title-badge"><i className="bi bi-mortarboard-fill"></i> Academic Credentials</div>
        <h2 className="section-heading">Education</h2>
        <p className="section-subheading">Solid computer science foundation and enterprise training.</p>

        <div className="portfolio-card" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>Bachelor of Technology (B.Tech)</h3>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-blue)', marginTop: '0.2rem' }}>Computer Science & Engineering</h4>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Lovely Professional University</div>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', fontWeight: 700, padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem' }}>
              2022 — 2026
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Coursework: Data Structures & Algorithms, Object-Oriented Programming in Java, Database Management Systems (SQL), Web Technologies, Operating Systems, Software Engineering, and Cloud Architecture.
          </p>
        </div>
      </section>

      {/* CONTACT & RESUME */}
      <section id="contact" className="section-padding" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-title-badge"><i className="bi bi-envelope-open-fill"></i> Get In Touch</div>
        <h2 className="section-heading">Connect With Mohit Raj</h2>
        <p className="section-subheading">I am actively looking for Software Engineering & Full Stack Developer opportunities.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Contact Info Details & Resume Button */}
          <div>
            <div className="portfolio-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))', border: '1px solid var(--border-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Download Official Resume</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get the full PDF resume including all project architectures & skill set.</p>
                </div>
                <a href={resumePdfUrl} target="_blank" rel="noreferrer" className="btn-primary-portfolio">
                  <i className="bi bi-file-earmark-pdf-fill"></i> Open Resume PDF
                </a>
              </div>
            </div>

            <div className="portfolio-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  <i className="bi bi-envelope-fill" style={{ margin: 'auto' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Direct Email</div>
                  <a href="mailto:mohitraj2180@gmail.com" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>mohitraj2180@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="portfolio-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  <i className="bi bi-linkedin" style={{ margin: 'auto' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>LinkedIn Profile</div>
                  <a href="https://www.linkedin.com/in/mohit-raj-/" target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>linkedin.com/in/mohit-raj-</a>
                </div>
              </div>
            </div>

            <div className="portfolio-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  <i className="bi bi-github" style={{ margin: 'auto' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>GitHub Repositories</div>
                  <a href="https://github.com/rajmohit21" target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>github.com/rajmohit21</a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="portfolio-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Send a Direct Message</h3>

            {contactSubmitted && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.9rem', fontWeight: 600 }}>
                <i className="bi bi-check-circle-fill me-2"></i> Thank you! Your message has been sent successfully. Mohit will reply soon.
              </div>
            )}

            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Recruiter / Hiring Manager"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Write your message or inquiry..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary-portfolio" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="bi bi-send-fill"></i> Send Message
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

