// src/services/mockData.js
export const mockClassifications = [
    { classification_id: 1, classification_name: "SUV" },
    { classification_id: 2, classification_name: "Classic" },
    { classification_id: 3, classification_name: "Sports" },
    { classification_id: 4, classification_name: "Truck" },
    { classification_id: 5, classification_name: "Sedan" }
  ];
  
  export const mockVehicles = [
    {
      inv_id: 1,
      inv_make: "Jeep",
      inv_model: "Wrangler",
      inv_year: 2019,
      inv_description: "The Jeep Wrangler is a series of compact and mid-size four-wheel drive off-road SUVs manufactured by Jeep since 1986.",
      inv_image: "/images/vehicles/wrangler.jpg",
      inv_thumbnail: "/images/vehicles/wrangler-tn.jpg",
      inv_price: 28999,
      inv_miles: 29000,
      inv_color: "Orange",
      classification_id: 1,
      classification_name: "SUV"
    },
    {
      inv_id: 2,
      inv_make: "Ford",
      inv_model: "Model T",
      inv_year: 1921,
      inv_description: "The Ford Model T is an automobile produced by Ford Motor Company from 1908 to 1927.",
      inv_image: "/images/vehicles/model-t.jpg",
      inv_thumbnail: "/images/vehicles/model-t-tn.jpg",
      inv_price: 30000,
      inv_miles: 157000,
      inv_color: "Black",
      classification_id: 2,
      classification_name: "Classic"
    },
    {
      inv_id: 3,
      inv_make: "Lamborghini",
      inv_model: "Aventador",
      inv_year: 2016,
      inv_description: "The Lamborghini Aventador is a mid-engine sports car produced by the Italian automotive manufacturer Lamborghini.",
      inv_image: "/images/vehicles/aventador.jpg",
      inv_thumbnail: "/images/vehicles/aventador-tn.jpg",
      inv_price: 417000,
      inv_miles: 12000,
      inv_color: "Red",
      classification_id: 3,
      classification_name: "Sports"
    },
    {
      inv_id: 4,
      inv_make: "Ford",
      inv_model: "F-150",
      inv_year: 2020,
      inv_description: "The Ford F-150 is a pickup truck manufactured and marketed by Ford.",
      inv_image: "/images/vehicles/f-150.jpg",
      inv_thumbnail: "/images/vehicles/f-150-tn.jpg",
      inv_price: 36000,
      inv_miles: 41000,
      inv_color: "Blue",
      classification_id: 4,
      classification_name: "Truck"
    },
    {
      inv_id: 5,
      inv_make: "DMC",
      inv_model: "DeLorean",
      inv_year: 1983,
      inv_description: "The DeLorean DMC-12 is a sports car and the only automobile manufactured by John DeLorean's DeLorean Motor Company.",
      inv_image: "/images/vehicles/delorean.jpg",
      inv_thumbnail: "/images/vehicles/delorean-tn.jpg",
      inv_price: 39500,
      inv_miles: 15000,
      inv_color: "Silver",
      classification_id: 2,
      classification_name: "Classic"
    },
    {
      inv_id: 6,
      inv_make: "Toyota",
      inv_model: "Camry",
      inv_year: 2022,
      inv_description: "The Toyota Camry is an automobile sold internationally by the Japanese manufacturer Toyota since 1982.",
      inv_image: "/images/vehicles/camry.jpg",
      inv_thumbnail: "/images/vehicles/camry-tn.jpg",
      inv_price: 27500,
      inv_miles: 8000,
      inv_color: "White",
      classification_id: 5,
      classification_name: "Sedan"
    }
  ];
  
  // Mock Reviews
  export const mockReviews = [
    {
      review_id: 1,
      inv_id: 5,
      review_content: "So fast it's almost like traveling in time!",
      rating: 4,
      review_date: "2023-06-15",
      account_firstname: "John",
      account_lastname: "Doe"
    },
    {
      review_id: 2,
      inv_id: 5,
      review_content: "Coolest ride on the road.",
      rating: 4,
      review_date: "2023-07-20",
      account_firstname: "Jane",
      account_lastname: "Smith"
    },
    {
      review_id: 3,
      inv_id: 5,
      review_content: "I'm feeling McFly!",
      rating: 5,
      review_date: "2023-08-10",
      account_firstname: "Mike",
      account_lastname: "Johnson"
    }
  ];
  
  // Mock filter options
  export const mockFilterOptions = {
    makes: ["Jeep", "Ford", "Lamborghini", "Toyota", "DMC"],
    colors: ["Orange", "Black", "Red", "Blue", "Silver", "White"],
    classifications: mockClassifications
  };
  
  // Example mock user
  export const mockUser = {
    account_id: 1,
    account_firstname: "Guest",
    account_lastname: "User",
    account_email: "guest@example.com",
    account_type: "Client"
  };
  
  // Mock cart
  export const mockCart = {
    items: [],
    subtotal: 0,
    itemCount: 0
  };