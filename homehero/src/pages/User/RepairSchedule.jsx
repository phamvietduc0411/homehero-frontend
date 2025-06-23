import React, { useState } from 'react';
import UserSidebarMenu from '../../components/User/UserSidebarMenu';
import '../../styles/User/DashboardPage.css'; // Import the general dashboard styles
import '../../styles/User/RepairSchedule.css'; // Import the specific CSS for this page



const RepairSchedule = ({ onNavigateToTracking }) => {
  console.log('RepairSchedule component loaded!');
  const [formData, setFormData] = useState({
    serviceType: '',
    applianceType: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
    customerName: '',
    customerPhone: '',
    urgencyLevel: 'normal',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách dịch vụ
  const serviceTypes = [
    { id: 'electrical', name: 'Sửa chữa điện', icon: '🔌', basePrice: '200,000 ₫' },
    { id: 'plumbing', name: 'Sửa chữa nước', icon: '🚿', basePrice: '150,000 ₫' },
    { id: 'aircon', name: 'Sửa chữa điều hòa', icon: '❄️', basePrice: '300,000 ₫' },
    { id: 'washing-machine', name: 'Sửa máy giặt', icon: '🧺', basePrice: '250,000 ₫' },
    { id: 'refrigerator', name: 'Sửa tủ lạnh', icon: '🧊', basePrice: '280,000 ₫' },
    { id: 'tv-audio', name: 'Sửa TV & âm thanh', icon: '📺', basePrice: '200,000 ₫' }
  ];

  // Danh sách loại thiết bị theo dịch vụ
  const applianceTypes = {
    electrical: ['Ổ cắm điện', 'Công tắc điện', 'Đèn LED', 'Quạt trần', 'Khác'],
    plumbing: ['Vòi nước', 'Bồn rửa', 'Toilet', 'Vòi sen', 'Đường ống', 'Khác'],
    aircon: ['Điều hòa 1 chiều', 'Điều hòa inverter', 'Điều hòa tủ đứng', 'Khác'],
    'washing-machine': ['Máy giặt cửa trước', 'Máy giặt cửa trên', 'Máy giặt sấy', 'Khác'],
    refrigerator: ['Tủ lạnh 1 cánh', 'Tủ lạnh 2 cánh', 'Tủ lạnh side by side', 'Tủ đông', 'Khác'],
    'tv-audio': ['Smart TV', 'TV LED', 'Dàn âm thanh', 'Loa bluetooth', 'Khác']
  };

  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00', 
    '14:00 - 16:00',
    '16:00 - 18:00',
    '19:00 - 21:00'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 3) {
      alert('Chỉ được tải lên tối đa 3 hình ảnh');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.serviceType) newErrors.serviceType = 'Vui lòng chọn loại dịch vụ';
    if (!formData.applianceType) newErrors.applianceType = 'Vui lòng chọn loại thiết bị';
    if (!formData.description.trim()) newErrors.description = 'Vui lòng mô tả chi tiết sự cố';
    if (!formData.preferredDate) newErrors.preferredDate = 'Vui lòng chọn ngày mong muốn';
    if (!formData.preferredTime) newErrors.preferredTime = 'Vui lòng chọn khung giờ';
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.customerName.trim()) newErrors.customerName = 'Vui lòng nhập họ tên';
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate booking ID (in real app, this would come from API)
      const bookingId = 'BK' + Date.now().toString().slice(-8);
      
      // Create booking data for tracking page
      const bookingData = {
        bookingId: bookingId,
        status: 'Pending',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        serviceType: serviceTypes.find(s => s.id === formData.serviceType)?.name || formData.serviceType,
        applianceType: formData.applianceType,
        description: formData.description,
        address: formData.address,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        urgencyLevel: formData.urgencyLevel,
        estimatedPrice: serviceTypes.find(s => s.id === formData.serviceType)?.basePrice || '200,000 ₫',
        actualPrice: null,
        technicianInfo: null,
        createdAt: new Date().toLocaleString('vi-VN'),
        updatedAt: new Date().toLocaleString('vi-VN'),
        statusHistory: [
          { 
            status: 'Pending', 
            timestamp: new Date().toLocaleString('vi-VN'), 
            note: 'Đơn hàng đã được tạo và đang chờ xử lý' 
          }
        ]
      };
      
      // Navigate to tracking page with booking data OR show success message
      if (onNavigateToTracking) {
        onNavigateToTracking(bookingData);
      } else {
        // Fallback: show success message and reset form
        alert(`Đặt lịch thành công! Mã đơn hàng: ${bookingId}\nChúng tôi sẽ liên hệ với bạn trong vòng 30 phút.`);
        
        // Reset form
        setFormData({
          serviceType: '',
          applianceType: '',
          description: '',
          preferredDate: '',
          preferredTime: '',
          address: '',
          customerName: '',
          customerPhone: '',
          urgencyLevel: 'normal',
          images: []
        });
      }
      
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle button click removed - no longer needed

  const selectedService = serviceTypes.find(s => s.id === formData.serviceType);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Pages</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Đặt lịch sửa chữa</span>
        </div>
        <h1 className="page-title">📅 Đặt lịch sửa chữa</h1>
        <p className="page-subtitle">
          Chọn dịch vụ và đặt lịch hẹn với kỹ thuật viên chuyên nghiệp
        </p>
      </div>

      <div className="booking-form-container">
        <form onSubmit={handleSubmit} className="booking-form">
          
          {/* Service Selection */}
          <div className="form-section">
            <h3 className="section-title">1. Chọn loại dịch vụ</h3>
            <div className="services-grid">
              {serviceTypes.map(service => (
                <div 
                  key={service.id}
                  className={`service-card ${formData.serviceType === service.id ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    serviceType: service.id,
                    applianceType: '' // Reset appliance type when service changes
                  }))}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h4>{service.name}</h4>
                  <div className="service-price">Từ {service.basePrice}</div>
                </div>
              ))}
            </div>
            {errors.serviceType && <div className="error-message">{errors.serviceType}</div>}
          </div>

          {/* Appliance Type */}
          {formData.serviceType && (
            <div className="form-section">
              <h3 className="section-title">2. Loại thiết bị cần sửa</h3>
              <select 
                name="applianceType"
                value={formData.applianceType}
                onChange={handleInputChange}
                className={`form-select ${errors.applianceType ? 'error' : ''}`}
              >
                <option value="">Chọn loại thiết bị</option>
                {applianceTypes[formData.serviceType]?.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.applianceType && <div className="error-message">{errors.applianceType}</div>}
            </div>
          )}

          {/* Problem Description */}
          <div className="form-section">
            <h3 className="section-title">3. Mô tả sự cố</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả chi tiết sự cố bạn đang gặp phải..."
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              rows="4"
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          {/* Schedule */}
          <div className="form-section">
            <h3 className="section-title">4. Thời gian mong muốn</h3>
            <div className="schedule-inputs">
              <div className="input-group">
                <label>Ngày mong muốn</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`form-input ${errors.preferredDate ? 'error' : ''}`}
                />
                {errors.preferredDate && <div className="error-message">{errors.preferredDate}</div>}
              </div>
              
              <div className="input-group">
                <label>Khung giờ</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className={`form-select ${errors.preferredTime ? 'error' : ''}`}
                >
                  <option value="">Chọn khung giờ</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.preferredTime && <div className="error-message">{errors.preferredTime}</div>}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="form-section">
            <h3 className="section-title">5. Thông tin khách hàng</h3>
            <div className="customer-inputs">
              <div className="input-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className={`form-input ${errors.customerName ? 'error' : ''}`}
                  required
                />
                {errors.customerName && <div className="error-message">{errors.customerName}</div>}
              </div>
              
              <div className="input-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className={`form-input ${errors.customerPhone ? 'error' : ''}`}
                  required
                />
                {errors.customerPhone && <div className="error-message">{errors.customerPhone}</div>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="form-section">
            <h3 className="section-title">6. Địa chỉ sửa chữa</h3>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ chi tiết (số nhà, đường, quận/huyện, thành phố)"
              className={`form-textarea ${errors.address ? 'error' : ''}`}
              rows="3"
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          {/* Urgency Level */}
          <div className="form-section">
            <h3 className="section-title">7. Mức độ khẩn cấp</h3>
            <div className="urgency-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="urgencyLevel"
                  value="normal"
                  checked={formData.urgencyLevel === 'normal'}
                  onChange={handleInputChange}
                />
                <span className="radio-label">
                  <span className="urgency-icon">📅</span>
                  Bình thường (trong 24h)
                </span>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="urgencyLevel"
                  value="urgent"
                  checked={formData.urgencyLevel === 'urgent'}
                  onChange={handleInputChange}
                />
                <span className="radio-label">
                  <span className="urgency-icon">⚡</span>
                  Khẩn cấp (trong 4h) +50,000₫
                </span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <h3 className="section-title">8. Hình ảnh sự cố (tùy chọn)</h3>
            <div className="image-upload-section">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                📸 Chọn hình ảnh (tối đa 3 ảnh)
              </label>
              
              {formData.images.length > 0 && (
                <div className="image-preview">
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-item">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`}
                        className="preview-image"
                      />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {selectedService && (
            <div className="booking-summary">
              <h3>📋 Tóm tắt đơn hàng</h3>
              <div className="summary-item">
                <span>Dịch vụ:</span>
                <span>{selectedService.name}</span>
              </div>
              {formData.applianceType && (
                <div className="summary-item">
                  <span>Thiết bị:</span>
                  <span>{formData.applianceType}</span>
                </div>
              )}
              <div className="summary-item">
                <span>Phí cơ bản:</span>
                <span>{selectedService.basePrice}</span>
              </div>
              {formData.urgencyLevel === 'urgent' && (
                <div className="summary-item urgent">
                  <span>Phí khẩn cấp:</span>
                  <span>+50,000₫</span>
                </div>
              )}
              <div className="summary-note">
                * Giá cuối cùng sẽ được xác nhận bởi kỹ thuật viên tại hiện trường
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Đang xử lý...
              </>
            ) : (
              'Gửi yêu cầu đặt lịch'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RepairSchedule;
