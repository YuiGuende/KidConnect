// Get search filters from localStorage
const searchFilters = JSON.parse(localStorage.getItem('searchFilters') || '{}');

// Mock Data - All Profiles Array
const allProfiles = [
    {
        id: 1,
        name: "Minh Anh",
        age: 7,
        distance: 2.5,
        interests: ["Vẽ tranh", "Đọc sách", "Lego"],
        verified: true,
        image: "../pictures/children-1.png",
        description: "Bé thích sáng tạo và đọc sách, rất hòa đồng và thân thiện"
    },
    {
        id: 2,
        name: "Tuấn Anh",
        age: 8,
        distance: 1.8,
        interests: ["Bóng đá", "Vui chơi ngoài trời", "Xe đạp"],
        verified: true,
        image: "../pictures/children-2.png",
        description: "Năng động, yêu thích thể thao và các hoạt động ngoài trời"
    },
    {
        id: 3,
        name: "Linh Chi",
        age: 6,
        distance: 3.2,
        interests: ["Nhảy múa", "Kể chuyện", "Hát"],
        verified: true,
        image: "../pictures/children-3.png",
        description: "Bé thích nghệ thuật, nhảy múa và kể chuyện cho bạn bè nghe"
    },
    {
        id: 4,
        name: "Bảo An",
        age: 7,
        distance: 4.1,
        interests: ["Cờ vua", "Đọc sách", "Khoa học"],
        verified: false,
        image: "../pictures/children-1.png",
        description: "Thông minh, đam mê khoa học và các trò chơi trí tuệ"
    },
    {
        id: 5,
        name: "Hương Giang",
        age: 8,
        distance: 2.9,
        interests: ["Vẽ tranh", "Thủ công", "Nấu ăn"],
        verified: true,
        image: "../pictures/children-3.png",
        description: "Sáng tạo, thích làm thủ công và nấu ăn cùng mẹ"
    },
    {
        id: 6,
        name: "Đức Minh",
        age: 7,
        distance: 2.1,
        interests: ["Bóng đá", "Xe đạp", "Vui chơi ngoài trời"],
        verified: true,
        image: "../pictures/children-2.png",
        description: "Yêu thể thao, đặc biệt là bóng đá và đạp xe"
    },
    {
        id: 7,
        name: "Mai Linh",
        age: 6,
        distance: 3.5,
        interests: ["Nhảy múa", "Vẽ tranh", "Kể chuyện"],
        verified: false,
        image: "../pictures/children-3.png",
        description: "Bé thích nghệ thuật và luôn vui vẻ, hòa đồng với mọi người"
    },
    {
        id: 8,
        name: "Quang Huy",
        age: 8,
        distance: 1.5,
        interests: ["Lego", "Khoa học", "Cờ vua"],
        verified: true,
        image: "../pictures/children-1.png",
        description: "Thông minh, thích lắp ráp Lego và chơi cờ vua"
    }
];

// Filter profiles based on search criteria
function filterProfiles() {
    let filtered = [...allProfiles];
    
    // Filter by age (within 1 year range)
    if (searchFilters.childAge) {
        const targetAge = parseInt(searchFilters.childAge);
        filtered = filtered.filter(p => Math.abs(p.age - targetAge) <= 1);
    }
    
    // Filter by distance
    if (searchFilters.distance) {
        const maxDistance = parseFloat(searchFilters.distance);
        filtered = filtered.filter(p => p.distance <= maxDistance);
    }
    
    // Filter by interests (at least one match)
    if (searchFilters.interests && searchFilters.interests.length > 0) {
        filtered = filtered.filter(p => 
            p.interests.some(interest => searchFilters.interests.includes(interest))
        );
    }
    
    // Filter by verified only
    if (searchFilters.verifiedOnly) {
        filtered = filtered.filter(p => p.verified);
    }
    
    return filtered;
}

// Get filtered profiles
const profiles = filterProfiles();

let currentIndex = 0;
let currentCards = [...profiles];
let likeCount = 0;

// Initialize
function init() {
    renderCards();
    setupEventListeners();
}

// Render Cards
function renderCards() {
    const cardStack = document.getElementById('cardStack');
    cardStack.innerHTML = '';
    
    if (currentCards.length === 0) {
        showEmptyState();
        return;
    }
    
    // Show up to 3 cards in stack
    const cardsToShow = currentCards.slice(0, 3);
    
    cardsToShow.forEach((profile, index) => {
        const card = createCard(profile, index);
        cardStack.appendChild(card);
    });
}

// Create Card Element
function createCard(profile, index) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.style.zIndex = currentCards.length - index;
    card.style.transform = `scale(${1 - index * 0.05}) translateY(${index * 10}px)`;
    card.dataset.profileId = profile.id;
    
    const verifiedBadge = profile.verified 
        ? '<span class="verified-badge-wrapper"><i class="bi bi-shield-check verified-badge"></i></span>' 
        : '';
    
    const interestsHTML = profile.interests
        .map(interest => `<span class="interest-tag">${interest}</span>`)
        .join('');
    
    const description = profile.description || '';
    
    card.innerHTML = `
        <img src="${profile.image}" alt="${profile.name}" class="card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'450\'%3E%3Crect fill=\'%230ea5e9\' width=\'400\' height=\'450\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dominant-baseline=\'middle\' fill=\'white\' font-size=\'48\' font-family=\'Arial\'%3E${profile.name}%3C/text%3E%3C/svg%3E'">
        <div class="card-info">
            <div class="card-name">
                ${profile.name}, ${profile.age} tuổi
                ${verifiedBadge}
            </div>
            ${description ? `<div class="card-description">${description}</div>` : ''}
            <div class="card-details">
                <span><i class="bi bi-geo-alt"></i> ${profile.distance} km</span>
            </div>
            <div>
                ${interestsHTML}
            </div>
        </div>
    `;
    
    return card;
}

// Setup Event Listeners
function setupEventListeners() {
    const passBtn = document.getElementById('passBtn');
    const likeBtn = document.getElementById('likeBtn');
    const matchBtn = document.getElementById('matchBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    
    passBtn.addEventListener('click', () => handleSwipe('left'));
    likeBtn.addEventListener('click', () => handleSwipe('right'));
    matchBtn.addEventListener('click', closeMatchModal);
    reloadBtn.addEventListener('click', reloadProfiles);
}

// Handle Swipe Action
function handleSwipe(direction) {
    if (currentCards.length === 0) return;
    
    const topCard = document.querySelector('.profile-card');
    if (!topCard) return;
    
    const profileId = parseInt(topCard.dataset.profileId);
    const profile = currentCards.find(p => p.id === profileId);
    
    // Add swipe animation class
    topCard.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right');
    
    // Remove card after animation
    setTimeout(() => {
        topCard.remove();
        currentCards = currentCards.filter(p => p.id !== profileId);
        
        if (direction === 'right') {
            likeCount++;
            // Check for match (2nd profile liked)
            if (likeCount === 2 && profile) {
                showMatchModal(profile.name);
            }
        }
        
        // Re-render remaining cards
        renderCards();
    }, 300);
}

// Show Match Modal
function showMatchModal(name) {
    const modal = document.getElementById('matchModal');
    const matchedName = document.getElementById('matchedName');
    matchedName.textContent = name;
    modal.classList.add('show');
}

// Close Match Modal
function closeMatchModal() {
    const modal = document.getElementById('matchModal');
    modal.classList.remove('show');
}

// Show Empty State
function showEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const actionButtons = document.getElementById('actionButtons');
    emptyState.classList.add('show');
    actionButtons.style.display = 'none';
}

// Reload Profiles
function reloadProfiles() {
    currentCards = [...profiles];
    currentIndex = 0;
    likeCount = 0;
    const emptyState = document.getElementById('emptyState');
    const actionButtons = document.getElementById('actionButtons');
    emptyState.classList.remove('show');
    actionButtons.style.display = 'flex';
    renderCards();
}

// Close modal when clicking outside
document.getElementById('matchModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeMatchModal();
    }
});

// Show loading screen on page load, then initialize
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Show loading for 1.5 seconds
    setTimeout(() => {
        loadingScreen.classList.remove('show');
        document.body.style.overflow = 'auto';
        // Initialize after loading
        init();
    }, 1500);
});

// If no search filters, redirect to form
if (!localStorage.getItem('searchFilters')) {
    window.location.href = 'search-form.html';
}
