import React, { useState } from 'react';

// Đổi sang default import để khớp với cách export của component
import Header from './Components/Header/PoliciesAndPrivacyHeader';
import Content from './Components/Content/PoliciesAndPrivacyContent';
import Footer from './Components/Footer/PoliciesAndPrivacyFooter';

/**
 * Component PoliciesAndPrivacyPage chính.
 * Đây là nơi lắp ráp các thành phần chính của trang: Header, Content, và Footer.
 * Nó cũng quản lý trạng thái chung, ví dụ như việc menu trên di động có đang mở hay không.
 */
const PoliciesAndPrivacyPage = () => {
  return (
    <div className="page-wrapper">
      <Content />
    </div>
  );
};

export default PoliciesAndPrivacyPage;
