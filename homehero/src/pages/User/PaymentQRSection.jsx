import React, { useState, useEffect } from 'react';

const VietQROfficial = ({ selectedBooking, handleTransferPayment, transferConfirmed, paymentStatus }) => {
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Bank info
  const bankInfo = {
    bankCode: '970418', // BIDV bank code
    accountNumber: '8853038462',
    accountName: 'NGUYEN PHUC THANH',
    bankName: 'Ngân hàng TMCP Đầu tư & Phát triển Việt Nam'
  };

  const generateVietQR = async () => {
    if (!selectedBooking) return;
    
    setLoading(true);
    setError('');
    
    try {
      const amount = selectedBooking.totalPrice;
      const description = `HomeHero ${selectedBooking.bookingCode}`;
      
      // Call VietQR API
      const response = await fetch('https://api.vietqr.io/v2/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNo: bankInfo.accountNumber,
          accountName: bankInfo.accountName,
          acqId: bankInfo.bankCode,
          amount: amount,
          addInfo: description,
          format: 'text',
          template: 'compact'
        })
      });

      const data = await response.json();
      
      if (data.code === '00') {
        setQrImageUrl(data.data.qrDataURL);
      } else {
        throw new Error(data.desc || 'Lỗi tạo QR code');
      }
    } catch (error) {
      console.error('VietQR Error:', error);
      setError('Không thể tạo QR code. Vui lòng sử dụng thông tin chuyển khoản thủ công.');
      // Fallback to manual QR generation
      generateFallbackQR();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackQR = () => {
    const amount = selectedBooking?.totalPrice || 0;
    const description = `HomeHero ${selectedBooking?.bookingCode || ''}`;
    
    // Simple QR data that most apps can read
    const qrData = `BIDV:${bankInfo.accountNumber}:${bankInfo.accountName}:${amount}:${description}`;
    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    setQrImageUrl(fallbackUrl);
  };

  useEffect(() => {
    if (selectedBooking) {
      generateVietQR();
    }
  }, [selectedBooking]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã sao chép vào clipboard!');
    }).catch(() => {
      alert('Không thể sao chép. Vui lòng copy thủ công.');
    });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', margin: '20px 0' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#1f2937' }}>
        🏦 Thông tin chuyển khoản
      </h3>
      
      {/* Bank Details */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'grid', gap: '15px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Ngân hàng:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>BIDV</span>
              <button 
                onClick={() => copyToClipboard('BIDV')}
                style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
              >
                📋
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Số tài khoản:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#2563eb' }}>{bankInfo.accountNumber}</span>
              <button 
                onClick={() => copyToClipboard(bankInfo.accountNumber)}
                style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
              >
                📋
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Tên tài khoản:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>{bankInfo.accountName}</span>
              <button 
                onClick={() => copyToClipboard(bankInfo.accountName)}
                style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
              >
                📋
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Số tiền:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#dc2626' }}>
                {selectedBooking?.formattedPrice || '0 VNĐ'}
              </span>
              <button 
                onClick={() => copyToClipboard(selectedBooking?.totalPrice?.toString() || '0')}
                style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
              >
                📋
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Nội dung CK:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#059669' }}>
                HomeHero {selectedBooking?.bookingCode || ''}
              </span>
              <button 
                onClick={() => copyToClipboard(`HomeHero ${selectedBooking?.bookingCode || ''}`)}
                style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '15px', color: '#374151' }}>📱 QR Code chuyển khoản</h4>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          display: 'inline-block',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {loading && (
            <div style={{ padding: '50px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              <p>Đang tạo QR code...</p>
            </div>
          )}

          {error && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626'
            }}>
              <p>{error}</p>
            </div>
          )}

          {qrImageUrl && !loading && (
            <>
              <img 
                src={qrImageUrl}
                alt="QR Code Chuyển Khoản VietQR"
                style={{ 
                  width: '250px', 
                  height: '250px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <div style={{ marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
                <p>📱 Quét mã QR bằng app ngân hàng</p>
                <p>Hỗ trợ: Internet Banking, Mobile Banking, Ví điện tử</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '8px',
        border: '1px solid #fbbf24'
      }}>
        <h4 style={{ color: '#92400e', marginBottom: '10px' }}>⚠️ Lưu ý quan trọng:</h4>
        <ul style={{ color: '#92400e', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
          <li>Vui lòng chuyển khoản <strong>đúng số tiền</strong> và <strong>đúng nội dung</strong></li>
          <li>Nội dung chuyển khoản: <strong>HomeHero {selectedBooking?.bookingCode}</strong></li>
          <li>Sau khi chuyển khoản, ấn nút <strong>"Xác nhận đã chuyển khoản"</strong></li>
          <li>Thời gian xử lý: 1-2 giờ làm việc</li>
        </ul>
      </div>


      {/* Nút xác nhận chuyển khoản */}
      <div style={{ marginTop: '25px' }}>
        {!transferConfirmed && paymentStatus === 'pending' && (
          <button 
            onClick={handleTransferPayment}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#047857';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
            }}
          >
            <span style={{ fontSize: '20px' }}>✅</span>
            <span>Xác nhận đã chuyển khoản</span>
          </button>
        )}
        
        {paymentStatus === 'processing' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: '#dbeafe',
            borderRadius: '10px',
            color: '#1e40af',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '3px solid #93c5fd',
              borderTop: '3px solid #1e40af',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Đang tạo giao dịch...</span>
          </div>
        )}
        
        {paymentStatus === 'completed' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: '#dcfce7',
            borderRadius: '10px',
            color: '#166534',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            <span style={{ fontSize: '24px' }}>🎉</span>
            <span>Giao dịch đã được tạo! Chờ admin xác minh.</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VietQROfficial;