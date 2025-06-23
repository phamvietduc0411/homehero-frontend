import React, { useState } from 'react';
import UserSidebarMenu from '../../components/User/UserSidebarMenu';
import '../../styles/User/DashboardPage.css'; // General dashboard styles
import '../../styles/User/UserSidebarMenu.css'; // Sidebar specific styles
import '../../styles/User/Payment.css'; // Specific styles for the Payment page
import QR from '../../assets/img/download.png'

const Payment = () => {
  // Sample booking data for payment
  const [bookingData] = useState({
    bookingId: 'BK20250623001',
    serviceType: 'Sửa chữa điều hòa',
    technicianName: 'Trần Văn Bình',
    completedAt: '2025-06-25 16:30',
    serviceDetails: [
      { item: 'Vệ sinh điều hòa', price: 150000 },
      { item: 'Thay gas R32', price: 200000 },
      { item: 'Kiểm tra và sửa chữa', price: 100000 }
    ],
    subtotal: 450000,
    urgencyFee: 0,
    discount: 0,
    total: 450000
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, completed
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  // Bank account info for transfer
  const bankInfo = {
    bankName: 'Ngân hàng BIDV',
    accountNumber: '12345678901',
    accountName: 'CONG TY HOMEHERO',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8dGV4dCB4PSIxMDAiIHk9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4='
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setCashConfirmed(false);
    setTransferConfirmed(false);
    setPaymentStatus('pending');
  };

  const handleCashPayment = () => {
    if (window.confirm('Xác nhận bạn đã thanh toán tiền mặt cho thợ sửa chữa?')) {
      setCashConfirmed(true);
      setPaymentStatus('processing');
      
      // Simulate processing time
      setTimeout(() => {
        setPaymentStatus('completed');
        alert('Thanh toán thành công! Thợ sẽ chuyển hoa hồng về cho HomeHero.');
      }, 2000);
    }
  };

  const handleTransferPayment = () => {
    if (window.confirm('Xác nhận bạn đã chuyển khoản theo thông tin trên?')) {
      setTransferConfirmed(true);
      setPaymentStatus('processing');
      
      // Simulate processing time
      setTimeout(() => {
        setPaymentStatus('completed');
        alert('Thanh toán thành công! Chúng tôi sẽ chuyển tiền cho thợ sau khi xác minh.');
      }, 3000);
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
          Mã đơn hàng: <strong>{bookingData.bookingId}</strong>
        </p>
      </div>

      <div className="payment-container">
        
        {/* Service Summary */}
        <div className="summary-section">
          <h3>📋 Tóm tắt dịch vụ</h3>
          <div className="service-info">
            <div className="service-header">
              <div className="service-title">{bookingData.serviceType}</div>
              <div className="service-meta">
                <span>Thợ: {bookingData.technicianName}</span>
                <span>Hoàn thành: {bookingData.completedAt}</span>
              </div>
            </div>
            
            <div className="service-details">
              {bookingData.serviceDetails.map((item, index) => (
                <div key={index} className="detail-row">
                  <span className="detail-item">{item.item}</span>
                  <span className="detail-price">{formatCurrency(item.price)}</span>
                </div>
              ))}
              
              <div className="summary-calculations">
                <div className="calc-row">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(bookingData.subtotal)}</span>
                </div>
                {bookingData.urgencyFee > 0 && (
                  <div className="calc-row">
                    <span>Phí khẩn cấp:</span>
                    <span>{formatCurrency(bookingData.urgencyFee)}</span>
                  </div>
                )}
                {bookingData.discount > 0 && (
                  <div className="calc-row discount">
                    <span>Giảm giá:</span>
                    <span>-{formatCurrency(bookingData.discount)}</span>
                  </div>
                )}
                <div className="calc-row total">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(bookingData.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="payment-method-section">
          <h3>💰 Chọn phương thức thanh toán</h3>
          <div className="payment-methods">
            
            {/* Cash Payment */}
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
                      <li>Số tiền: <strong>{formatCurrency(bookingData.total)}</strong></li>
                      <li>Thợ sẽ chuyển hoa hồng về cho HomeHero</li>
                      <li>Bạn sẽ nhận được hóa đơn điện tử qua email</li>
                    </ul>
                    
                    {!cashConfirmed && paymentStatus === 'pending' && (
                      <button 
                        onClick={handleCashPayment}
                        className="confirm-payment-btn"
                      >
                        ✅ Xác nhận đã thanh toán tiền mặt
                      </button>
                    )}
                    
                    {paymentStatus === 'processing' && (
                      <div className="processing-status">
                        <div className="spinner"></div>
                        <span>Đang xử lý thanh toán...</span>
                      </div>
                    )}
                    
                    {paymentStatus === 'completed' && (
                      <div className="success-status">
                        <span className="success-icon">🎉</span>
                        <span>Thanh toán thành công!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
                <div className="payment-details">
                  <div className="transfer-info">
                    <h5>Thông tin chuyển khoản:</h5>
                    
                    <div className="bank-details">
                      <div className="bank-info-grid">
                        <div className="bank-item">
                          <span className="label">Ngân hàng:</span>
                          <span className="value">{bankInfo.bankName}</span>
                          <button 
                            onClick={() => copyToClipboard(bankInfo.bankName)}
                            className="copy-btn"
                          >
                            📋
                          </button>
                        </div>
                        
                        <div className="bank-item">
                          <span className="label">Số tài khoản:</span>
                          <span className="value">{bankInfo.accountNumber}</span>
                          <button 
                            onClick={() => copyToClipboard(bankInfo.accountNumber)}
                            className="copy-btn"
                          >
                            📋
                          </button>
                        </div>
                        
                        <div className="bank-item">
                          <span className="label">Tên tài khoản:</span>
                          <span className="value">{bankInfo.accountName}</span>
                          <button 
                            onClick={() => copyToClipboard(bankInfo.accountName)}
                            className="copy-btn"
                          >
                            📋
                          </button>
                        </div>
                        
                        <div className="bank-item">
                          <span className="label">Số tiền:</span>
                          <span className="value amount">{formatCurrency(bookingData.total)}</span>
                          <button 
                            onClick={() => copyToClipboard(bookingData.total.toString())}
                            className="copy-btn"
                          >
                            📋
                          </button>
                        </div>
                        
                        <div className="bank-item">
                          <span className="label">Nội dung CK:</span>
                          <span className="value">HomeHero {bookingData.bookingId}</span>
                          <button 
                            onClick={() => copyToClipboard(`HomeHero ${bookingData.bookingId}`)}
                            className="copy-btn"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      
                      <div className="qr-section">
                        <h6>QR Code chuyển khoản:</h6>
                        <div className="qr-code">
                          <img 
                            src={bankInfo.qrCode} 
                            alt="QR Code" 
                            className="qr-image"
                          />
                          <p>Quét mã QR để chuyển khoản nhanh</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="transfer-instructions">
                      <h6>Lưu ý quan trọng:</h6>
                      <ul>
                        <li>Vui lòng chuyển khoản đúng số tiền và nội dung</li>
                        <li>HomeHero sẽ chuyển tiền cho thợ sau khi xác minh</li>
                        <li>Thời gian xử lý: 1-2 giờ làm việc</li>
                        <li>Liên hệ hotline nếu có vấn đề: 1900-xxxx</li>
                      </ul>
                    </div>
                    
                    {!transferConfirmed && paymentStatus === 'pending' && (
                      <button 
                        onClick={handleTransferPayment}
                        className="confirm-payment-btn"
                      >
                        ✅ Xác nhận đã chuyển khoản
                      </button>
                    )}
                    
                    {paymentStatus === 'processing' && (
                      <div className="processing-status">
                        <div className="spinner"></div>
                        <span>Đang xác minh giao dịch...</span>
                      </div>
                    )}
                    
                    {paymentStatus === 'completed' && (
                      <div className="success-status">
                        <span className="success-icon">🎉</span>
                        <span>Thanh toán thành công!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
            <button className="action-btn primary">📄 Tải hóa đơn</button>
            <button className="action-btn secondary">⭐ Đánh giá dịch vụ</button>
            <button className="action-btn secondary">🏠 Về trang chủ</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment; 