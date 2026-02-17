// reviews.js - simplified version

// Starting reviews (you can change these)
const initialReviews = [
  {
    name: "Priya Malhotra",
    rating: 5,
    text: "Best investment app I've used in India. Super clean UI and instant withdrawals. 10/10 would recommend!",
    date: "Jan 15, 2026"
  },
  {
    name: "Rahul Verma",
    rating: 4,
    text: "Very smooth experience overall. Just wish they had more mutual fund options. Still, very happy with the service.",
    date: "Feb 02, 2026"
  },
  {
    name: "Ananya Singh",
    rating: 5,
    text: "Customer support is actually helpful! They solved my KYC issue in 20 minutes over chat. Impressed.",
    date: "Dec 28, 2025"
  }
];

// Get important elements
const reviewsContainer = document.querySelector('.reviews');
const reviewForm      = document.getElementById('reviewForm');
const ratingStars     = document.getElementById('ratingStars');
const ratingInput     = document.getElementById('rating');

// Show all reviews on page
function showReviews() {
  reviewsContainer.innerHTML = ''; // clear old reviews

  // Combine saved reviews + initial ones
  let allReviews = initialReviews;
  let saved = localStorage.getItem('userReviews');
  if (saved) {
    allReviews = allReviews.concat(JSON.parse(saved));
  }

  // Add each review to page
  for (let i = 0; i < allReviews.length; i++) {
    let review = allReviews[i];

    let card = document.createElement('div');
    card.className = 'review-card';

    let stars = '';
    for (let s = 1; s <= 5; s++) {
      if (s <= review.rating) {
        stars += '★';
      } else {
        stars += '☆';
      }
    }

    card.innerHTML = `
      <div class="stars">${stars}</div>
      <p class="review-text">"${review.text}"</p>
      <div class="reviewer">
        <strong>${review.name}</strong>
        <small>${review.date}</small>
      </div>
    `;

    reviewsContainer.appendChild(card);
  }
}

// Star rating click
ratingStars.addEventListener('click', function(e) {
  if (!e.target.dataset.value) return;

  let selected = Number(e.target.dataset.value);
  ratingInput.value = selected;

  // Color the stars up to clicked one
  let stars = ratingStars.children;
  for (let i = 0; i < stars.length; i++) {
    if (i < selected) {
      stars[i].classList.add('active');
    } else {
      stars[i].classList.remove('active');
    }
  }
});

// Form submit - save new review
reviewForm.addEventListener('submit', function(e) {
  e.preventDefault();

  let name    = document.getElementById('name').value.trim();
  let rating  = Number(ratingInput.value);
  let comment = document.getElementById('comment').value.trim();

  if (rating === 0) {
    alert("Please select a rating!");
    return;
  }

  if (name === '' || comment === '') {
    alert("Please fill your name and review!");
    return;
  }

  let newReview = {
    name: name,
    rating: rating,
    text: comment,
    date: new Date().toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  };

  // Save to localStorage
  let savedReviews = [];
  let saved = localStorage.getItem('userReviews');
  if (saved) {
    savedReviews = JSON.parse(saved);
  }
  savedReviews.push(newReview);
  localStorage.setItem('userReviews', JSON.stringify(savedReviews));

  // Thank user and refresh
  alert("Thank you for your review! ❤️");
  reviewForm.reset();
  ratingInput.value = 0;

  // Reset star colors
  let stars = ratingStars.children;
  for (let i = 0; i < stars.length; i++) {
    stars[i].classList.remove('active');
  }

  // Show updated list
  showReviews();
});

// Load reviews when page opens
showReviews();