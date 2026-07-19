const sampleListings = [
  {
    "title": "Cozy Beachfront Cottage",
    "description": "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    "image": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1500,
    "location": "Malibu",
    "country": "United States"
  },
  {
    "title": "Modern Loft in Downtown",
    "description": "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    "image": "https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1200,
    "location": "New York City",
    "country": "United States"
  },
  {
    "title": "Mountain Retreat",
    "description": "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    "image": "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1000,
    "location": "Aspen",
    "country": "United States"
  },
  {
    "title": "Historic Villa in Tuscany",
    "description": "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2500,
    "location": "Florence",
    "country": "Italy"
  },
  {
    "title": "Secluded Treehouse Getaway",
    "description": "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    "image": "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 800,
    "location": "Portland",
    "country": "United States"
  },
  {
    "title": "Beachfront Paradise",
    "description": "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    "image": "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2000,
    "location": "Cancun",
    "country": "Mexico"
  },
  {
    "title": "Rustic Cabin by the Lake",
    "description": "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    "image": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 900,
    "location": "Lake Tahoe",
    "country": "United States"
  },
  {
    "title": "Luxury Penthouse with City Views",
    "description": "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    "image": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 3500,
    "location": "Los Angeles",
    "country": "United States"
  },
  {
    "title": "Ski-In/Ski-Out Chalet",
    "description": "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    "image": "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 3000,
    "location": "Verbier",
    "country": "Switzerland"
  },
  {
    "title": "Safari Lodge in the Serengeti",
    "description": "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
    "image": "https://images.unsplash.com/photo-1489493887464-892be6d1daae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 4000,
    "location": "Serengeti National Park",
    "country": "Tanzania"
  },
  {
    "title": "Historic Canal House",
    "description": "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
    "image": "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1800,
    "location": "Amsterdam",
    "country": "Netherlands"
  },
  {
    "title": "Private Island Retreat",
    "description": "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
    "image": "https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 10000,
    "location": "Fiji",
    "country": "Fiji"
  },
  {
    "title": "Charming Cottage in the Cotswolds",
    "description": "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1200,
    "location": "Cotswolds",
    "country": "United Kingdom"
  },
  {
    "title": "Historic Brownstone in Boston",
    "description": "Step back in time in this elegant historic brownstone located in the heart of Boston.",
    "image": "https://images.unsplash.com/photo-1444084316824-dc26d6657664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2200,
    "location": "Boston",
    "country": "United States"
  },
  {
    "title": "Beachfront Bungalow in Bali",
    "description": "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
    "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1800,
    "location": "Bali",
    "country": "Indonesia"
  },
  {
    "title": "Mountain View Cabin in Banff",
    "description": "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.",
    "image": "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1500,
    "location": "Banff",
    "country": "Canada"
  },
  {
    "title": "Art Deco Apartment in Miami",
    "description": "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.",
    "image": "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1600,
    "location": "Miami",
    "country": "United States"
  },
  {
    "title": "Tropical Villa in Phuket",
    "description": "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.",
    "image": "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 3000,
    "location": "Phuket",
    "country": "Thailand"
  },
  {
    "title": "Historic Castle in Scotland",
    "description": "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1444084316824-dc26d6657664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 4000,
    "location": "Scottish Highlands",
    "country": "United Kingdom"
  },
  {
    "title": "Desert Oasis in Dubai",
    "description": "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
    "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 5000,
    "location": "Dubai",
    "country": "United Arab Emirates"
  },
  {
    "title": "Rustic Log Cabin in Montana",
    "description": "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.",
    "image": "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1100,
    "location": "Montana",
    "country": "United States"
  },
  {
    "title": "Beachfront Villa in Greece",
    "description": "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
    "image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2500,
    "location": "Mykonos",
    "country": "Greece"
  },
  {
    "title": "Eco-Friendly Treehouse Retreat",
    "description": "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.",
    "image": "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 750,
    "location": "Costa Rica",
    "country": "Costa Rica"
  },
  {
    "title": "Historic Cottage in Charleston",
    "description": "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.",
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1600,
    "location": "Charleston",
    "country": "United States"
  },
  {
    "title": "Modern Apartment in Tokyo",
    "description": "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
    "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2000,
    "location": "Tokyo",
    "country": "Japan"
  },
  {
    "title": "Lakefront Cabin in New Hampshire",
    "description": "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
    "image": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1200,
    "location": "New Hampshire",
    "country": "United States"
  },
  {
    "title": "Luxury Villa in the Maldives",
    "description": "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
    "image": "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 6000,
    "location": "Maldives",
    "country": "Maldives"
  },
  {
    "title": "Ski Chalet in Aspen",
    "description": "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
    "image": "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 4000,
    "location": "Aspen",
    "country": "United States"
  },
  {
    "title": "Secluded Beach House in Costa Rica",
    "description": "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
    "image": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1800,
    "location": "Costa Rica",
    "country": "Costa Rica"
  },
  {
    "title": "Ivy-Draped Apartment near the Colosseum",
    "description": "Wake up steps from ancient ruins in this sun-filled apartment in the heart of Rome. Cobblestone streets, espresso bars, and 2,000 years of history are right outside your door.",
    "image": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1700,
    "location": "Rome",
    "country": "Italy"
  },
  {
    "title": "Sunlit Gaudí-Inspired Loft",
    "description": "A bright, art-filled loft in Barcelona's Eixample district with mosaic tile accents and a private balcony. Walk to La Sagrada Família or catch the metro straight to the beach.",
    "image": "https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1400,
    "location": "Barcelona",
    "country": "Spain"
  },
  {
    "title": "Harbourside Retreat with Skyline Views",
    "description": "Floor-to-ceiling windows frame the harbour and the bridge from this sleek waterfront apartment. Minutes from the ferry terminal, the Opera House, and the city's best beaches.",
    "image": "https://images.unsplash.com/photo-1546268060-2592ff93ee24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1524293581917-878a6d017c71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1524820197278-540916411e20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2200,
    "location": "Sydney",
    "country": "Australia"
  },
  {
    "title": "Old Town Spire-View Apartment",
    "description": "A cosy top-floor apartment with a view of Prague's fairy-tale spires and red rooftops. Wander cobbled lanes to the Charles Bridge or the castle just across the river.",
    "image": "https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1050,
    "location": "Prague",
    "country": "Czech Republic"
  },
  {
    "title": "Marina Bay Skyline Suite",
    "description": "A high-floor suite with wraparound windows facing Marina Bay's iconic skyline. Steps from Gardens by the Bay and walking distance to world-class food courts.",
    "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2400,
    "location": "Singapore",
    "country": "Singapore"
  },
  {
    "title": "Copacabana Beachfront Flat",
    "description": "Fall asleep to the sound of the surf in this beachfront flat facing Copacabana's famous curve, with Sugarloaf Mountain on the skyline. A short walk to Ipanema and the samba clubs of Lapa.",
    "image": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1300,
    "location": "Rio de Janeiro",
    "country": "Brazil"
  },
  {
    "title": "Left Bank Apartment with Eiffel Tower Views",
    "description": "A classic Haussmann apartment on the Seine with the Eiffel Tower rising over the rooftops. Wrought-iron balcony, herringbone floors, and every arrondissement within reach.",
    "image": "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1444084316824-dc26d6657664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2000,
    "location": "Paris",
    "country": "France"
  },
  {
    "title": "Grand Canal Palazzo Suite",
    "description": "A restored palazzo suite with arched windows opening straight onto the Grand Canal. Gondolas glide past at breakfast; the Rialto and San Marco are a short walk over the bridges.",
    "image": "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1900,
    "location": "Venice",
    "country": "Italy"
  },
  {
    "title": "Tower Bridge View Flat",
    "description": "A red-brick riverside flat with Tower Bridge lit up right outside the window. Black cabs and double-decker buses roll past on the way to the Tower of London and Borough Market.",
    "image": "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1444084316824-dc26d6657664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1800,
    "location": "London",
    "country": "United Kingdom"
  },
  {
    "title": "Cloud Forest Lodge near Machu Picchu",
    "description": "A timber lodge in the Sacred Valley's cloud forest, a short train ride from the Machu Picchu ruins. Wake up to mist rolling over the Andes and hummingbirds at the breakfast table.",
    "image": "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1300,
    "location": "Machu Picchu",
    "country": "Peru"
  },
  {
    "title": "Riverside Loft in Old Bangkok",
    "description": "A converted shophouse loft near the Chao Phraya river, with the city's night markets and neon-lit streets right outside. Longtail boats to the Grand Palace leave from the pier nearby.",
    "image": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 950,
    "location": "Bangkok",
    "country": "Thailand"
  },
  {
    "title": "Heritage Haveli near India Gate",
    "description": "A restored colonial-era haveli with courtyard gardens, minutes from India Gate and the diplomatic enclave. High ceilings, carved wooden shutters, and a rooftop perfect for evening chai.",
    "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 900,
    "location": "New Delhi",
    "country": "India"
  },
  {
    "title": "Pink City Palace Suite",
    "description": "A suite inside a converted haveli in Jaipur's walled Pink City, overlooking a street of palaces and temple bells. Camel carts and painted elephants pass by most mornings.",
    "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 800,
    "location": "Jaipur",
    "country": "India"
  },
  {
    "title": "Marine Drive Sea-View Apartment",
    "description": "A high-floor apartment on Mumbai's famous Marine Drive promenade, with sea breeze and joggers passing below at sunset. Local trains and Colaba's markets are minutes away.",
    "image": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1000,
    "location": "Mumbai",
    "country": "India"
  }
,
{
    "title": "Riad Courtyard Retreat in the Medina",
    "description": "A restored riad hidden behind an unmarked door in Marrakech's old medina, built around a tiled courtyard with a small plunge pool and orange trees. The souks and Jemaa el-Fnaa are a five-minute walk through the alleys.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Riad%20Zitoun%20Jdid%2C%20Marrakesh%2C%20Morocco%20-%20panoramio%20%286%29.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ceramic%20Tile%20Tessellations%20in%20Marrakech.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Moroccan%20bath%20in%20riad%20in%20Fez.jpg?width=800",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 950,
    "location": "Marrakech",
    "country": "Morocco"
  },
  {
    "title": "Blue-Tiled Riad near Fez's Old Medina",
    "description": "A centuries-old merchant house in Fez el-Bali, restored with zellige tilework and a private hammam. Donkey carts and leather tanneries fill the narrow lanes just outside the door.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Moroccan%20bath%20in%20riad%20in%20Fez.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Riad%20Marrakech%20unrenoveted.JPG?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Riad%20Zitoun%20Jdid%2C%20Marrakesh%2C%20Morocco%20-%20panoramio%20%286%29.jpg?width=800",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 850,
    "location": "Fez",
    "country": "Morocco"
  },
  {
    "title": "Table Mountain View Villa",
    "description": "A sunlit villa on the slopes of Table Mountain with a wraparound deck facing the Atlantic. Cable-car queues, vineyards, and Camps Bay's beaches are all a short drive away.",
    "image": "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1489493887464-892be6d1daae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1400,
    "location": "Cape Town",
    "country": "South Africa"
  },
  {
    "title": "Maasai Mara Safari Tent Camp",
    "description": "Canvas tents on raised decks overlooking the savanna, close enough to hear the Mara River at night. Guided game drives leave at dawn to catch the wildebeest migration.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Wing%20Mountain%20Camping%20Area%20FR%20222%20%2836633028470%29.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1489493887464-892be6d1daae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tents%2C%20Blacklands%20Farm%20-%20geograph.org.uk%20-%20182736.jpg?width=800"
    ],
    "price": 1650,
    "location": "Maasai Mara",
    "country": "Kenya"
  },
  {
    "title": "Zanzibar Beach Bungalow",
    "description": "A thatched-roof bungalow steps from Zanzibar's turquoise shallows, with dhow sails drifting past at sunset. Stone Town's spice markets are forty minutes down the coast road.",
    "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1050,
    "location": "Zanzibar",
    "country": "Tanzania"
  },
  {
    "title": "Namib Desert Dune Lodge",
    "description": "A glass-fronted lodge facing the towering red dunes of the Namib, with the Milky Way visible from bed most nights. Sossusvlei's clay pans are reachable before the morning heat sets in.",
    "image": "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1489493887464-892be6d1daae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1900,
    "location": "Namib Desert",
    "country": "Namibia"
  },
  {
    "title": "Recoleta Balcony Apartment",
    "description": "A high-ceilinged apartment in Buenos Aires' Recoleta district, with French balconies overlooking a tree-lined avenue. Tango parlours and steakhouses fill the blocks nearby.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Paris%20Apartment%20style%20interior.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lima%20Peru%20city%20-%20Modern%20Apartment%20-%20interior.jpg?width=800",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1150,
    "location": "Buenos Aires",
    "country": "Argentina"
  },
  {
    "title": "Patagonian Lodge under the Andes",
    "description": "A timber lodge at the foot of granite peaks in Chilean Patagonia, with a wood stove and a view of glaciers calving into turquoise lakes. Trailheads for Torres del Paine start right outside.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Log%20cabin%20covered%20in%20snow.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1550,
    "location": "Patagonia",
    "country": "Chile"
  },
  {
    "title": "Walled City Balcony House in Cartagena",
    "description": "A brightly painted colonial house inside Cartagena's walled old town, with a wooden balcony overlooking a plaza. Salsa bars and the Caribbean seawall are both an easy stroll away.",
    "image": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 900,
    "location": "Cartagena",
    "country": "Colombia"
  },
  {
    "title": "Galápagos Eco-Lodge on the Water's Edge",
    "description": "A solar-powered lodge on a quiet cove in the Galápagos, where sea lions nap on the dock and marine iguanas cross the path. Snorkeling trips to the outer islands leave from the beach.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Rainforest.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2600,
    "location": "Galápagos Islands",
    "country": "Ecuador"
  },
  {
    "title": "Jungle-Fringed Beach House in Tulum",
    "description": "A palm-thatched house where the jungle meets white sand, a short bike ride from Tulum's ruins. Cenotes for swimming are scattered through the surrounding forest.",
    "image": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Rainforest.jpg?width=800"
    ],
    "price": 1300,
    "location": "Tulum",
    "country": "Mexico"
  },
  {
    "title": "Courtyard Casa in Oaxaca",
    "description": "A hand-painted colonial casa built around a bougainvillea courtyard in Oaxaca's historic centre, minutes from the mezcalerías and textile markets of the Zócalo.",
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Riad%20Marrakech%20unrenoveted.JPG?width=800"
    ],
    "price": 800,
    "location": "Oaxaca",
    "country": "Mexico"
  },
  {
    "title": "Old Quebec Stone House",
    "description": "A 19th-century stone rowhouse inside the walls of Old Quebec, with a wood-burning fireplace and cobblestones outside the door. Château Frontenac is visible from the attic window.",
    "image": "https://images.unsplash.com/photo-1444084316824-dc26d6657664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Castle%20in%20Malbork%202015%20381.jpg?width=800"
    ],
    "price": 1250,
    "location": "Quebec City",
    "country": "Canada"
  },
  {
    "title": "Havana Colonial Casa Particular",
    "description": "A pastel-painted colonial home a block from the Malecón, with a wrought-iron balcony over a street full of vintage cars. Old Havana's plazas are a short walk along the seafront.",
    "image": "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 700,
    "location": "Havana",
    "country": "Cuba"
  },
  {
    "title": "Montego Bay Beachfront Cottage",
    "description": "A jalousie-windowed cottage on a quiet stretch of Montego Bay, with a hammock strung between two palms and reggae drifting from the beach bar down the sand.",
    "image": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1200,
    "location": "Montego Bay",
    "country": "Jamaica"
  },
  {
    "title": "Nassau Harbour Beach Villa",
    "description": "A pink-shuttered villa facing Nassau's harbour, with a private dock for the boats that potter between the cays. Straw markets and conch shacks line the waterfront into town.",
    "image": "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 2100,
    "location": "Nassau",
    "country": "Bahamas"
  },
  {
    "title": "Punta Cana All-White Beach Suite",
    "description": "A breezy suite steps from Punta Cana's coconut-lined sand, with an outdoor rain shower and a plunge pool shared with three other units. Merengue bars open along the shore after dark.",
    "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1700,
    "location": "Punta Cana",
    "country": "Dominican Republic"
  },
  {
    "title": "Fairbanks Aurora Viewing Cabin",
    "description": "An off-grid log cabin outside Fairbanks with a heated glass dome for watching the northern lights from bed. Sled dogs and the frozen Chena River are within walking distance.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Aurora%20Borealis%20or%20Northern%20Lights%20shines%20above%20Bear%20Lake%20at%20Eielson%20Air%20Force%20Base%2C%20Alaska%2C%20on%2018%20Jan%20050118-F-MS415-003.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Aurora-Igloo-Iceland.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Log%20cabin%20covered%20in%20snow.jpg?width=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1450,
    "location": "Fairbanks, Alaska",
    "country": "United States"
  },
  {
    "title": "Reykjavik Aurora Glass Igloo",
    "description": "A geodesic glass igloo on a hillside outside Reykjavik, built for lying back and watching the aurora borealis overhead. Geothermal pools and black-sand beaches are a short drive away.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Aurora-Igloo-Iceland.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Igloo%20with%20a%20window.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Inside%20an%20igloo%2C%20looking%20out.JPG?width=800",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1800,
    "location": "Reykjavik",
    "country": "Iceland"
  },
  {
    "title": "Tromsø Fjordside Snow Cabin",
    "description": "A timber cabin on the edge of a fjord above the Arctic Circle, with a wood stove and skies that turn green with the aurora most clear nights. Whale-watching boats leave from the nearby harbour.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Igloo%20with%20a%20window.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Log%20cabin%20covered%20in%20snow.jpg?width=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Inside%20an%20igloo%2C%20looking%20out.JPG?width=800"
    ],
    "price": 1600,
    "location": "Tromsø",
    "country": "Norway"
  },
  {
    "title": "Gamla Stan Attic Apartment",
    "description": "A sloped-ceiling attic apartment above Stockholm's old town, with a view over red rooftops to the water. Cobbled lanes lead down to the palace and the ferry docks.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Living%20room%20%28Unsplash%29.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1524293581917-878a6d017c71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1350,
    "location": "Stockholm",
    "country": "Sweden"
  },
  {
    "title": "Danish Countryside Camping Retreat",
    "description": "A furnished bell tent on a working farm near Kollund, with the Flensburg Fjord visible across the fields. Bicycles are left out front for exploring the coastal paths.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Tent%20camp%20with%20car%20at%20the%20FDM%20camp%20in%20Kollund%2C%20Denmark.png?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tents%2C%20Blacklands%20Farm%20-%20geograph.org.uk%20-%20182736.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Cwmmau%20Farmhouse.JPG?width=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 650,
    "location": "Kollund",
    "country": "Denmark"
  },
  {
    "title": "Wawel Hill Castle View Suite",
    "description": "A suite in a restored townhouse facing Wawel Castle across the Vistula, in Krakow's UNESCO-listed old town. The main square's cloth hall and churches are a ten-minute walk.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Wavel%20Castle%20and%20the%20Hens%20foot%20tower%20on%20the%20top%20righ%20%289156923387%29.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1050,
    "location": "Krakow",
    "country": "Poland"
  },
  {
    "title": "Medieval Castle Stay in Malbork",
    "description": "A converted gatehouse room within sight of Malbork Castle, the largest brick fortress in the world. Guided torchlight tours of the castle grounds run most evenings in summer.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Malbork%20Castle%202023%20016.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Malbork%20Castle.jpg?width=800",
      "https://images.unsplash.com/photo-1444084316824-dc26d6657664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1150,
    "location": "Malbork",
    "country": "Poland"
  },
  {
    "title": "Fortified Castle Stay in Carcassonne",
    "description": "A room built into the ramparts of Carcassonne's fortified medieval city, with arrow-slit windows facing the Aude countryside. The floodlit citadel walls are lit up just outside after dark.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Carcassonne%20castle%20tower%20roof.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Wavel%20Castle%20and%20the%20Hens%20foot%20tower%20on%20the%20top%20righ%20%289156923387%29.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Paris%20Apartment%20style%20interior.jpg?width=800"
    ],
    "price": 1500,
    "location": "Carcassonne",
    "country": "France"
  },
  {
    "title": "Countryside Castle Stay near Chester",
    "description": "A stone gatehouse room at the edge of Chester's old Roman walls, with the castle's outer bailey visible from the window seat. Half-timbered shopping rows are a short walk into the city centre.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Agricola%20Tower%2C%20Chester%20Castle%20-%20geograph.org.uk%20-%20675807.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Carcassonne%20castle%20tower%20roof.jpg?width=800",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1250,
    "location": "Chester",
    "country": "United Kingdom"
  },
  {
    "title": "Ringstrasse Apartment in Vienna",
    "description": "A high-ceilinged apartment near Vienna's Ringstrasse, with parquet floors and a view of the opera house rooftop. Coffee houses and the Hofburg palace are minutes away on foot.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Paris%20Apartment%20style%20interior.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1400,
    "location": "Vienna",
    "country": "Austria"
  },
  {
    "title": "Alpine Ski Chalet near Salzburg",
    "description": "A timber chalet in the mountains outside Salzburg, with a sauna and views over pine forest to the peaks. Baroque old-town churches and cable cars are a short drive down the valley.",
    "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Log%20cabin%20covered%20in%20snow.jpg?width=800"
    ],
    "price": 2200,
    "location": "Salzburg",
    "country": "Austria"
  },
  {
    "title": "Whitewashed Farmhouse in County Clare",
    "description": "A stone farmhouse on the edge of the Burren, with turf fires and sheep grazing the walled fields outside. The Cliffs of Moher are a short coastal drive from the front gate.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Cwmmau%20Farmhouse.JPG?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Slighhouses%20Farmhouse.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bon%20Air%20farmhouse%20from%20northwest.jpg?width=800",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 950,
    "location": "County Clare",
    "country": "Ireland"
  },
  {
    "title": "Dales Farmhouse Retreat in Yorkshire",
    "description": "A working sheep farm's guest wing in the Yorkshire Dales, with drystone walls, a woodburner, and hiking trails leading straight from the back gate into the hills.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Slighhouses%20Farmhouse.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/1760s%20farmhouse%20Narvon%20Pennsylvania.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bon%20Air%20farmhouse%20from%20northwest.jpg?width=800",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 780,
    "location": "Yorkshire Dales",
    "country": "United Kingdom"
  },
  {
    "title": "Alfama Tile-Front Apartment in Lisbon",
    "description": "A tiled townhouse apartment in Lisbon's Alfama district, with a balcony over the tram tracks and the river beyond the rooftops. Fado bars and miradouro viewpoints are all within walking distance.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Lima%20Peru%20city%20-%20Modern%20Apartment%20-%20interior.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1524293581917-878a6d017c71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1050,
    "location": "Lisbon",
    "country": "Portugal"
  },
  {
    "title": "Ribeira Riverside House in Porto",
    "description": "A narrow riverside house in Porto's Ribeira district, with a balcony over the Douro and port-wine cellars visible across the water. Breakfast is best eaten watching the boats loading barrels.",
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Houseboat%20Canal%20du%20Midi%20Poilhes-DSC%200082.jpg?width=800"
    ],
    "price": 1100,
    "location": "Porto",
    "country": "Portugal"
  },
  {
    "title": "Old Town Sea-View Apartment in Dubrovnik",
    "description": "A stone apartment inside Dubrovnik's walled old town, with a terrace facing the Adriatic and the city's famous ramparts a few steps away. Cable cars up Mount Srđ leave from just outside the walls.",
    "image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1750,
    "location": "Dubrovnik",
    "country": "Croatia"
  },
  {
    "title": "Danube-View Apartment in Budapest",
    "description": "A restored apartment above the Danube in Budapest, with the Parliament building lit up across the water at night. Thermal baths and the chain bridge are both an easy walk.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Living%20room%20%28Unsplash%29.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1524820197278-540916411e20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 950,
    "location": "Budapest",
    "country": "Hungary"
  },
  {
    "title": "Bosphorus View Apartment in Istanbul",
    "description": "An apartment in Istanbul's Cihangir neighbourhood with a balcony facing the Bosphorus and ferries crossing between continents below. The Grand Bazaar and Hagia Sophia are a tram ride away.",
    "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1300,
    "location": "Istanbul",
    "country": "Turkey"
  },
  {
    "title": "Cappadocia Cave Suite",
    "description": "A carved cave suite in a Cappadocia hillside, with a rooftop terrace for watching hot-air balloons drift over the fairy chimneys at sunrise. Underground cities and valley hikes are minutes away.",
    "image": "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1400,
    "location": "Cappadocia",
    "country": "Turkey"
  },
  {
    "title": "Desert Camp near Wadi Rum",
    "description": "A Bedouin-style tent camp beneath the red cliffs of Wadi Rum, with a campfire circle and a roof that opens to the stars. Jeep tours into the desert leave from camp each morning.",
    "image": "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Wing%20Mountain%20Camping%20Area%20FR%20222%20%2836633028470%29.jpg?width=800",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1489493887464-892be6d1daae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1000,
    "location": "Wadi Rum",
    "country": "Jordan"
  },
  {
    "title": "Neve Tzedek Courtyard House in Tel Aviv",
    "description": "A restored Bauhaus-era house in Tel Aviv's Neve Tzedek quarter, with a plant-filled courtyard and the beach a ten-minute walk down tree-lined streets.",
    "image": "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1600,
    "location": "Tel Aviv",
    "country": "Israel"
  },
  {
    "title": "Hutong Courtyard House in Beijing",
    "description": "A restored siheyuan courtyard house tucked in a Beijing hutong, with grey-brick walls and lantern-lit eaves shielding it from the city outside. The Forbidden City is a short cycle away.",
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Japanese%20room%20with%20tatami%20mats.jpg?width=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1150,
    "location": "Beijing",
    "country": "China"
  },
  {
    "title": "Bund Skyline Apartment in Shanghai",
    "description": "A high-floor apartment overlooking Shanghai's Bund, with the neon towers of Pudong lighting up the river each evening. The Yu Garden and old town are a short metro ride away.",
    "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1450,
    "location": "Shanghai",
    "country": "China"
  },
  {
    "title": "Traditional Ryokan Stay in Kyoto",
    "description": "A family-run ryokan near Kyoto's Gion district, with tatami floors, futon bedding, and a private onsen bath. Bamboo groves and lantern-lit temple lanes are a short walk away.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Japanese%20room%20with%20tatami%20mats.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Fujiya%20Ryokan%20in%20Ginzan%20Onsen%2020181006.jpg?width=800",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1250,
    "location": "Kyoto",
    "country": "Japan"
  },
  {
    "title": "Ancient Town Lantern House in Hoi An",
    "description": "A yellow-walled merchant house on Hoi An's riverside, with silk lanterns strung along the lane outside. Tailors, lantern workshops, and the river market are all within a short walk.",
    "image": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 850,
    "location": "Hoi An",
    "country": "Vietnam"
  },
  {
    "title": "Overnight Cruise Cabin on Ha Long Bay",
    "description": "A wood-panelled cabin aboard a junk boat drifting between the limestone karsts of Ha Long Bay, with a private balcony for watching the sun set over the water.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Voyagaire%20Houseboats%2C%20Crane%20Lake%2C%20Minnesota%20%2837219529400%29.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Houseboat%20Canal%20du%20Midi%20Poilhes-DSC%200082.jpg?width=800",
      "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1400,
    "location": "Ha Long Bay",
    "country": "Vietnam"
  },
  {
    "title": "Kerala Backwater Houseboat Stay",
    "description": "A traditional kettuvallam houseboat drifting through Alleppey's palm-fringed backwaters, with meals cooked on board and paddy fields sliding past the window.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Houseboat%20Canal%20du%20Midi%20Poilhes-DSC%200082.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Voyagaire%20Houseboats%2C%20Crane%20Lake%2C%20Minnesota%20%2837219529400%29.jpg?width=800",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 750,
    "location": "Alleppey",
    "country": "India"
  },
  {
    "title": "El Nido Cliffside Beach Cottage",
    "description": "A stilted cottage on a lagoon in Palawan's El Nido, with limestone cliffs rising straight out of the water. Island-hopping bancas leave from the beach each morning.",
    "image": "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1500,
    "location": "Palawan",
    "country": "Philippines"
  },
  {
    "title": "Langkawi Overwater Beach Villa",
    "description": "A stilted villa over a quiet lagoon in Langkawi, with steps straight down into the water and a cable car up the rainforest canopy nearby. Duty-free markets are a short ride into town.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Bali%20House%2C%20dwelling%2C%20Kiholo%20Bay%2C%20Hawaii%20%282408463000%29.jpg?width=800",
    "images": [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1900,
    "location": "Langkawi",
    "country": "Malaysia"
  },
  {
    "title": "Himalayan Guesthouse in Kathmandu Valley",
    "description": "A stone guesthouse on a ridge above the Kathmandu Valley, with prayer flags strung between the eaves and snow peaks visible on clear mornings. Trailheads for the Annapurna foothills start nearby.",
    "image": "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Log%20cabin%20covered%20in%20snow.jpg?width=800"
    ],
    "price": 700,
    "location": "Kathmandu",
    "country": "Nepal"
  },
  {
    "title": "Lakefront Lodge in Queenstown",
    "description": "A timber lodge on the shore of Lake Wakatipu, with the Remarkables mountain range framing the view from the deck. Bungee jumps and vineyard tours both leave from town, ten minutes away.",
    "image": "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "images": [
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1750,
    "location": "Queenstown",
    "country": "New Zealand"
  },
  {
    "title": "Amazon Rainforest Jungle Lodge",
    "description": "An open-air jungle lodge on a tributary near Manaus, with a hammock deck over the water and howler monkeys calling from the canopy at dawn. Boat trips to spot pink river dolphins leave from the lodge dock.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Bar%20in%20amazon%20ecopark%20jungle%20lodge%20in%20Manaus-Am-Brazil.%20-%20panoramio.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brazil-00499%20-%20My%20Bungalow..%20%2848963817701%29.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Rainforest.jpg?width=800",
      "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 1300,
    "location": "Manaus",
    "country": "Brazil"
  },
  {
    "title": "National Park Camping Retreat in Yosemite",
    "description": "A canvas-sided cabin tent under the pines near Yosemite Valley, with granite cliffs visible through the trees and a campfire ring out front. Trailheads for the valley floor are a short drive away.",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Wing%20Mountain%20Camping%20Area%20FR%20222%20%2836633028470%29.jpg?width=800",
    "images": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tents%2C%20Blacklands%20Farm%20-%20geograph.org.uk%20-%20182736.jpg?width=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    ],
    "price": 600,
    "location": "Yosemite Valley",
    "country": "United States"
  }
];

module.exports = { data: sampleListings };
