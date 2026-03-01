import React from 'react';

const ParallaxSection: React.FC = () => {
  // A single, high-quality image for the background
  const imageUrl = 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920';

  return (
    <div className="parallax-container-fixed">
      <div
        className="parallax-bg-fixed"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <div className="parallax-overlay">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 opacity-90">
              Experience Unforgettable Events
            </h2>
            <p className="text-xl md:text-2xl opacity-80">
              From weddings to corporate functions, we make every moment special.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxSection;
