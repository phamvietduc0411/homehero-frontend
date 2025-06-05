import React from "react";
import "../../styles/User/DashboardPage.css"; // Will create this CSS file
import UserAvatar from "../../assets/img/userprofile.jpg";
import UserSidebarMenu from "../../components/User/UserSidebarMenu"; // Import the new component

const MainPage = () => {
  return (
    <div className="dashboard-container">
      {" "}
      {/* Main container for the dashboard layout */}
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {" "}
        {/* Left sidebar */}
        <div className="sidebar-header">
          {" "}
          {/* Logo and app name */}
          <h2>
            <i className="fas fa-atom"></i> HomeHero
          </h2>{" "}
          {/* Placeholder logo/name */}
          <button className="sidebar-toggle-btn">
            {" "}
            {/* Mobile toggle button */}
            <i className="fas fa-bars"></i> {/* Hamburger icon */}
          </button>
        </div>
        {/* Replaced sidebar menu with the new component */}
        <UserSidebarMenu />
      </aside>
      {/* Main Content Area */}
      <div className="dashboard-main-content">
        {" "}
        {/* Right main content area */}
        {/* Top Navigation Bar */}{" "}
        {/* This part looks like a header within the main content */}
        <header className="main-content-header">
          {" "}
          {/* Top bar */}
          <div className="search-bar">
            {" "}
            {/* Search input */}
            <input type="text" placeholder="Search" />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="user-section">
            {" "}
            {/* User profile and icons */}
            <i className="fas fa-bell"></i> {/* Notification icon */}
            <i className="fas fa-cog"></i> {/* Settings icon */}
            <div className="user-info">
              {" "}
              {/* User name and avatar */}
              <img src={UserAvatar} alt="User Avatar" />
              <span>John Snow</span> {/* User name */}
            </div>
          </div>
        </header>
        {/* Main Content Body */} {/* Area with cards and charts */}
        <main className="main-content-body">
          {" "}
          {/* Content area below the top bar */}
          {/* Dashboard Title/Breadcrumbs */}
          <div className="dashboard-title">
            <h3>Default</h3>
            <div className="breadcrumb">
              <a href="#">Home</a> / <a href="#">Dashboards</a> /{" "}
              <span>Default</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary">New</button>
            <button className="btn btn-secondary">Filters</button>
          </div>
          {/* Info Cards */}
          <div className="info-cards">
            {" "}
            {/* Container for info cards */}
            {/* Example Card (repeat for others) */}
            <div className="card">
              {" "}
              {/* Card structure */}
              <div className="card-body">
                {" "}
                {/* Card content */}
                <h5 className="card-title">TOTAL TRAFFIC</h5>
                <p className="card-value">350,897</p>
                <p className="card-trend text-success">
                  <i className="fas fa-arrow-up"></i> 3.48%{" "}
                  <span className="text-muted">Since last month</span>
                </p>
              </div>
              <div className="card-icon">
                {" "}
                {/* Icon area */}
                {/* Replace with appropriate icon */}
                <i className="fas fa-chart-bar"></i> {/* Placeholder icon */}
              </div>
            </div>
            {/* Repeat for NEW USERS, SALES, PERFORMANCE */}
          </div>
          {/* Charts Section */}
          <div className="charts-section">
            {" "}
            {/* Container for charts */}
            {/* Sales Value Chart */}
            <div className="chart-card">
              {" "}
              {/* Card for chart */}
              <div className="card-header">
                {" "}
                {/* Chart header */}
                <h5>OVERVIEW</h5>
                <h4>Sales value</h4>
                <div className="chart-controls">
                  {" "}
                  {/* Month/Week buttons */}
                  <button className="btn btn-sm btn-primary">Month</button>
                  <button className="btn btn-sm btn-secondary">Week</button>
                </div>
              </div>
              <div className="card-body">
                {" "}
                {/* Chart area */}
                {/* Placeholder for Sales Value Chart */}
                <div className="chart-placeholder">Sales Value Chart Here</div>
              </div>
            </div>
            {/* Total Orders Chart */}
            <div className="chart-card">
              {" "}
              {/* Card for chart */}
              <div className="card-header">
                {" "}
                {/* Chart header */}
                <h5>PERFORMANCE</h5>
                <h4>Total orders</h4>
              </div>
              <div className="card-body">
                {" "}
                {/* Chart area */}
                {/* Placeholder for Total Orders Chart */}
                <div className="chart-placeholder">Total Orders Chart Here</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPage;
