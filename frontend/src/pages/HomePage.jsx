import React from 'react';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="intro mb-10">
        <h2 className="text-2xl font-bold mb-4">Welcome to CSE Motors!</h2>
        
        <div className="relative">
          <img 
            src="/images/vehicles/delorean.jpg" 
            alt="DMC DeLorean" 
            className="w-full h-auto rounded-lg"
          />
          
          <div className="absolute top-10 left-10 bg-gray-800 bg-opacity-70 p-6 rounded-lg max-w-xs">
            <h3 className="text-xl font-bold text-white mb-2">DMC DeLorean</h3>
            <ul className="text-white mb-4">
              <li>3 Cup holders</li>
              <li>Superman doors</li>
              <li>Fuzzy dice!</li>
            </ul>
            <button className="bg-navHoverLink text-white px-4 py-2 rounded">
              Own Today
            </button>
          </div>
        </div>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="upgrades">
          <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
            Delorean Upgrades
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <img 
                src="/images/upgrades/flux-cap.png" 
                alt="Flux Capacitor" 
                className="w-full h-auto mb-2"
              />
              <p>Flux Capacitor</p>
            </div>
            <div className="text-center">
              <img 
                src="/images/upgrades/flame.jpg" 
                alt="Flame Decals" 
                className="w-full h-auto mb-2"
              />
              <p>Flame Decals</p>
            </div>
            <div className="text-center">
              <img 
                src="/images/upgrades/bumper_sticker.jpg" 
                alt="Bumper Stickers" 
                className="w-full h-auto mb-2"
              />
              <p>Bumper Stickers</p>
            </div>
            <div className="text-center">
              <img 
                src="/images/upgrades/hub-cap.jpg" 
                alt="Hub Caps" 
                className="w-full h-auto mb-2"
              />
              <p>Hub Caps</p>
            </div>
          </div>
        </section>
        
        <section className="reviews">
          <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
            DMC Delorean Reviews
          </h3>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>"So fast it's almost like traveling in time." (4/5)</li>
            <li>"Coolest ride on the road." (4/5)</li>
            <li>"I'm feeling McFly!" (5/5)</li>
            <li>"The most futuristic ride of our day." (4.5/5)</li>
            <li>"80's livin and I love it!" (5/5)</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HomePage;