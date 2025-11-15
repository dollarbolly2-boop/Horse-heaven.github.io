// Responsive Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light theme
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';
    themeToggle.title = 'Switch to light theme';
  } else {
    themeIcon.className = 'fas fa-moon';
    themeToggle.title = 'Switch to dark theme';
  }
}

// Background Image Management
let currentHeaderImage = localStorage.getItem('headerBackground') || '';
let currentHeroImage = localStorage.getItem('heroBackground') || '';

// Rotating Background Images for Header
const rotatingHeaderImages = [
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1500595046743-cd271d694e30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
];

let currentRotatingIndex = 0;
let rotatingInterval;

// Initialize backgrounds when page loads
function initializeBackgrounds() {
  if (currentHeaderImage) {
    setBackgroundImage('header', currentHeaderImage);
  } else {
    // Start rotating backgrounds if no custom image is set
    startRotatingBackgrounds();
  }
  if (currentHeroImage) {
    setBackgroundImage('hero', currentHeroImage);
  }
}

function startRotatingBackgrounds() {
  if (rotatingInterval) {
    clearInterval(rotatingInterval);
  }
  
  // Set initial rotating background
  setBackgroundImage('header', rotatingHeaderImages[currentRotatingIndex]);
  
  // Start rotation every 5 seconds
  rotatingInterval = setInterval(() => {
    currentRotatingIndex = (currentRotatingIndex + 1) % rotatingHeaderImages.length;
    setBackgroundImage('header', rotatingHeaderImages[currentRotatingIndex]);
  }, 5000);
}

function stopRotatingBackgrounds() {
  if (rotatingInterval) {
    clearInterval(rotatingInterval);
    rotatingInterval = null;
  }
}

function setBackgroundImage(type, imageUrl) {
  const backgroundElement = document.getElementById(`${type}-background`);
  if (backgroundElement) {
    backgroundElement.style.backgroundImage = `url(${imageUrl})`;
  }
}

// Image Upload Modal Functions
let currentUploadType = '';

function openImageUpload(type) {
  currentUploadType = type;
  const modal = document.getElementById('image-upload-modal');
  const title = document.getElementById('upload-modal-title');
  
  title.textContent = `Upload ${type === 'header' ? 'Header' : 'Hero'} Background Image`;
  
  // Reset form
  document.getElementById('image-upload').value = '';
  document.getElementById('preview-section').style.display = 'none';
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeImageUpload() {
  const modal = document.getElementById('image-upload-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
  
  // Reset preview
  document.getElementById('preview-section').style.display = 'none';
  document.getElementById('preview-image').src = '';
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewImage = document.getElementById('preview-image');
    previewImage.src = e.target.result;
    document.getElementById('preview-section').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function applyImage() {
  const previewImage = document.getElementById('preview-image');
  const imageUrl = previewImage.src;
  
  if (currentUploadType === 'header') {
    currentHeaderImage = imageUrl;
    localStorage.setItem('headerBackground', imageUrl);
    setBackgroundImage('header', imageUrl);
    // Stop rotating backgrounds when custom image is applied
    stopRotatingBackgrounds();
  } else if (currentUploadType === 'hero') {
    currentHeroImage = imageUrl;
    localStorage.setItem('heroBackground', imageUrl);
    setBackgroundImage('hero', imageUrl);
  }
  
  closeImageUpload();
}

function resetImage() {
  if (currentUploadType === 'header') {
    currentHeaderImage = '';
    localStorage.removeItem('headerBackground');
    setBackgroundImage('header', '');
    // Restart rotating backgrounds when custom image is reset
    startRotatingBackgrounds();
  } else if (currentUploadType === 'hero') {
    currentHeroImage = '';
    localStorage.removeItem('heroBackground');
    setBackgroundImage('hero', '');
  }
  
  closeImageUpload();
}

// Close modal when clicking backdrop
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    closeImageUpload();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeImageUpload();
  }
});

// Initialize backgrounds when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeBackgrounds();
});

// Smooth Scrolling for Navigation
const navLinks = document.querySelectorAll('a.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId.startsWith('#')) {
      e.preventDefault();
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Sample Horse Data
const horses = [
  {
    name: 'Bella',
    breed: 'Thoroughbred',
    age: 'Young (2-5 years)',
    size: 'Light Horse',
    description: 'Energetic and friendly, perfect for experienced riders.',
    price: '$2,500',
    img: 'horse site/images/bella.jpg',
    icon: 'fa-horse'
  },
  {
    name: 'Max',
    breed: 'Quarter Horse',
    age: 'Adult (6-15 years)',
    size: 'Heavy Horse',
    description: 'Calm and strong, great for farm work and families.',
    price: '$3,200',
    img: 'horse site/images/max.jpg',
    icon: 'fa-horse-head'
  },
  {
    name: 'Luna',
    breed: 'Arabian',
    age: 'Senior (16+ years)',
    size: 'Light Horse',
    description: 'Gentle and loving, ideal for light riding and companionship.',
    price: '$1,800',
    img: 'horse site/images/luna.jpg',
    icon: 'fa-horse'
  },
  {
    name: 'Spirit',
    breed: 'Mustang',
    age: 'Young (2-5 years)',
    size: 'Pony',
    description: 'Playful and spirited, best for active owners.',
    price: '$2,800',
    img: 'horse site/images/spirit.jpg',
    icon: 'fa-horse-head'
  },
  {
    name: 'Daisy',
    breed: 'Appaloosa',
    age: 'Adult (6-15 years)',
    size: 'Light Horse',
    description: 'Smart and loyal, loves trail rides.',
    price: '$3,500',
    img: 'horse site/images/daisy.jpg',
    icon: 'fa-horse'
  }
];

// Add modal HTML to the page
let modal = document.createElement('div');
modal.id = 'image-modal';
modal.style.display = 'none';
modal.innerHTML = `
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <img id="modal-img" src="" alt="Horse Image">
    <div id="modal-details"></div>
  </div>
`;
document.body.appendChild(modal);

const modalBackdrop = modal.querySelector('.modal-backdrop');
const modalClose = modal.querySelector('.modal-close');
const modalImg = modal.querySelector('#modal-img');
const modalDetails = modal.querySelector('#modal-details');

function openModal(horse) {
  modalImg.src = horse.img;
  modalImg.alt = horse.name;
  modalDetails.innerHTML = `
    <h3>${horse.name}</h3>
    <p><strong>Breed:</strong> ${horse.breed}</p>
    <p><strong>Age:</strong> ${horse.age}</p>
    <p><strong>Size:</strong> ${horse.size}</p>
    <p><strong>Price:</strong> <span class="price">${horse.price}</span></p>
    <p>${horse.description}</p>
  `;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// Populate Horses Grid
const horsesGrid = document.getElementById('horses-grid');
function renderHorses(list) {
  horsesGrid.innerHTML = '';
  if (list.length === 0) {
    horsesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--primary-color);">No horses match your filters.</p>';
    return;
  }
  list.forEach(horse => {
    const card = document.createElement('div');
    card.className = 'horse-card';
    card.innerHTML = `
      ${horse.img ? `<img src="${horse.img}" alt="${horse.name}" class="horse-img">` : `<div class="horse-icon"><i class="fas ${horse.icon}"></i></div>`}
      <h3>${horse.name}</h3>
      <div class="horse-price">${horse.price}</div>
      <p><strong>Breed:</strong> ${horse.breed}</p>
      <p><strong>Age:</strong> ${horse.age}</p>
      <p><strong>Size:</strong> ${horse.size}</p>
      <p>${horse.description}</p>
      <a href="#contact" class="btn btn-primary">Adopt Me</a>
    `;
    if (horse.img) {
      card.querySelector('.horse-img').addEventListener('click', function() {
        openModal(horse);
      });
    }
    horsesGrid.appendChild(card);
  });
}
renderHorses(horses);

// Filtering
const breedFilter = document.getElementById('breed-filter');
const ageFilter = document.getElementById('age-filter');
const sizeFilter = document.getElementById('size-filter');
const priceFilter = document.getElementById('price-filter');

function filterHorses() {
  const breed = breedFilter.value;
  const age = ageFilter.value;
  const size = sizeFilter.value;
  const price = priceFilter.value;
  
  const filtered = horses.filter(horse => {
    const breedMatch = !breed || horse.breed.toLowerCase().replace(/ /g, '-') === breed;
    const ageMatch = !age || horse.age.toLowerCase().includes(age.split(' ')[0]);
    const sizeMatch = !size || horse.size.toLowerCase().replace(/ /g, '-') === size;
    
    // Price filtering logic
    let priceMatch = true;
    if (price) {
      const horsePrice = parseInt(horse.price.replace(/[$,]/g, ''));
      switch (price) {
        case 'low':
          priceMatch = horsePrice < 2000;
          break;
        case 'medium':
          priceMatch = horsePrice >= 2000 && horsePrice <= 3000;
          break;
        case 'high':
          priceMatch = horsePrice > 3000;
          break;
      }
    }
    
    return breedMatch && ageMatch && sizeMatch && priceMatch;
  });
  renderHorses(filtered);
}

breedFilter.addEventListener('change', filterHorses);
ageFilter.addEventListener('change', filterHorses);
sizeFilter.addEventListener('change', filterHorses);
priceFilter.addEventListener('change', filterHorses);

// Contact Form Validation and Success Message
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Basic validation (HTML5 required already in place)
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !subject || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    // Show success message
    contactForm.innerHTML = '<div style="text-align:center; color:var(--secondary-color); font-size:1.2rem; padding:2rem 0;">Thank you for contacting us! We will get back to you soon.</div>';
  });
} 