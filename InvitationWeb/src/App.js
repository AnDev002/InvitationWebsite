import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import './App.css';
import ScrollToTop from './Features/ScrollToTop';
import HomePage from './Pages/HomePage/HomePage';
import TutorialPage from './Pages/TutorialPage/TutorialPage';
import ProductPage from './Pages/ProductPage/ProductPage';
import SignInPage from './Pages/SignInPage/SignInPage';
import SignUpPage from './Pages/SignUpPage/SignUpPage';
import AboutUsPage from './Pages/AboutUsPage/AboutUsPage';
import ProductDetailsPage from './Pages/ProductDetailsPage/ProductDetailsPage';
import AccountSettingsPage from './Pages/AccountSettingsPage/AccountSettingsPage';
import PoliciesAndPrivacyPage from './Pages/PoliciesAndPrivacyPage/PoliciesAndPrivacyPage';
import InvitationManagementPage from './Pages/InvitationManagementPage/InvitationManagementPage';
import InvitationDesignPage from './Pages/InvitationDesign/InvitationDesign';
import InvitationPage from './Pages/InvitationPage/InvitationPage';
import InvitationDetailsPage from './Pages/InvitationDetailsPage/InvitationDetailsPage';
import { useState } from 'react';
import GlobalHeader from './Pages/Components/GlobalHeader';
import GlobalFooter from './Pages/Components/GlobalFooter';
import { useAuth } from './Context/AuthContext';
import SearchResultsPage from './Pages/SearchResultsPage/SearchResultsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }
  return children;
};

const MainLayout = () => {
  // Không cần truyền isMenuOpen và onMenuToggle xuống nữa vì Header tự quản lý
  return (
    <>
      <GlobalHeader />
      <main className="main-content-area">
        <Outlet />
      </main>
      <GlobalFooter />
    </>
  );
};

function App() {
  // State isMenuOpen và hàm toggleMenu không còn cần thiết ở đây nữa
  // vì component Header đã tự quản lý trạng thái của nó.

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* === CÁC ROUTE CÓ LAYOUT CHUNG (HEADER/FOOTER) === */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductPage />} />
          
          {/* [XÓA BỎ] Route cũ không còn dùng */}
          {/* <Route path="/invitations/:type" element={<InvitationPage />} /> */}

          {/* [THÊM MỚI] Các route mới cho trang danh sách thiệp */}
          <Route path="/invitations" element={<InvitationPage />} />
          <Route path="/invitations/category/:categoryName" element={<InvitationPage />} />
          <Route path="/invitations/category/:categoryName/:typeName" element={<InvitationPage />} />

          <Route path="/professional" element={<TutorialPage />} />
          <Route path="/infomation-details" element={<AboutUsPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />

          {/* Route này để xem chi tiết một mẫu thiệp (trang landing page của thiệp) */}
          <Route path="/invitation/:invitationId" element={<InvitationDetailsPage />} />
          
          <Route path="/policies-and-privacy" element={<PoliciesAndPrivacyPage />} />
          <Route path="/search/:query" element={<SearchResultsPage />} /> 
          <Route
            path="/account-settings"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invitation-management"
            element={
              <ProtectedRoute>
                <InvitationManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invitation-management/:invitationId"
            element={
              <ProtectedRoute>
                <InvitationManagementPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* === CÁC ROUTE KHÔNG CÓ LAYOUT CHUNG (TRANG CANVAS) === */}
        {/* Route để tạo thiệp mới từ template */}
        <Route
          path="/canvas/template/:templateId"
          element={
            <ProtectedRoute>
              <InvitationDesignPage />
            </ProtectedRoute>
          }
        />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        {/* Route để chỉnh sửa thiệp đã có */}
        <Route
          path="/canvas/edit/:invitationId"
          element={
            <ProtectedRoute>
              <InvitationDesignPage />
            </ProtectedRoute>
          }
        />
         {/* Route canvas mặc định (tùy chọn) */}
        <Route
          path="/canvas"
          element={
            <ProtectedRoute>
              <InvitationDesignPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;