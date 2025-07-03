import React, { useState, useEffect } from 'react';

// Import các components (trong thực tế sẽ import từ files riêng)
// import RepairSchedule from './RepairSchedule';
import RepairSchedule from '../../pages/User/RepairSchedule';
// import BookingTracking from './BookingTracking';
import BookingTracking from '../../pages/User/BookingTracking';
// import Payment from './Payment';
import Payment from '../../pages/User/Payment';

const BookingFlowManager = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState('form'); // 'form', 'tracking', 'payment'
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!userData?.id) {
        setLoading(false);
        return;
      }

      try {
        // 1. Kiểm tra active booking trước (đang trong quá trình xử lý)
        const activeResponse = await fetch(
          `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Booking/user/${userData.id}/active`
        );
        const activeResult = await activeResponse.json();

        if (activeResult.isSuccess && activeResult.data) {
          // Có active booking, auto chuyển tới tracking
          console.log('Found active booking:', activeResult.data.bookingId);
          setBookingId(activeResult.data.bookingId);
          setCurrentPage('tracking');
          setLoading(false);
          return;
        }

        // 2. Không có active booking, check unpaid bookings (đã completed nhưng chưa thanh toán)
        const unpaidResponse = await fetch(
          `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Booking/user/${userData.id}/unpaid`
        );
        const unpaidResult = await unpaidResponse.json();

        if (unpaidResult.isSuccess && unpaidResult.data && unpaidResult.data.totalCount > 0) {
          // Có booking cần thanh toán, auto chuyển tới payment
          console.log(`Found ${unpaidResult.data.totalCount} unpaid bookings`);
          setCurrentPage('payment');
          
          // Show notification về unpaid bookings
          setTimeout(() => {
            alert(`Bạn có ${unpaidResult.data.totalCount} đơn hàng cần thanh toán với tổng số tiền ${unpaidResult.data.formattedTotalAmount}`);
          }, 500);
        } else {
          // Không có active hoặc unpaid booking, ở lại form để tạo booking mới
          console.log('No active or unpaid bookings found, staying on form');
        }

      } catch (error) {
        console.error('Error checking booking status:', error);
        // Có lỗi thì vẫn cho phép user sử dụng form bình thường
      } finally {
        setLoading(false);
      }
    };

    checkBookingStatus();
  }, [userData?.id]);

  // Handle navigation from form to tracking
  const handleNavigateToTracking = (bookingInfo) => {
    console.log('Navigating to tracking with booking:', bookingInfo.bookingId);
    setBookingId(bookingInfo.bookingId);
    setCurrentPage('tracking');
  };

  // Handle navigation from tracking to payment (when status is Completed)
  const handleNavigateToPayment = (paymentData) => {
    console.log('Navigating to payment');
    setCurrentPage('payment');
  };

  // Handle back navigation
  const handleBackToForm = () => {
    console.log('Navigating back to form');
    setCurrentPage('form');
    setBookingId(null);
  };

  const handleBackToTracking = () => {
    console.log('Navigating back to tracking');
    setCurrentPage('tracking');
  };

  // Handle back from payment to home/form
  const handleBackToHome = () => {
    console.log('Navigating back to home/form');
    setCurrentPage('form');
    setBookingId(null);
  };

  if (loading) {
    return (
      <div className="booking-flow-container">
        <div className="page-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang kiểm tra đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'form':
        return (
          <RepairSchedule 
            onNavigateToTracking={handleNavigateToTracking}
            userData={userData}
          />
        );
      
      case 'tracking':
        return (
          <BookingTracking
            bookingId={bookingId}
            onNavigateToPayment={handleNavigateToPayment}
            onBackToForm={handleBackToForm}
          />
        );
      
      case 'payment':
        return (
          <Payment 
            userData={userData}
            onBackToTracking={bookingId ? handleBackToTracking : null} // Chỉ hiển thị nếu có bookingId
            onBackToHome={handleBackToHome}
          />
        );
      
      default:
        return (
          <RepairSchedule 
            onNavigateToTracking={handleNavigateToTracking}
            userData={userData} 
          />
        );
    }
  };

  return (
    <div className="booking-flow-container">
      {/* Navigation breadcrumb */}
      <div className="flow-breadcrumb">
        <div className="breadcrumb-step">
          <span>Pages</span>
          <span className="breadcrumb-separator">/</span>
          {currentPage === 'form' && (
            <span className="breadcrumb-current">Đặt lịch sửa chữa</span>
          )}
          {currentPage === 'tracking' && (
            <>
              <span 
                className="breadcrumb-link" 
                onClick={handleBackToForm}
                title="Về trang đặt lịch"
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
                title="Về trang đặt lịch"
              >
                Đặt lịch sửa chữa
              </span>
              <span className="breadcrumb-separator">/</span>
              {bookingId ? (
                <>
                  <span 
                    className="breadcrumb-link" 
                    onClick={handleBackToTracking}
                    title="Về trang theo dõi"
                  >
                    Theo dõi đơn hàng
                  </span>
                  <span className="breadcrumb-separator">/</span>
                </>
              ) : (
                <>
                  <span className="breadcrumb-disabled">Theo dõi đơn hàng</span>
                  <span className="breadcrumb-separator">/</span>
                </>
              )}
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .breadcrumb-step {
          font-size: 14px;
          color: #666;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
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
          text-decoration: none;
        }

        .breadcrumb-link:hover {
          color: #5855eb;
          text-decoration: underline;
        }

        .breadcrumb-disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .page-content {
          padding: 0;
        }

        /* Responsive breadcrumb */
        @media (max-width: 768px) {
          .flow-breadcrumb {
            padding: 10px 15px;
          }
          
          .breadcrumb-step {
            font-size: 12px;
          }
          
          .breadcrumb-separator {
            margin: 0 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingFlowManager;