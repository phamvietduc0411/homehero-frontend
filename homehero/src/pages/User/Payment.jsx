import React, { useState, useEffect } from 'react';
import UserSidebarMenu from '../../components/User/UserSidebarMenu';
import '../../styles/User/DashboardPage.css'; // General dashboard styles
import '../../styles/User/UserSidebarMenu.css'; // Sidebar specific styles
import '../../styles/User/Payment.css'; // Specific styles for the Payment page
import QR from '../../assets/img/download.png';
import VietQROfficial from './PaymentQRSection';


const Payment = ({ userData, onBackToTracking }) => {
  const [unpaidBookings, setUnpaidBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  // Bank account info for transfer
  const bankInfo = {
    bankName: 'Ngân hàng BIDV',
    accountNumber: '12345678901',
    accountName: 'CONG TY HOMEHERO',
    qrCode: QR
  };

  useEffect(() => {
    const fetchUnpaidBookings = async () => {
      if (!userData?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Booking/user/${userData.id}/unpaid`
        );
        const result = await response.json();

        if (result.isSuccess && result.data.unpaidBookings.length > 0) {
          setUnpaidBookings(result.data.unpaidBookings);
          setSelectedBooking(result.data.unpaidBookings[0]); // Auto select first booking
        }
      } catch (error) {
        console.error('Error fetching unpaid bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnpaidBookings();
  }, [userData?.id]);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setCashConfirmed(false);
    setTransferConfirmed(false);
    setPaymentStatus('pending');
  };

  const handleCashPayment = async () => {
    if (window.confirm('Xác nhận bạn đã thanh toán tiền mặt cho thợ sửa chữa?')) {
      setCashConfirmed(true);
      setPaymentStatus('processing');
      
      try {
        // ✅ THAY ĐỔI: Sử dụng API mới với status "Unpaid"
        const paymentData = {
          bookingId: selectedBooking.bookingId,
          amount: selectedBooking.totalPrice,
          paymentMethod: 'Cash',
          transactionCode: null // Cash không có transaction code
        };

        const response = await fetch(
          'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Payment/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
          }
        );

        const result = await response.json();

        if (result.isSuccess) {
          setPaymentStatus('completed');
          // ✅ THAY ĐỔI: Message phù hợp với workflow mới
          alert('Xác nhận thanh toán thành công! Thợ sẽ thu tiền và chuyển hoa hồng về cho HomeHero. Bạn sẽ nhận được xác nhận qua email khi hoàn tất.');
          
          // Remove paid booking from list
          const updatedBookings = unpaidBookings.filter(b => b.bookingId !== selectedBooking.bookingId);
          setUnpaidBookings(updatedBookings);
          setSelectedBooking(updatedBookings.length > 0 ? updatedBookings[0] : null);
          
          // Reset payment method selection
          setPaymentMethod('');
        } else {
          throw new Error(result.message || 'Payment creation failed');
        }
      } catch (error) {
        console.error('Error creating payment:', error);
        alert(`Có lỗi xảy ra khi tạo thanh toán: ${error.message}. Vui lòng thử lại.`);
        setPaymentStatus('pending');
        setCashConfirmed(false);
      }
    }
  };

  const handleTransferPayment = async () => {
    if (window.confirm('Xác nhận bạn đã chuyển khoản theo thông tin trên?')) {
      setTransferConfirmed(true);
      setPaymentStatus('processing');
      
      try {
        // ✅ THAY ĐỔI: Sử dụng API mới với status "Unpaid"
        const paymentData = {
          bookingId: selectedBooking.bookingId,
          amount: selectedBooking.totalPrice,
          paymentMethod: 'Transfer', // ✅ THAY ĐỔI: Dùng 'Transfer' thay vì 'Momo'
          transactionCode: `TRANSFER${Date.now()}` // Generate transaction code
        };

        const response = await fetch(
          'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Payment/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
          }
        );

        const result = await response.json();

        if (result.isSuccess) {
          setPaymentStatus('completed');
          // ✅ THAY ĐỔI: Message phù hợp với workflow mới
          alert('Xác nhận chuyển khoản thành công! HomeHero sẽ xác minh giao dịch và chuyển tiền cho thợ. Bạn sẽ nhận được xác nhận qua email khi hoàn tất.');
          
          // Remove paid booking from list
          const updatedBookings = unpaidBookings.filter(b => b.bookingId !== selectedBooking.bookingId);
          setUnpaidBookings(updatedBookings);
          setSelectedBooking(updatedBookings.length > 0 ? updatedBookings[0] : null);
          
          // Reset payment method selection
          setPaymentMethod('');
        } else {
          throw new Error(result.message || 'Payment creation failed');
        }
      } catch (error) {
        console.error('Error creating payment:', error);
        alert(`Có lỗi xảy ra khi tạo thanh toán: ${error.message}. Vui lòng thử lại.`);
        setPaymentStatus('pending');
        setTransferConfirmed(false);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã sao chép vào clipboard!');
    }).catch(() => {
      alert('Không thể sao chép. Vui lòng copy thủ công.');
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (unpaidBookings.length === 0) {
    return (
      <div className="page-content">
        <div className="page-header">
          <div className="breadcrumb">
            <span>Pages</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Thanh toán</span>
          </div>
          <h1 className="page-title">💳 Thanh toán dịch vụ</h1>
        </div>
        <div className="payment-container">
          <div className="no-payment-container">
            <div className="no-payment-icon">✅</div>
            <h3>Không có đơn hàng nào cần thanh toán</h3>
            <p>Tất cả đơn hàng của bạn đã được thanh toán hoặc chưa hoàn thành.</p>
            {onBackToTracking && (
              <button onClick={onBackToTracking} className="action-btn primary">
                🏠 Về trang chủ
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Pages</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Thanh toán</span>
        </div>
        <h1 className="page-title">💳 Thanh toán dịch vụ</h1>
        <p className="page-subtitle">
          Bạn có <strong>{unpaidBookings.length}</strong> đơn hàng cần thanh toán
        </p>
      </div>

      <div className="payment-container">
        
        {/* Booking Selection (if multiple) */}
        {unpaidBookings.length > 1 && (
          <div className="booking-selection-section">
            <h3>📋 Chọn đơn hàng cần thanh toán</h3>
            <div className="booking-list">
              {unpaidBookings.map(booking => (
                <div 
                  key={booking.bookingId}
                  className={`booking-item ${selectedBooking?.bookingId === booking.bookingId ? 'selected' : ''}`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="booking-info">
                    <h4>{booking.bookingCode}</h4>
                    <p>{booking.serviceName}</p>
                    <p>Thợ: {booking.technicianName}</p>
                    <small>Hoàn thành: {new Date(booking.completedAt).toLocaleString('vi-VN')}</small>
                  </div>
                  <div className="booking-price">
                    {booking.formattedPrice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Booking Payment Details */}
        {selectedBooking && (
          <>
            {/* Service Summary */}
            <div className="summary-section">
              <h3>📋 Tóm tắt dịch vụ - {selectedBooking.bookingCode}</h3>
              <div className="service-info">
                <div className="service-header">
                  <div className="service-title">{selectedBooking.serviceName}</div>
                  <div className="service-meta">
                    <span>Thợ: {selectedBooking.technicianName}</span>
                    <span>Hoàn thành: {new Date(selectedBooking.completedAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
                
                <div className="service-details">
                  <div className="summary-calculations">
                    <div className="calc-row total">
                      <span>Tổng cộng:</span>
                      <span>{selectedBooking.formattedPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="payment-method-section">
              <h3>💰 Chọn phương thức thanh toán</h3>
              <div className="payment-methods">
                
                {/* ==================== CASH PAYMENT - TEMPORARILY DISABLED ==================== */}
    {/* 
    <div 
      className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
      onClick={() => handlePaymentMethodSelect('cash')}
    >
      <div className="payment-header">
        <div className="payment-icon">💵</div>
        <div className="payment-info">
          <h4>Thanh toán tiền mặt</h4>
          <p>Thanh toán trực tiếp cho thợ sửa chữa</p>
        </div>
        <div className="payment-radio">
          <input 
            type="radio" 
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={() => {}}
          />
        </div>
      </div>
      {paymentMethod === 'cash' && (
        <div className="payment-details">
          <div className="cash-instructions">
            <h5>Hướng dẫn thanh toán tiền mặt:</h5>
            <ul>
              <li>Thanh toán trực tiếp cho thợ sửa chữa tại hiện trường</li>
              <li>Số tiền: <strong>{selectedBooking.formattedPrice}</strong></li>
              <li>✅ <strong>Xác nhận để tạo giao dịch trong hệ thống</strong></li>
              <li>Thợ sẽ thu tiền và chuyển hoa hồng về cho HomeHero</li>
              <li>Bạn sẽ nhận được email xác nhận khi hoàn tất</li>
            </ul>
            
            {!cashConfirmed && paymentStatus === 'pending' && (
              <button 
                onClick={handleCashPayment}
                className="confirm-payment-btn"
              >
                ✅ Xác nhận thanh toán tiền mặt
              </button>
            )}
            
            {paymentStatus === 'processing' && (
              <div className="processing-status">
                <div className="spinner"></div>
                <span>Đang tạo giao dịch...</span>
              </div>
            )}
            
            {paymentStatus === 'completed' && (
              <div className="success-status">
                <span className="success-icon">🎉</span>
                <span>Giao dịch đã được tạo! Chờ xác nhận từ thợ.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    */}
    {/* ==================== END CASH PAYMENT ==================== */}

                {/* Bank Transfer */}
                <div 
                  className={`payment-option ${paymentMethod === 'transfer' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('transfer')}
                >
                  <div className="payment-header">
                    <div className="payment-icon">🏦</div>
                    <div className="payment-info">
                      <h4>Chuyển khoản ngân hàng</h4>
                      <p>Chuyển khoản trực tiếp cho HomeHero</p>
                    </div>
                    <div className="payment-radio">
                      <input 
                        type="radio" 
                        name="paymentMethod"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                  {paymentMethod === 'transfer' && (
  <VietQROfficial 
    selectedBooking={selectedBooking}
    bankInfo={bankInfo}
    copyToClipboard={copyToClipboard}
    handleTransferPayment={handleTransferPayment}
    transferConfirmed={transferConfirmed}
    paymentStatus={paymentStatus}
  />
)}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Payment Support */}
        <div className="support-section">
          <h3>🆘 Hỗ trợ thanh toán</h3>
          <div className="support-options">
            <div className="support-item">
              <div className="support-icon">📞</div>
              <div className="support-info">
                <h4>Hotline hỗ trợ</h4>
                <p>1900-xxxx (24/7)</p>
              </div>
            </div>
            
            <div className="support-item">
              <div className="support-icon">💬</div>
              <div className="support-info">
                <h4>Chat trực tuyến</h4>
                <p>Hỗ trợ từ 8:00 - 22:00</p>
              </div>
            </div>
            
            <div className="support-item">
              <div className="support-icon">✉️</div>
              <div className="support-info">
                <h4>Email hỗ trợ</h4>
                <p>support@homehero.vn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {paymentStatus === 'completed' && (
          <div className="actions-section">
            <button className="action-btn secondary">📋 Xem trạng thái thanh toán</button>
            <button className="action-btn secondary">⭐ Đánh giá dịch vụ</button>
            <button className="action-btn secondary">🏠 Về trang chủ</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;