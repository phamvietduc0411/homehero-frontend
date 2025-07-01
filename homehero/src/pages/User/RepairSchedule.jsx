import React, { useState, useEffect } from 'react';
import UserSidebarMenu from '../../components/User/UserSidebarMenu';
import '../../styles/User/DashboardPage.css'; // Import the general dashboard styles
import '../../styles/User/RepairSchedule.css'; // Import the specific CSS for this page




const RepairSchedule = ({ onNavigateToTracking }) => {
  const [formData, setFormData] = useState({
    serviceType: '', // Now stores ServiceId instead of service type string
    applianceType: '', // This will be the specific service from Services table
    description: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
    customerName: '',
    customerPhone: '',
    urgencyLevel: 'normal'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🆕 API Data States
  const [serviceCategories, setServiceCategories] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [priceInfo, setPriceInfo] = useState(null);
  const [availableTechnicians, setAvailableTechnicians] = useState([]);

  // 🔗 API Configuration
  const API_BASE_URL = 'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api';

  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00', 
    '14:00 - 16:00',
    '16:00 - 18:00',
    '19:00 - 21:00'
  ];

  // 🚀 Fetch Service Categories on component mount
  useEffect(() => {
    fetchServiceCategories();
  }, []);

  // 🔍 Fetch Services when category changes
  useEffect(() => {
    if (formData.serviceType) {
      fetchServicesByCategory(formData.serviceType);
    } else {
      setAvailableServices([]);
      setPriceInfo(null);
    }
  }, [formData.serviceType]);

  // 💰 Fetch Price when service and urgency changes
  useEffect(() => {
    if (formData.applianceType) {
      fetchServicePrice(formData.applianceType, formData.urgencyLevel);
    }
  }, [formData.applianceType, formData.urgencyLevel]);

  // 🔧 Fetch Available Technicians when date, time, and address change
  useEffect(() => {
    if (formData.applianceType && formData.preferredDate && formData.preferredTime && formData.address) {
      fetchAvailableTechnicians();
    }
  }, [formData.applianceType, formData.preferredDate, formData.preferredTime, formData.address]);

  // 📦 API Functions
  const fetchServiceCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ServiceCategory`);
      if (!response.ok) throw new Error('Failed to fetch service categories');
      
      const categories = await response.json();
      setServiceCategories(categories);
    } catch (error) {
      console.error('Error fetching service categories:', error);
      // Fallback to original hardcoded data
      setServiceCategories([
        { categoryId: 1, categoryName: 'Sửa chữa điện', iconUrl: '🔌', basePrice: 'Từ 200,000 ₫' },
        { categoryId: 2, categoryName: 'Sửa chữa nước', iconUrl: '🚿', basePrice: 'Từ 150,000 ₫' },
        { categoryId: 3, categoryName: 'Sửa chữa điều hòa', iconUrl: '❄️', basePrice: 'Từ 300,000 ₫' },
        { categoryId: 4, categoryName: 'Sửa máy giặt', iconUrl: '🧺', basePrice: 'Từ 250,000 ₫' },
        { categoryId: 5, categoryName: 'Sửa tủ lạnh', iconUrl: '🧊', basePrice: 'Từ 280,000 ₫' },
        { categoryId: 6, categoryName: 'Sửa TV & âm thanh', iconUrl: '📺', basePrice: 'Từ 200,000 ₫' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesByCategory = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Service/category/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch services');
      
      const services = await response.json();
      setAvailableServices(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback data based on category
      setAvailableServices([
        { serviceId: 1, serviceName: 'Sửa chữa cơ bản', description: 'Dịch vụ sửa chữa thông thường', price: 200000 },
        { serviceId: 2, serviceName: 'Sửa chữa nâng cao', description: 'Dịch vụ sửa chữa phức tạp', price: 350000 }
      ]);
    }
  };

  const fetchServicePrice = async (serviceId, urgencyLevel) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Service/${serviceId}/price?urgencyLevel=${urgencyLevel}`);
      if (!response.ok) throw new Error('Failed to fetch price');
      
      const priceData = await response.json();
      setPriceInfo(priceData);
    } catch (error) {
      console.error('Error fetching price:', error);
      // Fallback price calculation
      const basePrice = 200000;
      const urgencyFee = urgencyLevel === 'urgent' ? 50000 : 0;
      setPriceInfo({
        basePrice,
        urgencyFee,
        totalPrice: basePrice + urgencyFee,
        formattedPrice: new Intl.NumberFormat('vi-VN').format(basePrice + urgencyFee) + ' ₫'
      });
    }
  };

  const fetchAvailableTechnicians = async () => {
    try {
      // Parse address to get ward and district
      const addressParts = formData.address.split(',').map(part => part.trim());
      const ward = addressParts[1] || '';
      const district = addressParts[2] || '';
      
      if (!ward || !district) return;

      const queryParams = new URLSearchParams({
        serviceId: formData.applianceType,
        date: formData.preferredDate,
        timeSlot: formData.preferredTime,
        ward: ward,
        district: district
      });

      const response = await fetch(`${API_BASE_URL}/Booking/available-technicians?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch available technicians');
      
      const result = await response.json();
      if (result.isSuccess) {
        setAvailableTechnicians(result.data);
      }
    } catch (error) {
      console.error('Error fetching available technicians:', error);
      setAvailableTechnicians([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for service category change
    if (name === 'serviceType') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        applianceType: '' // Reset service selection when category changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.serviceType) newErrors.serviceType = 'Vui lòng chọn loại dịch vụ';
    if (!formData.applianceType) newErrors.applianceType = 'Vui lòng chọn dịch vụ cụ thể';
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
    
    // 📤 Declare variables outside try block để có thể access trong catch
    let bookingData = null;
    let addressParts = [];
    
    try {
      // Parse address to get components - cải thiện parsing logic
      addressParts = formData.address.split(',').map(part => part.trim());

      // Parse booking date and time - sử dụng format chuẩn ISO 8601
      const [startTime] = formData.preferredTime.split(' - ');
      const bookingDateTime = `${formData.preferredDate}T${startTime}:00.000Z`;

      // 📤 Prepare booking data for API - theo schema đã test thành công
      bookingData = {
        serviceId: parseInt(formData.applianceType),
        bookingDate: bookingDateTime,
        preferredTimeSlot: formData.preferredTime,
        problemDescription: formData.description,
        urgencyLevel: formData.urgencyLevel,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        street: addressParts[0] || '',
        ward: addressParts[1] || '',
        district: addressParts[2] || '',
        city: addressParts[3] || 'TP.HCM',
        userId: 2 // Fixed userId theo yêu cầu
      };

      // 🚀 Call API với debug logging chi tiết
      console.log('=== DEBUGGING BOOKING DATA ===');
      console.log('Form Data:', formData);
      console.log('Address Parts:', addressParts);
      console.log('Booking DateTime:', bookingDateTime);
      console.log('Service ID (parsed):', parseInt(formData.applianceType));
      console.log('Final Booking Data:', bookingData);
      console.log('JSON String:', JSON.stringify(bookingData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/Booking/createform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      // Lấy response text để debug
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed response data:', result);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status, response.statusText);
        console.error('❌ Response body:', responseText);
        
        // Parse chi tiết lỗi từ response
        let errorDetails = responseText;
        try {
          if (result && result.message) {
            errorDetails = result.message;
          } else if (result && result.errors) {
            // Handle validation errors
            errorDetails = Object.values(result.errors).flat().join(', ');
          }
        } catch (e) {
          // Keep original response text if parsing fails
        }
        
        throw new Error(`HTTP ${response.status}: ${errorDetails}`);
      }

      if (result && result.isSuccess === false) {
        console.error('❌ API Error - Success false:', result);
        throw new Error(result.message || 'API returned success: false');
      }

      // 🎉 Success handling - cải thiện xử lý response
      const responseData = result.data || result;
      const bookingResult = {
        bookingId: responseData.bookingId || responseData.id,
        bookingCode: responseData.bookingCode || responseData.code || `BK${Date.now()}`,
        status: responseData.status || 'Pending',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        serviceType: serviceCategories.find(c => c.categoryId == formData.serviceType)?.categoryName,
        serviceName: availableServices.find(s => s.serviceId == formData.applianceType)?.serviceName,
        description: formData.description,
        address: formData.address,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        urgencyLevel: formData.urgencyLevel,
        totalPrice: responseData.totalPrice || priceInfo?.totalPrice,
        createdAt: responseData.createdAt || new Date().toISOString(),
        message: result.message || 'Đặt lịch thành công!'
      };
      
      console.log('✅ Booking Result:', bookingResult);
      
      // 🎉 Success - Show alert first, then navigate
      alert(`✅ ${bookingResult.message}\nMã đơn hàng: ${bookingResult.bookingCode}`);
      
      // Reset form after successful submission
      setFormData({
        serviceType: '',
        applianceType: '',
        description: '',
        preferredDate: '',
        preferredTime: '',
        address: '',
        customerName: '',
        customerPhone: '',
        urgencyLevel: 'normal'
      });
      setPriceInfo(null);
      setAvailableTechnicians([]);

      // Navigate to tracking page nếu có callback (với delay để user đọc được thông báo)
      if (onNavigateToTracking) {
        setTimeout(() => {
          try {
            onNavigateToTracking(bookingResult);
          } catch (navError) {
            console.error('Navigation error:', navError);
            // Fallback: không navigate nếu có lỗi
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('=== ERROR DETAILS ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Form data at error:', formData);
      console.error('Booking data at error:', bookingData);
      
      // Hiển thị lỗi chi tiết cho user với thông báo tiếng Việt
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
      } else if (error.message.includes('NetworkError')) {
        errorMessage = 'Lỗi mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
      }
      
      alert(`❌ Có lỗi xảy ra khi đặt lịch:\n${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎨 Loading component
  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu dịch vụ...</p>
        </div>
      </div>
    );
  }

  // Get selected category and service info
  const selectedCategory = serviceCategories.find(c => c.categoryId == formData.serviceType);
  const selectedService = availableServices.find(s => s.serviceId == formData.applianceType);

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
          
          {/* Service Category Selection */}
          <div className="form-section">
            <h3 className="section-title">1. Chọn loại dịch vụ</h3>
            <div className="services-grid">
              {serviceCategories.map(category => (
                <div 
                  key={category.categoryId}
                  className={`service-card ${formData.serviceType == category.categoryId ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    serviceType: category.categoryId,
                    applianceType: '' // Reset service selection when category changes
                  }))}
                >
                  <div className="service-icon">{category.iconUrl || '🔧'}</div>
                  <h4>{category.categoryName}</h4>
                  <div className="service-price">{category.basePrice || 'Liên hệ'}</div>
                </div>
              ))}
            </div>
            {errors.serviceType && <div className="error-message">{errors.serviceType}</div>}
          </div>

          {/* Specific Service Selection */}
          {formData.serviceType && availableServices.length > 0 && (
            <div className="form-section">
              <h3 className="section-title">2. Chọn dịch vụ cụ thể</h3>
              <select 
                name="applianceType"
                value={formData.applianceType}
                onChange={handleInputChange}
                className={`form-select ${errors.applianceType ? 'error' : ''}`}
              >
                <option value="">Chọn dịch vụ cần sửa chữa</option>
                {availableServices.map(service => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName} - {new Intl.NumberFormat('vi-VN').format(service.price)} ₫
                  </option>
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
              placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, thành phố)"
              className={`form-textarea ${errors.address ? 'error' : ''}`}
              rows="3"
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
            <div className="address-note">
              💡 Ví dụ: 123 Nguyễn Văn A, Phường Bến Nghé, Quận 1, TP.HCM
            </div>
          </div>

          {/* Available Technicians Display */}
          {availableTechnicians.length > 0 && (
            <div className="form-section">
              <h3 className="section-title">🔧 Kỹ thuật viên có sẵn</h3>
              <div className="technicians-info">
                <p>✅ Có {availableTechnicians.length} kỹ thuật viên có thể phục vụ bạn</p>
                <div className="technician-list">
                  {availableTechnicians.slice(0, 3).map((tech, index) => (
                    <div key={index} className="technician-card">
                      <span className="tech-name">{tech.name || `Kỹ thuật viên #${index + 1}`}</span>
                      <span className="tech-rating">⭐ {tech.rating || '4.5'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                  Khẩn cấp (trong 4h) +{new Intl.NumberFormat('vi-VN').format(50000)}₫
                </span>
              </label>
            </div>
          </div>

          {/* Price Summary */}
          {priceInfo && selectedService && (
            <div className="booking-summary">
              <h3>📋 Tóm tắt đơn hàng</h3>
              <div className="summary-item">
                <span>Loại dịch vụ:</span>
                <span>{selectedCategory?.categoryName}</span>
              </div>
              <div className="summary-item">
                <span>Dịch vụ:</span>
                <span>{selectedService.serviceName}</span>
              </div>
              <div className="summary-item">
                <span>Phí cơ bản:</span>
                <span>{new Intl.NumberFormat('vi-VN').format(priceInfo.basePrice)} ₫</span>
              </div>
              {formData.urgencyLevel === 'urgent' && priceInfo.urgencyFee > 0 && (
                <div className="summary-item urgent">
                  <span>Phí khẩn cấp:</span>
                  <span>+{new Intl.NumberFormat('vi-VN').format(priceInfo.urgencyFee)} ₫</span>
                </div>
              )}
              <div className="summary-item total">
                <span><strong>Tổng chi phí dự kiến:</strong></span>
                <span><strong>{priceInfo.formattedPrice}</strong></span>
              </div>
              <div className="summary-note">
                💡 Giá cuối cùng sẽ được xác nhận bởi kỹ thuật viên tại hiện trường
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || !selectedService}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                <i className="fas fa-calendar-check"></i>
                Gửi yêu cầu đặt lịch
              </>
            )}
          </button>
          
          {!selectedService && formData.serviceType && (
            <div className="form-note">
              ⚠️ Vui lòng chọn dịch vụ cụ thể để tiếp tục
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RepairSchedule;
