import React, { useState } from 'react';
import '../../styles/User/ProductStore.css';

const ProductStore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Dữ liệu sản phẩm từ Excel
  const products = [
    {
      id: 1,
      name: "Tua vít đa năng 10 đầu",
      category: "Dụng cụ cầm tay",
      description: "Bộ tua vít 10 đầu thay đổi, chống gỉ sét",
      price: 95000,
      brand: "Total Tools",
      stock: 12,
      unit: "Bộ",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Máy khoan cầm tay mini",
      category: "Dụng cụ điện",
      description: "Máy khoan nhỏ, dùng sửa đồ gỗ, khoan tường nhẹ",
      price: 450000,
      brand: "Bosch",
      stock: 4,
      unit: "Cái",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Keo dán chịu lực đa năng",
      category: "Vật liệu sửa chữa",
      description: "Keo epoxy 2 thành phần, dán kim loại – gỗ – nhựa",
      price: 65000,
      brand: "Selleys",
      stock: 10,
      unit: "Tuýp",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Băng keo điện chống thấm",
      category: "Điện & dây dẫn",
      description: "Dùng quấn dây điện, cách nhiệt, chống nước",
      price: 15000,
      brand: "3M",
      stock: 200,
      unit: "Cuộn",
      image: "https://images.unsplash.com/photo-1558618048-fcd25c85cd64?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Bộ vòi nước tăng áp",
      category: "Phụ kiện nhà tắm",
      description: "Bộ vòi sen tăng áp lực, dễ lắp đặt",
      price: 135000,
      brand: "Inax",
      stock: 20,
      unit: "Bộ",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Kìm cắt đa năng",
      category: "Dụng cụ cầm tay",
      description: "Kìm cắt dây điện, thép, có tay cầm chống trượt",
      price: 75000,
      brand: "Stanley",
      stock: 50,
      unit: "Cái",
      image: "https://images.unsplash.com/photo-1609205773820-6f30f07b3b28?w=300&h=300&fit=crop"
    },
    {
      id: 7,
      name: "Bóng đèn LED 12W tiết kiệm điện",
      category: "Điện & chiếu sáng",
      description: "Bóng đèn LED tròn, ánh sáng trắng, tuổi thọ cao",
      price: 25000,
      brand: "Điện Quang",
      stock: 30,
      unit: "Cái",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop"
    },
    {
      id: 8,
      name: "Thước dây thép 5m",
      category: "Dụng cụ đo đạc",
      description: "Thước đo kéo cuộn, vỏ nhựa ABS bền chắc",
      price: 32000,
      brand: "Tolsen",
      stock: 10,
      unit: "Cái",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop"
    },
    {
      id: 9,
      name: "Bộ ốc vít đa kích cỡ",
      category: "Linh kiện phụ trợ",
      description: "Hộp ốc vít 200 chiếc nhiều loại, dùng cho gỗ & thép",
      price: 55000,
      brand: "OEM",
      stock: 30,
      unit: "Hộp",
      image: "https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=300&h=300&fit=crop"
    },
    {
      id: 10,
      name: "Bơm tay thông nghẹt bồn rửa",
      category: "Dụng cụ vệ sinh",
      description: "Dụng cụ hút khí tạo áp lực thông nghẹt nhanh",
      price: 110000,
      brand: "Nhật Quang",
      stock: 15,
      unit: "Cái",
      image: "https://images.unsplash.com/photo-1558618047-3c8b850fcdc2?w=300&h=300&fit=crop"
    }
  ];

  // Lấy danh sách categories duy nhất
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Lọc sản phẩm
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  // Thêm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  // Xóa khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // Tính tổng tiền giỏ hàng
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="product-store">
      {/* Page Header giống các trang khác */}
      <div className="page-header">
        <div className="breadcrumb">
          <span>Pages</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Đặt mua sản phẩm</span>
        </div>
        <h1 className="page-title">🛍️ Cửa hàng dụng cụ sửa chữa</h1>
        <p className="page-subtitle">
          Tìm mua các sản phẩm, dụng cụ chất lượng cao cho việc sửa chữa tại nhà
        </p>
      </div>

      {/* Main Content */}
      <div className="store-content">
        {/* Store Header with Cart */}
        <div className="store-header">
          <div className="cart-summary" onClick={() => setShowCart(!showCart)}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cartItems.length}</span>
            <span className="cart-total">{formatPrice(getTotalPrice())}</span>
          </div>
        </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? '🔧 Tất cả' : `📦 ${category}`}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="product-badge">
                {product.stock < 10 ? 'Sắp hết' : 'Còn hàng'}
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-details">
                <span className="brand">🏷️ {product.brand}</span>
                <span className="stock">📦 {product.stock} {product.unit}</span>
              </div>
              
              <div className="product-footer">
                <div className="price-section">
                  <span className="price">{formatPrice(product.price)}</span>
                  <span className="unit">/{product.unit}</span>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <i className="fas fa-cart-plus"></i>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h3>🛒 Giỏ hàng của bạn</h3>
            <button onClick={() => setShowCart(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Giỏ hàng trống</p>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{formatPrice(item.price)} x {item.quantity}</p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="total-price">
                <strong>Tổng: {formatPrice(getTotalPrice())}</strong>
              </div>
              <button className="checkout-btn">
                <i className="fas fa-credit-card"></i>
                Đặt hàng ngay
              </button>
            </div>
          )}
        </div>
      )}

        {/* Results count */}
        <div className="results-info">
          Hiển thị {filteredProducts.length} sản phẩm
          {searchTerm && ` cho "${searchTerm}"`}
          {selectedCategory !== 'all' && ` trong danh mục "${selectedCategory}"`}
        </div>
      </div>
    </div>
  );
};

export default ProductStore;