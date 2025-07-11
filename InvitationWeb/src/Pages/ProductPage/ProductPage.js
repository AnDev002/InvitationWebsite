import React, { useState } from 'react';

import Header from './Components/Header/ProductPageHeader';
import Content from './Components/Content/ProductPageContent';
import Footer from './Components/Footer/ProductPageFooter';

const TutorialPage = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="page-wrapper">
      <Content />
    </div>
  );
};

export default TutorialPage;
