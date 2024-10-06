import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import './templatedesign.css'
import { Link } from 'react-router-dom';


const TemplateDesign = ({ data, index }) => {
  return (
    <Link to={data.name}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ delay: index * 0.3, ease: easeInOut }}
      >
        <div className="size">
          <img src={data?.imageURL} className="img" alt="" />
        </div>
      </motion.div>
    </Link>
  );
};

export default TemplateDesign;
