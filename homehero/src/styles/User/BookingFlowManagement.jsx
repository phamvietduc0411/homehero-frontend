import React, { useState } from 'react';

// Import các components (trong thực tế sẽ import từ files riêng)
// import RepairSchedule from './RepairSchedule';
import RepairSchedule from '../../pages/User/RepairSchedule';
// import BookingTracking from './BookingTracking';
import BookingTracking from '../../pages/User/BookingTracking';
// import Payment from './Payment';
import Payment from '../../pages/User/Payment';

const BookingFlowManager = () => {
  const [currentPage, setCurrentPage] = useState('form'); // 'form', 'tracking', 'payment'
  const [bookingData, setBookingData] = useState(null);

  // Handle navigation from form to tracking
  const handleNavigateToTracking = (newBookingData) => {
    setBookingData(newBookingData);
    setCurrentPage('tracking');
  };

  // Handle navigation from tracking to payment (when status is Completed)
  const handleNavigateToPayment = (paymentData) => {
    setBookingData(prev => ({ ...prev, ...paymentData }));
    setCurrentPage('payment');
  };

  // Handle back navigation
  const handleBackToForm = () => {
    setCurrentPage('form');
    setBookingData(null);
  };

  const handleBackToTracking = () => {
    setCurrentPage('tracking');
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'form':
        return (
          <RepairSchedule 
            onNavigateToTracking={handleNavigateToTracking}
          />
        );
      
      case 'tracking':
        return (
          <BookingTracking
            initialBookingData={bookingData}
            onNavigateToPayment={handleNavigateToPayment}
            onBackToForm={handleBackToForm}
          />
        );
      
      case 'payment':
        return (
          <Payment 
            bookingData={bookingData}
            onBackToTracking={handleBackToTracking}
          />
        );
      
      default:
        return <RepairSchedule onNavigateToTracking={handleNavigateToTracking} />;
    }
  };

  return (
    <div className="booking-flow-container">
      {/* Navigation breadcrumb */}
      <div className="flow-breadcrumb">
        <div className="breadcrumb-step">
          <span>Pages</span>
          <span className="breadcrumb-separator">/</span>
          {currentPage === 'form' && <span className="breadcrumb-current">Đặt lịch sửa chữa</span>}
          {currentPage === 'tracking' && (
            <>
              <span 
                className="breadcrumb-link" 
                onClick={handleBackToForm}
              >
                Đặt lịch sửa chữa
              </span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Theo dõi đơn hàng</span>
            </>
          )}
          {currentPage === 'payment' && (
            <>
              <span 
                className="breadcrumb-link" 
                onClick={handleBackToForm}
              >
                Đặt lịch sửa chữa
              </span>
              <span className="breadcrumb-separator">/</span>
              <span 
                className="breadcrumb-link" 
                onClick={handleBackToTracking}
              >
                Theo dõi đơn hàng
              </span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Thanh toán</span>
            </>
          )}
        </div>
      </div>

      {/* Page content */}
      {renderCurrentPage()}

      <style jsx>{`
        .booking-flow-container {
          min-height: 100vh;
          background: #f8fafc;
        }

        .flow-breadcrumb {
          background: white;
          padding: 15px 30px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 0;
        }

        .breadcrumb-step {
          font-size: 14px;
          color: #666;
        }

        .breadcrumb-separator {
          margin: 0 8px;
          color: #999;
        }

        .breadcrumb-current {
          color: #333;
          font-weight: 500;
        }

        .breadcrumb-link {
          color: #6366f1;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .breadcrumb-link:hover {
          color: #5855eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};




export default BookingFlowManager;