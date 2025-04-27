// src/services/mockApiService.js
import { 
    mockClassifications, 
    mockVehicles, 
    mockReviews, 
    mockFilterOptions,
    mockUser,
    mockCart
  } from './mockData';
  
  // Create a mock implementation for API calls
  class MockApiService {
    constructor() {
      this.isUsingMockData = true;
      this.mockCart = { ...mockCart };
      this.mockUser = null;
    }
    
    // Authentication services
    authService = {
      login: async (credentials) => {
        // Simulate login
        return new Promise((resolve) => {
          setTimeout(() => {
            this.mockUser = { ...mockUser };
            const response = {
              token: 'mock-jwt-token',
              account: this.mockUser
            };
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.account));
            resolve(response);
          }, 500);
        });
      },
      
      register: async (userData) => {
        // Simulate registration
        return new Promise((resolve) => {
          setTimeout(() => {
            this.mockUser = {
              ...mockUser,
              account_firstname: userData.account_firstname,
              account_lastname: userData.account_lastname,
              account_email: userData.account_email
            };
            resolve({ success: true, message: 'Registration successful' });
          }, 500);
        });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.mockUser = null;
      },
      
      getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
      }
    };
  
    // Inventory services
    inventoryService = {
      getClassifications: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ classifications: mockClassifications });
          }, 300);
        });
      },
      
      getVehiclesByClassification: async (classificationId) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const classification = mockClassifications.find(
              c => c.classification_id === Number(classificationId)
            );
            
            const vehicles = mockVehicles.filter(
              v => v.classification_id === Number(classificationId)
            );
            
            resolve({ 
              classification_name: classification ? classification.classification_name : '',
              vehicles 
            });
          }, 300);
        });
      },
      
      getVehicleById: async (vehicleId) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const vehicle = mockVehicles.find(v => v.inv_id === Number(vehicleId));
            
            if (vehicle) {
              resolve({ vehicle });
            } else {
              reject({ message: 'Vehicle not found' });
            }
          }, 300);
        });
      }
    };
  
    // Review services
    reviewService = {
      getVehicleReviews: async (vehicleId) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const reviews = mockReviews.filter(
              r => r.inv_id === Number(vehicleId)
            );
            
            resolve({ reviews });
          }, 300);
        });
      },
      
      addReview: async (reviewData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const newReview = {
              review_id: mockReviews.length + 1,
              inv_id: Number(reviewData.inv_id),
              review_content: reviewData.review_content,
              rating: reviewData.rating,
              review_date: new Date().toISOString().split('T')[0],
              account_firstname: this.mockUser?.account_firstname || 'Guest',
              account_lastname: this.mockUser?.account_lastname || 'User'
            };
            
            mockReviews.push(newReview);
            
            resolve({ review: newReview });
          }, 300);
        });
      },
      
      getUserReviews: async () => {
        // If we had user identification, we would filter by user
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ reviews: [] });
          }, 300);
        });
      }
    };
  
    // Cart services
    cartService = {
      getCart: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ cart: this.mockCart });
          }, 300);
        });
      },
      
      addToCart: async (invId, quantity = 1) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const vehicle = mockVehicles.find(v => v.inv_id === Number(invId));
            
            if (vehicle) {
              const existingItem = this.mockCart.items.find(
                item => item.inv_id === Number(invId)
              );
              
              if (existingItem) {
                existingItem.quantity += quantity;
              } else {
                this.mockCart.items.push({
                  ...vehicle,
                  quantity
                });
              }
              
              // Update cart totals
              this.updateCartTotals();
              
              resolve({ cart: this.mockCart });
            } else {
              resolve({ error: 'Vehicle not found' });
            }
          }, 300);
        });
      },
      
      updateQuantity: async (invId, quantity) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const item = this.mockCart.items.find(
              item => item.inv_id === Number(invId)
            );
            
            if (item) {
              item.quantity = quantity;
              this.updateCartTotals();
            }
            
            resolve({ cart: this.mockCart });
          }, 300);
        });
      },
      
      removeFromCart: async (invId) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.mockCart.items = this.mockCart.items.filter(
              item => item.inv_id !== Number(invId)
            );
            
            this.updateCartTotals();
            
            resolve({ cart: this.mockCart });
          }, 300);
        });
      },
      
      clearCart: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.mockCart.items = [];
            this.mockCart.subtotal = 0;
            this.mockCart.itemCount = 0;
            
            resolve({ cart: this.mockCart });
          }, 300);
        });
      }
    };
  
    // Search service
    searchService = {
      searchVehicles: async (params) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            let results = [...mockVehicles];
            
            // Filter by query (search all text fields)
            if (params.query) {
              const query = params.query.toLowerCase();
              results = results.filter(vehicle => 
                vehicle.inv_make.toLowerCase().includes(query) ||
                vehicle.inv_model.toLowerCase().includes(query) ||
                vehicle.inv_description.toLowerCase().includes(query) ||
                vehicle.inv_color.toLowerCase().includes(query)
              );
            }
            
            // Filter by classification
            if (params.classification) {
              results = results.filter(
                v => v.classification_id === Number(params.classification)
              );
            }
            
            // Filter by make
            if (params.make) {
              results = results.filter(
                v => v.inv_make.toLowerCase() === params.make.toLowerCase()
              );
            }
            
            // Filter by price range
            if (params.minPrice) {
              results = results.filter(
                v => v.inv_price >= Number(params.minPrice)
              );
            }
            
            if (params.maxPrice) {
              results = results.filter(
                v => v.inv_price <= Number(params.maxPrice)
              );
            }
            
            // Filter by color
            if (params.color) {
              results = results.filter(
                v => v.inv_color.toLowerCase() === params.color.toLowerCase()
              );
            }
            
            resolve({ results });
          }, 300);
        });
      },
      
      getFilterOptions: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(mockFilterOptions);
          }, 300);
        });
      }
    };
    
    // Helper method to update cart totals
    updateCartTotals() {
      this.mockCart.itemCount = this.mockCart.items.reduce(
        (total, item) => total + item.quantity, 0
      );
      
      this.mockCart.subtotal = this.mockCart.items.reduce(
        (total, item) => total + (item.inv_price * item.quantity), 0
      );
    }
  }
  
  export default new MockApiService();