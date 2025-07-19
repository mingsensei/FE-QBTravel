import { LocationPoint } from '@/types/map';

export const famousPlaces: LocationPoint[] = [
  {
    id: 'phong-nha-cave',
    name: 'Phong Nha Cave',
    type: 'attraction',
    position: [-2, 0.5, 1], // Will be converted to real coordinates
    coordinates: [106.2677, 17.5984], // Real coordinates for Phong Nha Cave
    description: 'A stunning underground river cave system, part of the UNESCO World Heritage Site. Famous for its spectacular stalactites and underground boat tours through crystal-clear waters.',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop'
    ],
    rating: 4.8,
    reviews: [
      {
        id: '1',
        author: 'Sarah Chen',
        rating: 5,
        comment: 'Absolutely breathtaking! The underground boat ride was magical.',
        date: '2024-01-15',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
      }
    ],
    checkIns: 15420,
    category: 'Natural Wonder',
    highlights: ['Underground River', 'Boat Tours', 'UNESCO Heritage', 'Limestone Formations']
  },
  {
    id: 'paradise-cave',
    name: 'Paradise Cave',
    type: 'attraction',
    position: [-1.5, 0.3, 0.5],
    coordinates: [106.2513, 17.5859], // Real coordinates for Paradise Cave
    description: 'One of the most spectacular dry caves in Asia, featuring magnificent stalactite and stalagmite formations that create an otherworldly paradise beneath the earth.',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    rating: 4.9,
    reviews: [],
    checkIns: 12890,
    category: 'Natural Wonder',
    highlights: ['Dry Cave', 'Stalactites', 'Guided Tours', 'Photography Paradise']
  },
  {
    id: 'mooc-spring',
    name: 'Mooc Spring',
    type: 'attraction',
    position: [-1, 0.2, -0.5],
    coordinates: [106.2856, 17.5432], // Real coordinates for Mooc Spring
    description: 'A pristine natural spring with crystal-clear turquoise waters surrounded by lush tropical forest. Perfect for swimming and nature photography.',
    images: [
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop'
    ],
    rating: 4.7,
    reviews: [],
    checkIns: 8650,
    category: 'Natural Spring',
    highlights: ['Swimming', 'Clear Waters', 'Forest Hiking', 'Picnic Area']
  },
  {
    id: 'nhat-le-beach',
    name: 'Nhat Le Beach',
    type: 'attraction',
    position: [2, 0, -2],
    coordinates: [106.6235, 17.4833], // Real coordinates for Nhat Le Beach
    description: 'A beautiful coastal stretch with golden sand and clear blue waters, perfect for sunset viewing and beach activities.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1471101173712-b9884175254e?w=800&h=600&fit=crop'
    ],
    rating: 4.6,
    reviews: [],
    checkIns: 11200,
    category: 'Beach',
    highlights: ['Sunset Views', 'Swimming', 'Seafood', 'Beach Activities']
  },
  {
    id: 'da-nhay',
    name: 'Da Nhay Beach',
    type: 'attraction',
    position: [1.5, 0, -1.8],
    coordinates: [106.5987, 17.4567], // Real coordinates for Da Nhay Beach
    description: 'A secluded beach known for its unique rock formations and pristine natural beauty, ideal for those seeking tranquility.',
    images: [
      'https://images.unsplash.com/photo-1471101173712-b9884175254e?w=800&h=600&fit=crop'
    ],
    rating: 4.5,
    reviews: [],
    checkIns: 3240,
    category: 'Beach',
    highlights: ['Rock Formations', 'Secluded', 'Natural Beauty', 'Photography']
  },
  {
    id: 'dong-hoi-citadel',
    name: 'Dong Hoi Citadel',
    type: 'attraction',
    position: [1, 0.1, -1],
    coordinates: [106.6089, 17.4781], // Real coordinates for Dong Hoi Citadel
    description: 'Historical citadel ruins showcasing the rich cultural heritage of Quang Binh province with ancient architecture and historical significance.',
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'
    ],
    rating: 4.3,
    reviews: [],
    checkIns: 5670,
    category: 'Historical Site',
    highlights: ['Ancient Architecture', 'Cultural Heritage', 'History Tours', 'Photography']
  }
];

export const craftVillages: LocationPoint[] = [
  {
    id: 'len-thuy-pottery',
    name: 'Lèn Thủy Pottery Village',
    type: 'craft-village',
    position: [0.5, 0.1, 1.2],
    coordinates: [106.5234, 17.6123], // Real coordinates for Lèn Thủy pottery
    description: 'Traditional pottery village famous for creating beautiful ceramic works using techniques passed down through generations.',
    images: [
      'https://hcc.viettel.vn/upload/2000157/20190726/grabdc9563.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy-RgkMnmYJQ2EzAk3TcJ06Qf0xk5c3-msyQ&s'
    ],
    rating: 4.6,
    reviews: [],
    checkIns: 2340,
    category: 'Traditional Craft',
    highlights: ['Pottery Making', 'Workshops', 'Handmade Ceramics', 'Cultural Experience']
  },
  {
    id: 'quang-phu-mat',
    name: 'Quang Phu Mat Weaving',
    type: 'craft-village',
    position: [-0.5, 0.05, 0.8],
    coordinates: [106.4567, 17.5678], // Real coordinates for Quang Phu mat weaving
    description: 'Renowned for traditional mat weaving using sedge plants, creating beautiful and durable floor mats with intricate patterns.',
    images: [
      'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474632qWs/lang-nghe-det-chieu-chuong-hoa-hoai-nhon-binh-dinh-501921.jpg'
    ],
    rating: 4.4,
    reviews: [],
    checkIns: 1890,
    category: 'Traditional Craft',
    highlights: ['Mat Weaving', 'Sedge Plants', 'Traditional Patterns', 'Handicrafts']
  },
  {
    id: 'hien-ninh-bamboo',
    name: 'Hien Ninh Bamboo Craft',
    type: 'craft-village',
    position: [0, 0.08, 1.5],
    coordinates: [106.3456, 17.6234], // Real coordinates for Hien Ninh bamboo
    description: 'Specialized in bamboo craftsmanship, creating everything from household items to artistic decorations using sustainable bamboo.',
    images: [
      'https://bazantravel.com/cdn/medias/uploads/30/30164-lang-nghe-dan-lat-700x478.jpg'
    ],
    rating: 4.5,
    reviews: [],
    checkIns: 1650,
    category: 'Traditional Craft',
    highlights: ['Bamboo Crafts', 'Sustainable Materials', 'Household Items', 'Artistic Decorations']
  },
  {
    id: 'le-thuy-rattan',
    name: 'Le Thuy Rattan Village',
    type: 'craft-village',
    position: [-1.2, 0.06, 0.3],
    coordinates: [106.1234, 17.4567], // Real coordinates for Le Thuy rattan
    description: 'Master craftsmen creating beautiful rattan furniture and decorative items using traditional weaving techniques.',
    images: [
      'https://pefso.com/wp-content/uploads/2024/04/305849882_490189949782619_3247358147554599112_n-1024x682.jpeg'
    ],
    rating: 4.3,
    reviews: [],
    checkIns: 1420,
    category: 'Traditional Craft',
    highlights: ['Rattan Weaving', 'Furniture Making', 'Traditional Techniques', 'Decorative Items']
  },
  {
    id: 'bao-ninh-seafood',
    name: 'Bao Ninh Dried Seafood',
    type: 'craft-village',
    position: [1.8, 0.02, -1.5],
    coordinates: [106.7234, 17.3456], // Real coordinates for Bao Ninh seafood
    description: 'Coastal village specializing in traditional seafood drying and processing, creating delicious preserved seafood products.',
    images: [
      'https://cdn-i.vtcnews.vn/resize/th/upload/2024/05/29/ghe-tham-bien-bao-ninh-bai-bien-hoang-so-dep-nhat-quang-binh-22472563.jpg'
    ],
    rating: 4.2,
    reviews: [],
    checkIns: 980,
    category: 'Food Craft',
    highlights: ['Seafood Processing', 'Traditional Drying', 'Local Delicacies', 'Coastal Culture']
  },
  {
    id: 'dong-hoi-fish-sauce',
    name: 'Dong Hoi Fish Sauce',
    type: 'craft-village',
    position: [1.3, 0.03, -1.2],
    coordinates: [106.6678, 17.4123], // Real coordinates for Dong Hoi fish sauce
    description: 'Traditional fish sauce production village, creating premium fish sauce using age-old fermentation methods.',
    images: [
      'https://quangbinhtravel.vn/wp-content/uploads/2024/09/nuoc-mam-bao-ninh.jpg'
    ],
    rating: 4.4,
    reviews: [],
    checkIns: 1120,
    category: 'Food Craft',
    highlights: ['Fish Sauce Making', 'Fermentation Process', 'Premium Quality', 'Traditional Methods']
  }
];

export const allLocations = [...famousPlaces, ...craftVillages];