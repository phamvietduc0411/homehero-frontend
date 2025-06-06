import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainPage from "./pages/User/MainPage.jsx";
import RepairShedule from "./pages/User/RepairShedule.jsx";
import Payment from "./pages/User/Payment.jsx";


function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/schedule" element={<RepairShedule />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}

export default App;
