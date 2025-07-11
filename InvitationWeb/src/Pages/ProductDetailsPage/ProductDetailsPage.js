import React, { useState } from 'react';

import Header from './Components/Header/ProductDetailsPageHeader';
import Content from './Components/Content/ProductDetailsPageContent';
import Footer from './Components/Footer/ProductDetailsPageFooter';

const ProductDetailsPage = () => {
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

export default ProductDetailsPage;
