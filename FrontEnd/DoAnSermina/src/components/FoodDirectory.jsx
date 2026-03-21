import React, { useState } from "react";
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const foodShops = [
  { id: 1, name: "Ốc Hương Nướng", image: "https://cdn2.fptshop.com.vn/unsafe/oc_huong_nuong_4_1_7cd8652679.jpg", description: "Fresh grilled snails with herbs.", address: "123 Vinh Khanh St", rating: 4.5, reviews: 128, category: "Snails" },
  { id: 2, name: "Ghẹ Rang Me", image: "https://cdn.tgdd.vn/2021/03/CookProduct/1f-1200x676.jpg", description: "Spicy stir-fried crab.", address: "124 Vinh Khanh St", rating: 4.8, reviews: 95, category: "Seafood" },
  { id: 3, name: "Tôm Nướng Muối Ớt", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80", description: "Salt and chili grilled shrimp.", address: "125 Vinh Khanh St", rating: 4.2, reviews: 76, category: "BBQ" },
  { id: 4, name: "Sò Điệp Nướng Mỡ Hành", image: "https://cdn.tgdd.vn/Files/2014/08/26/562178/so-diep-nuong-mo-hanh-3.jpg", description: "Scallops grilled with scallion oil.", address: "126 Vinh Khanh St", rating: 4.7, reviews: 112, category: "BBQ" },
  { id: 5, name: "Hải Sản Nướng", image: "	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:…(webp):quality(75)/hai_san_nuong_0_f1bffb4a9a.jpg", description: "Assorted grilled seafood.", address: "127 Vinh Khanh St", rating: 4.3, reviews: 89, category: "BBQ" },
  { id: 6, name: "Bạch Tuộc Nướng", image: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/09/cach-nuong-bach-tuoc-12.jpg", description: "Grilled octopus tentacles.", address: "128 Vinh Khanh St", rating: 4.6, reviews: 134, category: "BBQ" },
  { id: 7, name: "Cua Rang Me", image: "https://i.ytimg.com/vi/uijqec4uuBE/maxresdefault.jpg", description: "Spicy stir-fried crab.", address: "129 Vinh Khanh St", rating: 4.4, reviews: 67, category: "Seafood" },
  { id: 8, name: "Mực Nướng", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Grilled squid.", address: "130 Vinh Khanh St", rating: 4.1, reviews: 54, category: "BBQ" },
  { id: 9, name: "Bánh Xèo", image: "https://daotaobeptruong.vn/wp-content/uploads/2020/01/cach-do-banh-xeo-ngon-gion-lau.jpg", description: "Vietnamese crispy pancake.", address: "131 Vinh Khanh St", rating: 4.5, reviews: 98, category: "Street Food" },
  { id: 10, name: "Phở Bò", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Beef noodle soup.", address: "132 Vinh Khanh St", rating: 4.9, reviews: 156, category: "Street Food" },
  { id: 11, name: "Gỏi Cuốn", image: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:…23_10_23_638336957766719361_cach-lam-goi-cuon.jpg", description: "Fresh spring rolls.", address: "133 Vinh Khanh St", rating: 4.3, reviews: 82, category: "Street Food" },
  { id: 12, name: "Bún Riêu", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Crab noodle soup.", address: "134 Vinh Khanh St", rating: 4.7, reviews: 143, category: "Street Food" },
  { id: 13, name: "Cơm Tấm", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?auto=format&fit=crop&w=400&q=80", description: "Broken rice with grilled pork.", address: "135 Vinh Khanh St", rating: 4.6, reviews: 121, category: "Street Food" },
  { id: 14, name: "Chả Giò", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Fried spring rolls.", address: "136 Vinh Khanh St", rating: 4.2, reviews: 73, category: "Street Food" },
  { id: 15, name: "Bánh Mì", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?auto=format&fit=crop&w=400&q=80", description: "Vietnamese baguette.", address: "137 Vinh Khanh St", rating: 4.8, reviews: 167, category: "Street Food" },
  { id: 16, name: "Trái Cây", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Fresh tropical fruits.", address: "138 Vinh Khanh St", rating: 4.4, reviews: 59, category: "Street Food" },
  { id: 17, name: "Sinh Tố", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?auto=format&fit=crop&w=400&q=80", description: "Fruit smoothies.", address: "139 Vinh Khanh St", rating: 4.5, reviews: 87, category: "Street Food" },
  { id: 18, name: "Cà Phê", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Vietnamese coffee.", address: "140 Vinh Khanh St", rating: 4.7, reviews: 145, category: "Street Food" },
  { id: 19, name: "Trà Đá", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?auto=format&fit=crop&w=400&q=80", description: "Iced tea.", address: "141 Vinh Khanh St", rating: 4.3, reviews: 68, category: "Street Food" },
  { id: 20, name: "Nước Mía", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Sugarcane juice.", address: "142 Vinh Khanh St", rating: 4.6, reviews: 92, category: "Street Food" },
  { id: 21, name: "Bánh Flan", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?auto=format&fit=crop&w=400&q=80", description: "Caramel custard.", address: "143 Vinh Khanh St", rating: 4.4, reviews: 78, category: "Street Food" },
  { id: 22, name: "Kem", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Ice cream.", address: "144 Vinh Khanh St", rating: 4.8, reviews: 113, category: "Street Food" },
  { id: 23, name: "Bánh Ngọt", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?auto=format&fit=crop&w=400&q=80", description: "Sweet pastries.", address: "145 Vinh Khanh St", rating: 4.5, reviews: 84, category: "Street Food" },
  { id: 24, name: "Trái Cây Khô", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=400&q=80", description: "Dried fruits.", address: "146 Vinh Khanh St", rating: 4.2, reviews: 61, category: "Street Food" },
];

const categories = ["All", "Seafood", "Snails", "BBQ", "Street Food"];

function FoodDirectory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const shopsPerPage = 8;

  // Filter shops based on search term and category
  const filteredShops = foodShops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || shop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);
  const startIndex = (currentPage - 1) * shopsPerPage;
  const currentShops = filteredShops.slice(startIndex, startIndex + shopsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const openGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address + ", Ho Chi Minh City, Vietnam");
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <section id="food-directory" className="food-directory" data-aos="fade-up">
      <h2>Food Directory</h2>
      <p className="section-description">Explore the best food shops on Vinh Khanh Street. Discover authentic flavors and local favorites.</p>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for food, restaurants, or locations..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="food-grid">
        {currentShops.map((shop) => (
          <div key={shop.id} className="food-card" data-aos="fade-up">
            <img src={shop.image} alt={shop.name} />
            <div className="card-content">
              <h3>{shop.name}</h3>
              <p>{shop.description}</p>
              <div className="address">
                <FaMapMarkerAlt /> {shop.address}
              </div>
              <div className="rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(shop.rating) ? (
                      <AiFillStar key={i} className="filled" />
                    ) : (
                      <AiOutlineStar key={i} className="empty" />
                    )
                  ))}
                </div>
                <span>{shop.rating}</span>
                <span className="reviews">({shop.reviews} reviews)</span>
              </div>
              <button
                className="btn secondary"
                onClick={() => openGoogleMaps(shop.address)}
              >
                View on Map
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="no-results">
          <p>No food shops found matching your search.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn pagination-btn"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`btn pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default FoodDirectory;