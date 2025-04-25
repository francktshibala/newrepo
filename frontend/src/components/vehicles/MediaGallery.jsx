import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MediaGallery = ({ vehicleId }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/media/vehicle/${vehicleId}`);
        const mediaItems = response.data.media || [];
        
        // Filter to show only images
        const imageMedia = mediaItems.filter(item => 
          item.media_type === 'image' && !item.media_url.includes('-tn')
        );
        
        setMedia(imageMedia);
        
        // Set first image as selected or primary if available
        if (imageMedia.length > 0) {
          const primaryImage = imageMedia.find(img => img.is_primary);
          setSelectedImage(primaryImage || imageMedia[0]);
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Failed to load vehicle images');
      } finally {
        setLoading(false);
      }
    };
    
    if (vehicleId) {
      fetchMedia();
    }
  }, [vehicleId]);
  
  if (loading) {
    return <div className="text-center py-8">Loading media...</div>;
  }
  
  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }
  
  if (media.length === 0) {
    return <div className="py-4">No images available for this vehicle.</div>;
  }
  
  return (
    <div className="vehicle-gallery">
      {/* Main image display */}
      <div className="main-image mb-4">
        <img 
          src={selectedImage?.media_url} 
          alt={selectedImage?.media_title || "Vehicle"} 
          className="w-full h-auto rounded-lg object-cover max-h-96"
        />
      </div>
      
      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="thumbnails flex space-x-2 overflow-x-auto py-2">
          {media.map(item => (
            <div 
              key={item.media_id}
              className={`cursor-pointer rounded p-1 ${selectedImage?.media_id === item.media_id ? 'border-2 border-navHoverLink' : 'border border-gray-200'}`}
              onClick={() => setSelectedImage(item)}
            >
              <img 
                src={item.media_url.replace('.jpg', '-tn.jpg').replace('.png', '-tn.png')} 
                alt={item.media_title || "Thumbnail"} 
                className="w-16 h-16 object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;