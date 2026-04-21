import React from 'react';
import { motion } from 'framer-motion';
import './SIIALoader.css';

const SIIALoader = ({ status = "SYNCHRONIZING DIGITAL ARCHIVES", fullScreen = true }) => {
  return (
    <div className={`siia-logo-loader-container ${!fullScreen ? 'section-loader' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="siia-loader-content"
      >
        <div className="siia-logo-text">
          {['S', 'I', 'I', 'A'].map((letter, i) => (
            <motion.span 
              key={i}
              className="letter"
              animate={{ 
                opacity: [1, 0.4, 1],
                filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            >
              {letter}
            </motion.span>
          ))}
          <motion.div 
            className="scan-line"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </div>
        <div className="loader-status">
          <motion.div 
            className="status-dot"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          ></motion.div>
          <span>{status}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SIIALoader;
