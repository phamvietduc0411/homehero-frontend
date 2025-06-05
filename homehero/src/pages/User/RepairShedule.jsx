import React from 'react';
import UserSidebarMenu from '../../components/User/UserSidebarMenu';
import '../../styles/User/DashboardPage.css'; // Import the general dashboard styles
import '../../styles/User/RepairShedule.css'; // Import the specific CSS for this page



const RepairShedule = () => {
  return (
    <div className="dashboard-container"> 
      {/* User Sidebar Menu */}
      <div className="dashboard-sidebar">
        <UserSidebarMenu />
      </div>

      {/* Main Content Area for Repair Scheduling */}
      <div className="dashboard-main-content"> {/* Use the same main content class */}
        {/* Header for the repair schedule page - similar to the main page header */}
        <header className="main-content-header">
          <h2>Đặt lịch sửa chữa đồ gia dụng</h2>
          {/* Add any specific header elements for this page, e.g., user info, notifications */}
          {/* For now, keeping it simple */}
        </header>

        {/* Main Content Body for Repair Scheduling */}
        <main className="main-content-body"> {/* Use the same main content body class */}
          {/* Placeholder for Repair Scheduling Content */}
          <div className="repair-schedule-content">
            <h3>Form đặt lịch sửa chữa</h3>
            {/* Removed placeholder text */}
            
            <div className="form-group">
              <label htmlFor="serviceType">Loại dịch vụ:</label>
              <select id="serviceType" className="form-control">
                <option value="">Chọn loại dịch vụ</option>
                <option value="sua_dien_lanh">Sửa chữa điện lạnh</option>
                <option value="sua_dien_nuoc">Sửa chữa điện nước</option>
                {/* Add more service types as needed */}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="applianceType">Loại đồ gia dụng:</label>
              <input type="text" id="applianceType" className="form-control" placeholder="Ví dụ: Máy giặt, Tủ lạnh" />
            </div>

            <div className="form-group">
              <label htmlFor="issueDescription">Mô tả sự cố:</label>
              <textarea id="issueDescription" className="form-control" rows="4" placeholder="Mô tả chi tiết sự cố bạn đang gặp phải"></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="preferredDate">Ngày mong muốn:</label>
              <input type="date" id="preferredDate" className="form-control" />
            </div>

            <div className="form-group">
              <label htmlFor="preferredTime">Thời gian mong muốn:</label>
              <input type="time" id="preferredTime" className="form-control" />
            </div>

             <div className="form-group">
              <label htmlFor="address">Địa chỉ:</label>
              <input type="text" id="address" className="form-control" placeholder="Nhập địa chỉ sửa chữa" />
            </div>

            <button className="btn btn-primary" style={{marginTop: '20px'}}>Gửi yêu cầu đặt lịch</button>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default RepairShedule;
