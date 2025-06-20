import React, { useState } from 'react';
import UserSidebarMenu from '../../components/User/UserSidebarMenu';
import '../../styles/User/DashboardPage.css'; // General dashboard styles
import '../../styles/User/UserSidebarMenu.css'; // Sidebar specific styles
import '../../styles/User/Payment.css'; // Specific styles for the Payment page
import QR from '../../assets/img/download.png'

const Payment = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handlePaymentSelection = (method) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <div className="dashboard-container">
      {/* User Sidebar Menu */}
      {/* <div className="dashboard-sidebar">
        <UserSidebarMenu />
      </div> */}

      {/* Main Content Area for Payment */}
      <div className="dashboard-main-content">
        {/* Header */}
        <header className="main-content-header">
          <h2>Chọn phương thức thanh toán</h2>
        </header>

        {/* Main Content Body */}
        <main className="main-content-body">
          <div className="payment-options-container">
            <h3>Vui lòng chọn phương thức thanh toán của bạn:</h3>
            <div 
              className={`payment-option ${selectedPaymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelection('cash')}
            >
              <h4>Thanh toán tiền mặt</h4>
              <p>Thanh toán trực tiếp cho nhân viên sửa chữa khi hoàn thành dịch vụ.</p>
            </div>

            <div 
              className={`payment-option ${selectedPaymentMethod === 'online' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelection('online')}
            >
              <h4>Thanh toán trực tuyến</h4>
              <p>Thanh toán an toàn qua các cổng thanh toán điện tử (placeholder).</p>
            </div>

            {/* Conditional Rendering based on selection */}
            {selectedPaymentMethod === 'cash' && (
              <div className="payment-success-message">
                <h4>Thanh toán tiền mặt đã chọn!</h4>
                <p>Vui lòng chuẩn bị tiền mặt để thanh toán cho nhân viên khi dịch vụ hoàn thành.</p>
                {/* You might want to add a confirmation button here */}
              </div>
            )}

            {selectedPaymentMethod === 'online' && (
              <div className="momo-qr-code-section">
                <h4>Thanh toán qua Momo</h4>
                <p>Vui lòng quét mã QR dưới đây để thanh toán:</p>
               
                <div className="qr-code-placeholder">
                  <img 
                    src={QR} 
                    alt="Momo QR Code Placeholder"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
          
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Payment;
