import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Database, Globe, TrendingUp, CheckCircle, 
  ArrowRight, Award, GraduationCap, Mail,
  Layers, Rocket, Sparkles, Binary, Zap, Network,
  BrainCircuit, Eye, MessageSquare, Briefcase, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './AboutSIIA.css';

const AboutSIIA = () => {
  window.scrollTo(0, 0);

  const journey = [
    {
      level: "Core Engineering",
      title: "Software Architecture",
      desc: "Mastering the fundamentals of large-scale systems, including advanced object-oriented design and robust networking protocols.",
      side: "left",
      dark: false,
      icon: <Layers size={40} />,
      modules: [
        { name: "Advanced Java", icon: <Binary size={14}/> },
        { name: "Software Engineering", icon: <Layers size={14}/> },
        { name: "Computer Networks", icon: <Network size={14}/> },
        { name: "System Admin", icon: <Briefcase size={14}/> }
      ]
    },
    {
      level: "Intelligence",
      title: "AI & Machine Learning",
      desc: "Deep dive into the mathematical and algorithmic foundations of modern artificial intelligence and predictive modeling.",
      side: "right",
      dark: true,
      icon: <BrainCircuit size={40} />,
      modules: [
        { name: "Machine Learning", icon: <BrainCircuit size={14}/> },
        { name: "Deep Learning", icon: <Cpu size={14}/> },
        { name: "Data Mining", icon: <Database size={14}/> },
        { name: "Optimization", icon: <Zap size={14}/> }
      ]
    },
    {
      level: "Data & Cloud",
      title: "Scalable Infrastructure",
      desc: "Mastering modern data ecosystems, focusing on distributed computing and cloud-native architecture for big data.",
      side: "left",
      dark: false,
      icon: <Database size={40} />,
      modules: [
        { name: "Cloud Computing", icon: <Globe size={14}/> },
        { name: "NoSQL Systems", icon: <Database size={14}/> },
        { name: "Big Data (Hadoop)", icon: <Layers size={14}/> },
        { name: "Research Methods", icon: <BookOpen size={14}/> }
      ]
    },
    {
      level: "Specialization",
      title: "Advanced Perception",
      desc: "Exploring the frontiers of AI through computer vision and natural language processing for industrial applications.",
      side: "right",
      dark: true,
      icon: <Eye size={40} />,
      modules: [
        { name: "Computer Vision", icon: <Eye size={14}/> },
        { name: "NLP (Lang. Tech)", icon: <MessageSquare size={14}/> },
        { name: "Industrial AI", icon: <Zap size={14}/> },
        { name: "Graduation Project", icon: <GraduationCap size={14}/> }
      ]
    }
  ];

  return (
    <div className="about-siia-wrapper">
      
      {/* HERO */}
      <section className="about-hero">
        <div className="home-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-premium">
              <Sparkles size={14} /> The SIIA Excellence Track
            </span>
            <h1 className="hero-title">
              Engineering the <br/>
              <span className="text-gradient">Intelligence of Tomorrow</span>
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '800px' }}>
              Located at FP Khouribga (USMS), the SIIA track is a prestigious academic journey designed to produce world-class experts in AI, Data Science, and Modern Information Systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="section-padding" style={{ background: '#f8fafc' }}>
        <div className="home-container">
          <div className="center-header">
            <span className="section-tag">Academic Evolution</span>
            <h2 className="section-title">The Roadmap to Mastery</h2>
            <p className="section-desc">Our curriculum is precision-engineered for professional growth across four core dimensions.</p>
          </div>

          <div className="journey-path-container">
            <div className="journey-line">
               <motion.div 
                className="journey-progress"
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: false }}
                transition={{ duration: 1.5 }}
              ></motion.div>
            </div>
            
            {journey.map((step, i) => (
              <div key={i} className={`journey-step ${step.side}`}>
                <div className="journey-node-outer">
                  <div className="journey-node-inner"></div>
                </div>

                <div className="journey-content-box">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className={`journey-card advanced-design ${step.dark ? 'dark' : ''}`}
                  >
                    <div className="card-header-flex">
                      <div className="step-icon-container">
                        {step.icon}
                      </div>
                      <span className="level-badge-v2">
                        {step.level}
                      </span>
                    </div>

                    <h3 className="step-title-v2">{step.title}</h3>
                    <p className="step-desc-v2">{step.desc}</p>
                    
                    <div className="module-grid-advanced">
                      {step.modules.map((m, idx) => (
                        <div key={idx} className="module-pill-v2">
                          {m.name}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION & IMPACT */}
      <section className="section-padding excellence-section-bg" style={{ color: '#fff' }}>
        <div className="home-container">
          <div className="excellence-grid-v2">
            <div>
              <span className="section-tag">Vision 2030</span>
              <h2 className="section-title-large">Impact Beyond <br/> the Classroom</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px', lineHeight: '1.8' }}>
                Aligned with the PACTE-ESRI 2030 national plan, the SIIA Excellence Track is a strategic pillar for digital sovereignty and regional innovation.
              </p>
              
              <div className="mission-items">
                <div className="mission-item">
                  <div className="m-icon"><TrendingUp size={20} /></div>
                  <div className="m-text">
                    <h4>High-Impact Employability</h4>
                    <p>Training experts for the most demanded roles in the global tech market: Data Scientists, AI Engineers, and Cloud Architects.</p>
                  </div>
                </div>
                <div className="mission-item">
                  <div className="m-icon"><Rocket size={20} /></div>
                  <div className="m-text">
                    <h4>Regional Innovation Hub</h4>
                    <p>Empowering students to solve real-world industrial challenges for major players like the OCP Group.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="vision-grid">
              <div className="vision-card">
                <div className="vision-icon"><CheckCircle size={24} /></div>
                <h4>Digital Sovereignty</h4>
                <p>Equipping Moroccan talent with the technical mastery needed to lead the nation's digital transformation.</p>
              </div>
              <div className="vision-card">
                <div className="vision-icon"><Award size={24} /></div>
                <h4>Research Excellence</h4>
                <p>Providing a seamless gateway to advanced Ph.D. research in Sultan Moulay Slimane University's top labs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding">
        <div className="home-container">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            style={{ 
              background: '#fff', padding: '100px 40px', borderRadius: '60px', 
              textAlign: 'center', border: '1px solid var(--siia-border)',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.05)'
            }}
          >
            <h2 className="section-title">Ready to define your future?</h2>
            <p className="section-desc" style={{ marginBottom: '40px' }}>Join the SIIA elite and start your journey towards excellence.</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn btn-primary">
                Explore All Modules <ArrowRight style={{marginLeft: '10px'}} size={18} />
              </Link>
              <a href="mailto:siia.contact@usms.ma" className="btn btn-secondary">
                <Mail style={{marginRight: '10px'}} size={18} /> Contact Administration
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutSIIA;
