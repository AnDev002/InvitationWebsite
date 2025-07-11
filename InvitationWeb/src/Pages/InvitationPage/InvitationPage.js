import React, { useState } from 'react';

import Header from './Components/Header/InvitationHeader';
import Content from './Components/Content/InvitationContent';
import Footer from './Components/Footer/InvitationFooter';

const InvitationPage = () => {
  return (
    <div className="page-wrapper">
      <Content />
    </div>
  );
};

export default InvitationPage;
