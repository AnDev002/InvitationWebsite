import React, { useState } from 'react';

// Import CSS toàn cục và các component con
import './style.css';
// Đổi sang default import để khớp với cách export của component
import Content from './Components/Content/AccountSettingsContent';

/**
 * Component AccountSettingsPage chính.
 * Đây là nơi lắp ráp các thành phần chính của trang: Header, Content, và Footer.
 * Nó cũng quản lý trạng thái chung, ví dụ như việc menu trên di động có đang mở hay không.
 */
const AccountSettingsPage = () => {
  return (
    <div className="page-wrapper">
      <Content />
    </div>
  );
};

export default AccountSettingsPage;
