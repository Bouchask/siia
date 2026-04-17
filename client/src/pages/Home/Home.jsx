import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  ChevronRight,
  Info,
  MapPin,
  Clock,
  Zap,
  ShieldCheck,
  Target,
  ArrowUp,
  Mail,
  Phone,
  Share2,
  Users,
  Globe
} from 'lucide-react';
import announcementService from '../../services/announcementService';
import eventService from '../../services/eventService';
import { Link } from 'react-router-dom';
import AnnouncementCard from '../../components/AnnouncementCard';
import PremiumEventCard from '../../components/PremiumEventCard';
import homeData from '../../data/homeContent.json';
import './Home.css';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [error, setError] = useState(null);

  const { hero } = homeData;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [newsRes, eventsRes] = await Promise.all([
          announcementService.getAll().catch(err => ({ data: [], error: true })),
          eventService.getAll().catch(err => ({ data: [], error: true }))
        ]);
        
        if (newsRes.error && eventsRes.error) {
          setError("Connection to server could not be established.");
        }
        
        const publishedNews = (Array.isArray(newsRes) ? newsRes : (newsRes.data || []))
          .filter(a => a.is_published !== false);
        
        setAnnouncements(publishedNews.slice(0, 3));
        setEvents(Array.isArray(eventsRes) ? eventsRes.slice(0, 3) : (eventsRes.data || []).slice(0, 3));
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("An unexpected error occurred while loading content.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-wrapper">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="home-container">
          <div className="hero-grid">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hero-content"
            >
              <div className="hero-badge-container">
                <span className="badge-premium">
                  <Zap size={14} /> 
                  {hero.badge}
                </span>
              </div>
              <h1 className="hero-title">Engineering the <br/> <span className="text-gradient">Next Era</span> of AI</h1>
              <p className="hero-subtitle">
                {hero.subtitle}
              </p>
              <div className="hero-actions">
                <Link to="/announcements" className="btn btn-primary">
                  Explore News <ArrowRight style={{marginLeft: '10px'}} size={18} />
                </Link>
                <Link to="/courses" className="btn btn-secondary">
                  Access Resources
                </Link>
              </div>
              
              <div className="hero-stats">
                {hero.stats.map((stat, i) => (
                  <div className="stat-item" key={i}>
                    <span className="stat-num">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-image-container"
            >
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                  alt="SIIA Collaborative Workspace" 
                  className="hero-image"
                />
                <div className="hero-floating-card">
                  <ShieldCheck size={24} color="#2563eb" />
                  <div>
                    <div className="card-label">{hero.floatingCard.label}</div>
                    <div className="card-val">{hero.floatingCard.value}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ANNOUNCEMENTS SECTION */}
      <section className="section-padding">
        <div className="home-container">
          <div className="section-header-modern">
            <div className="header-titles">
              <span className="section-tag">News & Insights</span>
              <h2 className="section-title">Department Updates</h2>
            </div>
            <Link to="/announcements" className="link-more-btn">
              <span>Explore All News</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
             <div className="section-loading-state">
               <div className="shimmer-card"></div>
               <div className="shimmer-card"></div>
               <div className="shimmer-card"></div>
             </div>
          ) : error ? (
            <div className="empty-state-card">
              <Info size={40} color="#ef4444" />
              <p>{error}</p>
            </div>
          ) : announcements.length > 0 ? (
            <div className="announcement-grid">
              {announcements.map((item, index) => (
                <AnnouncementCard key={item.id} announcement={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <Info size={40} color="#cbd5e1" />
              <p>The announcement board is currently clear.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. EVENTS SECTION - THE ANGLED DESIGN */}
      <section className="section-padding angled-section">
        <div className="angled-bg"></div>
        <div className="home-container relative-z">
          <div className="section-header-modern inverted">
            <div className="header-titles">
              <span className="section-tag">Experience SIIA</span>
              <h2 className="section-title">Upcoming Events</h2>
            </div>
            <Link to="/events" className="link-more-btn">
              <span>View Full Calendar</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
             <div className="section-loading-state">
               <div className="shimmer-card-event"></div>
               <div className="shimmer-card-event"></div>
               <div className="shimmer-card-event"></div>
             </div>
          ) : error ? null : events.length > 0 ? (
            <div className="announcement-grid">
              {events.map((event, index) => (
                <PremiumEventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <Calendar size={40} color="rgba(255,255,255,0.2)" />
              <p style={{color: 'rgba(255,255,255,0.6)'}}>No events scheduled in the near future.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. HUB FEATURES */}
      <section className="section-padding">
        <div className="home-container">
          <div className="center-header">
            <span className="section-tag">Student Experience</span>
            <h2 className="section-title">A Unified Digital Workspace</h2>
            <p className="section-desc">We've integrated the essential tools of academic life into a single, fluid experience.</p>
          </div>

          <div className="features-grid-v2">
            <motion.div whileHover={{ y: -10 }} className="feature-card-v2">
              <div className="f-icon-wrap bg-blue">
                <Calendar size={28} />
              </div>
              <h3>Live Timetables</h3>
              <p>Access your class schedules with real-time updates from the administration, fully responsive on any device.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="feature-card-v2">
              <div className="f-icon-wrap bg-purple">
                <BookOpen size={28} />
              </div>
              <h3>Digital Archives</h3>
              <p>A centralized library of course materials, lectures, and research papers organized by semester and module.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="feature-card-v2">
              <div className="f-icon-wrap bg-amber">
                <Zap size={28} />
              </div>
              <h3>Instant Alerts</h3>
              <p>Never miss a deadline or department update with our direct communication channel between faculty and students.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. MISSION & EXCELLENCE */}
      <section className="section-padding excellence-section-bg">
        <div className="home-container">
          <div className="excellence-grid-v2">
            <div className="excellence-text-content">
              <span className="section-tag">The SIIA Standard</span>
              <h2 className="section-title-large">Defined by Quality, Driven by Innovation</h2>
              
              <div className="mission-items">
                <div className="mission-item">
                  <div className="m-icon"><Target size={20} /></div>
                  <div className="m-text">
                    <h4>Industry-Ready Curriculum</h4>
                    <p>Our courses are constantly updated to reflect the evolving needs of the global AI and Data Science markets.</p>
                  </div>
                </div>
                
                <div className="mission-item">
                  <div className="m-icon"><ShieldCheck size={20} /></div>
                  <div className="m-text">
                    <h4>State Accreditation</h4>
                    <p>As part of the FPK-USMS network, we deliver degrees recognized for their academic rigor and professional value.</p>
                  </div>
                </div>
              </div>
              
              <div className="excellence-action">
                <Link to="/courses" className="btn btn-primary-outline">
                  See Academic Program <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            
            <div className="excellence-visual-studio">
              <div className="v-card v-card-1">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600" alt="Work" />
              </div>
              <div className="v-card v-card-2">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" alt="Work" />
              </div>
              <div className="v-bg-blob"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="home-container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="f-logo">SIIA</div>
              <p className="f-tagline">Forming the architects of tomorrow's intelligence.</p>
              <div className="f-socials">
                <a href="#" className="s-link"><Share2 size={18} /></a>
                <a href="#" className="s-link"><Users size={18} /></a>
                <a href="#" className="s-link"><Globe size={18} /></a>
              </div>
            </div>
            
            <div className="footer-col">
              <h4 className="f-title">Quick Links</h4>
              <ul className="f-links">
                <li><Link to="/">Home Dashboard</Link></li>
                <li><Link to="/announcements">Academic News</Link></li>
                <li><Link to="/events">Events Calendar</Link></li>
                <li><Link to="/courses">Course Library</Link></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 className="f-title">Resources</h4>
              <ul className="f-links">
                <li><Link to="/timetables">Live Timetables</Link></li>
                <li><Link to="/login">Student Portal</Link></li>
                <li><a href="https://fpk.ac.ma" target="_blank" rel="noreferrer">FPK Official</a></li>
                <li><a href="https://usms.ac.ma" target="_blank" rel="noreferrer">USMS Portal</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 className="f-title">Contact Us</h4>
              <ul className="f-contact">
                <li><Mail size={16} /> siia.contact@usms.ma</li>
                <li><Phone size={16} /> +212 523 490 359</li>
                <li><MapPin size={16} /> BP 145, Khouribga Principal, 25000</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2026 Parcours d'Excellence SIIA. Faculté Polydisciplinaire de Khouribga.</p>
            <div className="f-bottom-links">
              <Link to="/login">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="scroll-top-btn"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
