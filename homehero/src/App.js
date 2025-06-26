import Login from "./pages/Login_ver2.jsx";
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import './App.css';
import MainPage from "./pages/User/MainPage.jsx";
import RepairShedule from "./pages/User/RepairSchedule.jsx";
import Payment from "./pages/User/Payment.jsx";
import ProductStore from "./pages/User/ProductStore.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import TechnicianDashboard from "./pages/Technician/TechnicianDashboard.jsx";

import { tokenManager } from "./pages/Login_ver2.jsx";

const ProtectedRoute = ({ children, requiredUserType }) => {
  const isAuthenticated = tokenManager.isAuthenticated();
  const userData = tokenManager.getUserData();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && userData?.userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};
function App() {
  return (
    // <Routes>
    //   {/* <Route path="/" element={<Login />} /> */}
    //   <Route path="/" element={<Login />} />
    //   <Route path="/user" element={<UserDashboard />} />
    //   <Route path="/admin" element={<AdminDashboard />} />
    //   {/* <Route path="/user/products" element={<ProductStore />} />
    //   <Route path="/login" element={<Login />} />
    //   <Route path="/register" element={<Register />} />
    //   <Route path="/main" element={<MainPage />} />
    //   <Route path="/user/schedule" element={<RepairShedule />} />
    //   <Route path="/user/payment" element={<Payment/>} /> */}
    //   <Route path="/technician" element={<TechnicianDashboard />} />
    // </Routes> 
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/user" element={
        <ProtectedRoute requiredUserType="User">
          <UserDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/technician" element={
        <ProtectedRoute requiredUserType="Technician">
          <TechnicianDashboard />
        </ProtectedRoute>
      } />
      
      {/* Redirect any unknown routes to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
