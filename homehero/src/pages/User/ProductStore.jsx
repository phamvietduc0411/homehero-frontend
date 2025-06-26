import React, { useState, useEffect } from 'react';
import '../../styles/User/ProductStore.css';


const ProductStore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  
  // 🆕 NEW: API states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['all']);

  // 🔗 API Configuration
  const API_BASE_URL = 'https://localhost:7190/api/Product'; // Adjust your API URL

  // 🚀 Fetch Products from API
  const fetchProducts = async (searchQuery = '', category = '') => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim()) {
        params.append('searchTerm', searchQuery.trim());
      }
      if (category && category !== 'all') {
        // Note: Adjust parameter name based on your API
        // Your API might use 'categoryName' or 'categoryId'
        params.append('categoryName', category);
      }
      
      const url = `${API_BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching products from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response received:', data);

      // ✅ FIX: Extract products array from API response
      const productsArray = data.products || data || [];
      console.log('Products array:', productsArray);

      // Map API response to component format
      const mappedProducts = productsArray.map(product => ({
        id: product.productId || product.id,
        name: product.productName || product.name,
        category: product.categoryName || product.category || 'Khác',
        description: product.shortDescription || product.description || '',
        price: product.price || 0,
        brand: product.brand || 'Không rõ',
        stock: product.stockQuantity || product.stock || 0,
        unit: product.unit || 'Cái',
        image: product.imageUrl || product.image || 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop',
        isInStock: product.isInStock !== undefined ? product.isInStock : product.stock > 0
      }));

      setProducts(mappedProducts);

      // ✅ Extract categories from API response or products
      let uniqueCategories;
      if (data.categories && Array.isArray(data.categories)) {
        // Use categories from API if available
        uniqueCategories = ['all', ...data.categories.map(cat => cat.categoryName)];
      } else {
        // Fallback: extract from products
        uniqueCategories = ['all', ...new Set(mappedProducts.map(p => p.category))];
      }
      setCategories(uniqueCategories);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      
      // 🔄 Fallback to sample data if API fails
      console.log('Using fallback data...');
      setProducts(getFallbackProducts());
      setCategories(['all', ...new Set(getFallbackProducts().map(p => p.category))]);
    } finally {
      setLoading(false);
    }
  };

  // 📦 Fallback data (same as original)
  const getFallbackProducts = () => [
    {
      id: 1,
      name: "Tua vít đa năng 10 đầu",
      category: "Dụng cụ cầm tay",
      description: "Bộ tua vít 10 đầu thay đổi, chống gỉ sét",
      price: 95000,
      brand: "Total Tools",
      stock: 12,
      unit: "Bộ",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
      isInStock: true
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
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop",
      isInStock: true
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
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      isInStock: true
    },
    // ... other fallback products
  ];

  // 🔍 Search with API integration
  const handleSearch = async (searchValue) => {
    setSearchTerm(searchValue);
    // Debounce search to avoid too many API calls
    if (searchValue.length >= 2 || searchValue.length === 0) {
      await fetchProducts(searchValue, selectedCategory);
    }
  };

  // 📂 Category filter with API integration
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    
    // Convert category name to ID if needed for API
    let categoryParam = category;
    if (category !== 'all' && categories.length > 0) {
      // For now, send category name directly
      // You might need to map category name to ID based on your API
      categoryParam = category;
    }
    
    await fetchProducts(searchTerm, categoryParam);
  };

  // 🎯 Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔄 Client-side filtering (for real-time search without API calls)
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 💰 Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  // 🛒 Cart functions (unchanged)
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

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // 🎨 Loading component
  const LoadingComponent = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Đang tải sản phẩm...</p>
    </div>
  );

  // ❌ Error component
  const ErrorComponent = () => (
    <div className="error-container">
      <div className="error-message">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Không thể tải sản phẩm</h3>
        <p>{error}</p>
        <button onClick={() => fetchProducts()} className="retry-btn">
          <i className="fas fa-redo"></i> Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="product-store">
      {/* Page Header */}
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
              onChange={(e) => handleSearch(e.target.value)}
            />
            {loading && <div className="search-loading">🔄</div>}
          </div>
          
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category === 'all' ? '🔧 Tất cả' : `📦 ${category}`}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on state */}
        {loading ? (
          <LoadingComponent />
        ) : error && products.length === 0 ? (
          <ErrorComponent />
        ) : (
          <>
            {/* Results count */}
            <div className="results-info">
              Hiển thị {filteredProducts.length} sản phẩm
              {searchTerm && ` cho "${searchTerm}"`}
              {selectedCategory !== 'all' && ` trong danh mục "${selectedCategory}"`}
              {error && (
                <span className="api-warning">
                  ⚠️ Đang sử dụng dữ liệu mẫu (API không khả dụng)
                </span>
              )}
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop';
                      }}
                    />
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
                          disabled={product.stock === 0 || !product.isInStock}
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
          </>
        )}

        {/* Cart Sidebar (unchanged) */}
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
      </div>
    </div>
  );
};

export default ProductStore;