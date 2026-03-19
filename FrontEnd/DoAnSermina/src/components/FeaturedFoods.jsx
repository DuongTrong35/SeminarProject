import React from "react";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const foods = [
  {
    title: "Ốc hương nướng",
    img:
      "https://images.unsplash.com/photo-1628080135872-b6e9e2e691a9?auto=format&fit=crop&w=400&q=80",
    rating: 4,
  },
  {
    title: "Ghẹ rang me",
    img:
      "https://images.unsplash.com/photo-1598866533593-1c0e4f9a7d3d?auto=format&fit=crop&w=400&q=80",
    rating: 5,
  },
  {
    title: "Tôm nướng muối ớt",
    img:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80",
    rating: 4,
  },
  {
    title: "Sò điệp nướng mỡ hành",
    img:
      "https://images.unsplash.com/photo-1606756796315-d9a8a0eb1c94?auto=format&fit=crop&w=400&q=80",
    rating: 5,
  },
  {
    title: "Hải sản nướng",
    img:
      "https://images.unsplash.com/photo-1576402187877-3db68b1c8c40?auto=format&fit=crop&w=400&q=80",
    rating: 4,
  },
  {
    title: "Bạch tuộc nướng",
    img:
      "https://images.unsplash.com/photo-1623862440600-2c1430ccfb66?auto=format&fit=crop&w=400&q=80",
    rating: 5,
  },
];

function FeaturedFoods() {
  return (
    <section className="featured-foods" data-aos="fade-up">
      <h2>
        <span role="img" aria-label="food">
          🍽️
        </span>{' '}
        Món ăn nổi bật
      </h2>
      <p className="section-description">
        Những món hải sản tươi ngon phải thử khi đi tour ẩm thực ở phố Vĩnh Khánh.
      </p>
      <div className="food-grid">
        {foods.map((f) => (
          <div key={f.title} className="food-card" data-aos="fade-up">
            <img src={f.img} alt={f.title} />
            <div className="card-content">
              <h3>{f.title}</h3>
              <p>Thưởng thức {f.title.toLowerCase()}</p>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  i < f.rating ? (
                    <AiFillStar key={i} className="filled" />
                  ) : (
                    <AiOutlineStar key={i} className="empty" />
                  )
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedFoods;
