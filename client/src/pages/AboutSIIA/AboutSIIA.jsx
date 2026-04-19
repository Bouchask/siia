import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Database, Globe, TrendingUp, CheckCircle, 
  ArrowRight, Award, GraduationCap, DownloadCloud,
  Layers, Rocket, Sparkles, Binary
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './AboutSIIA.css';

const AboutSIIA = () => {
  window.scrollTo(0, 0);

  const roadmap = [
    {
      level: "Bachelor (Licence d'Excellence)",
      type: "bachelor",
      duration: "1 Year (S5 & S6)",
      title: "Foundational Mastery",
      description: "Intensive training for Bac+2 holders. Focuses on advanced programming, system architecture, and core AI concepts.",
      modules: ["Advanced Java", "Big Data Architecture", "Machine Learning", "Network Admin"],
      icon: <Layers size={100} />
    },
    {
      level: "Master of Excellence",
      type: "master",
      duration: "2 Years (S7 to S10)",
      title: "Specialized Innovation",
      description: "Advanced specialization in AI systems, Cloud Computing, and complex Information Systems management.",
      modules: ["Deep Learning", "Cloud Ops", "Data Engineering", "NLP & Vision"],
      icon: <Rocket size={100} />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="about-siia-wrapper">
      
      {/* 1. ADVANCED HERO */}
      <section className="about-hero">
        <div className="home-container">
          <div className="about-hero-content">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '24px', display: 'inline-block' }}
            >
              <span className="badge-premium">
                <Sparkles size={14} /> The SIIA Experience
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-title"
            >
              Pioneering the Next Wave of <br/>
              <span className="text-gradient">Intelligent Engineering</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hero-subtitle"
            >
              The SIIA Excellence Track at FPK is more than just a degree. It's a high-impact incubator for future AI leaders, data architects, and systems innovators.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. THE PILLARS (Clean Grid) */}
      <section className="section-padding" style={{ background: '#fff' }}>
        <div className="home-container">
          <div className="features-grid-v2">
            {[
              { icon: <Cpu />, title: "AI-First Thinking", desc: "Developing solutions where intelligence is integrated at the core of every system.", color: "bg-blue" },
              { icon: <Database />, title: "Data Scalability", desc: "Mastering the infrastructure needed to handle global-scale data ecosystems.", color: "bg-purple" },
              { icon: <Binary />, title: "Algorithmic Rigor", desc: "Solving complex computational challenges with optimized mathematical models.", color: "bg-amber" }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="feature-card-v2"
              >
                <div className={`f-icon-wrap ${pillar.color}`}>{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STAGGERED ROADMAP */}
      <section className="section-padding">
        <div className="home-container">
          <div className="center-header">
            <span className="section-tag">Program Evolution</span>
            <h2 className="section-title">The Academic Journey</h2>
          </div>

          <div className="roadmap-wrapper">
            <div className="roadmap-path"></div>
            
            <div className="roadmap-container">
              {roadmap.map((step, i) => (
                <motion.div 
                  key={i}
                  className={`roadmap-card ${step.type}`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="roadmap-node"></div>
                  <div className="roadmap-icon-bg">{step.icon}</div>
                  <span className="roadmap-badge">{step.level}</span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px' }}>{step.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px' }}>{step.description}</p>
                  
                  <div className="module-tag-list">
                    {step.modules.map((m, idx) => (
                      <span key={idx} className="module-tag">{m}</span>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--siia-blue)' }}>{step.duration}</span>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={18} color="#fff" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROSPECTS & ADMISSION (Glassmorphism) */}
      <section className="section-padding excellence-section-bg">
        <div className="home-container">
          <div className="excellence-grid-v2">
            <div className="excellence-text-content">
              <span className="section-tag">Impact & Careers</span>
              <h2 className="section-title-large">Where Innovation <br/> Meets Industry</h2>
              <div className="mission-items">
                <div className="mission-item">
                  <div className="m-icon"><TrendingUp size={20} /></div>
                  <div className="m-text">
                    <h4>High-Performance Careers</h4>
                    <p>Our alumni are leading digital transformations in top-tier technology firms and research institutes worldwide.</p>
                  </div>
                </div>
                <div className="mission-item">
                  <div className="m-icon"><Award size={20} /></div>
                  <div className="m-text">
                    <h4>Academic Excellence</h4>
                    <p>A direct pathway to doctoral research in the Sultan Moulay Slimane University's most prestigious labs.</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div 
              className="checklist-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <h3 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900, marginBottom: '32px' }}>Join the Track</h3>
              <div className="check-list">
                {[
                  "Completion of Bac+2 (SMI, DUT, or BTS)",
                  "Technical Proficiency in Core Programming",
                  "Analytical Logic & Mathematical Foundations",
                  "Dedication to Emerging AI Technologies"
                ].map((text, i) => (
                  <div key={i} className="check-item">
                    <div className="check-icon"><CheckCircle size={16} /></div>
                    <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '15px' }}>{text}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', marginTop: '40px', padding: '20px', borderRadius: '18px', border: 'none', background: 'var(--siia-blue)', color: '#fff', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <DownloadCloud size={20} /> Download Admission Guide
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="section-padding">
        <div className="home-container">
          <motion.div 
            className="cta-banner"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="section-title" style={{ marginBottom: '20px' }}>Architecture your future.</h2>
            <p className="section-desc" style={{ marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
              Apply for the SIIA Excellence Track and become part of a legacy of innovation.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn btn-primary">
                Explore Modules <ArrowRight style={{marginLeft: '10px'}} size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Candidate Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutSIIA;
