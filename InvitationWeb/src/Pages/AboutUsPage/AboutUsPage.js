import React, { useState } from 'react';

import './style.css';
import Header from './Components/Header/AboutUsHeaderPage';
import Content from './Components/Content/AboutUsContentPage';
import Footer from './Components/Footer/AboutUsFooterPage';

const AboutUsPage = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="page-wrapper">
      <Header 
        isMenuOpen={isMenuOpen} 
        onMenuToggle={toggleMenu} 
      />

      <Content/>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
