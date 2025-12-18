// Form Elements
const searchForm = document.getElementById('searchForm');
const distanceInput = document.getElementById('distance');
const distanceValue = document.getElementById('distanceValue');
const loadingScreen = document.getElementById('loadingScreen');
const customInterestInput = document.getElementById('customInterest');
const addInterestBtn = document.getElementById('addInterestBtn');
const interestsGrid = document.getElementById('interestsGrid');

// Load saved form data from localStorage
function loadSavedFormData() {
    const savedData = localStorage.getItem('searchFilters');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            
            // Load child age
            if (formData.childAge) {
                document.getElementById('childAge').value = formData.childAge;
            }
            
            // Load distance
            if (formData.distance) {
                distanceInput.value = formData.distance;
                distanceValue.textContent = formData.distance;
            }
            
            // Load interests
            if (formData.interests && formData.interests.length > 0) {
                formData.interests.forEach(interest => {
                    // Check if it's a predefined interest
                    const existingCheckbox = document.querySelector(`input[name="interests"][value="${interest}"]`);
                    if (existingCheckbox) {
                        existingCheckbox.checked = true;
                    } else {
                        // It's a custom interest, add it
                        const newLabel = document.createElement('label');
                        newLabel.className = 'interest-checkbox';
                        newLabel.innerHTML = `
                            <input type="checkbox" name="interests" value="${interest}" checked>
                            <span>${interest}</span>
                        `;
                        interestsGrid.appendChild(newLabel);
                    }
                });
            }
            
            // Load verified only
            if (formData.verifiedOnly) {
                document.getElementById('verifiedOnly').checked = true;
            }
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }
}

// Update distance value display
distanceInput.addEventListener('input', function() {
    distanceValue.textContent = this.value;
    // Auto-save to localStorage
    saveFormDataToLocalStorage();
});

// Auto-save form data to localStorage on change
function saveFormDataToLocalStorage() {
    const formData = {
        childAge: document.getElementById('childAge').value,
        distance: distanceInput.value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
        verifiedOnly: document.getElementById('verifiedOnly').checked
    };
    localStorage.setItem('searchFilters', JSON.stringify(formData));
}

// Listen to form changes for auto-save
document.getElementById('childAge').addEventListener('change', saveFormDataToLocalStorage);
document.getElementById('verifiedOnly').addEventListener('change', saveFormDataToLocalStorage);

// Listen to interest checkboxes
document.addEventListener('change', function(e) {
    if (e.target.name === 'interests') {
        saveFormDataToLocalStorage();
    }
});

// Load saved data on page load
loadSavedFormData();

// Add custom interest
addInterestBtn.addEventListener('click', addCustomInterest);
customInterestInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addCustomInterest();
    }
});

function addCustomInterest() {
    const interestText = customInterestInput.value.trim();
    if (interestText === '') {
        return;
    }
    
    // Check if already exists
    const existingCheckboxes = document.querySelectorAll('input[name="interests"]');
    for (let checkbox of existingCheckboxes) {
        if (checkbox.value.toLowerCase() === interestText.toLowerCase()) {
            customInterestInput.value = '';
            return;
        }
    }
    
    // Create new checkbox
    const newLabel = document.createElement('label');
    newLabel.className = 'interest-checkbox';
    newLabel.innerHTML = `
        <input type="checkbox" name="interests" value="${interestText}">
        <span>${interestText}</span>
    `;
    
    interestsGrid.appendChild(newLabel);
    customInterestInput.value = '';
    
    // Add click handler for the new checkbox
    newLabel.addEventListener('click', function() {
        updateCheckboxState(this);
    });
    
    // Save to localStorage after adding
    saveFormDataToLocalStorage();
}

// Update checkbox visual state
function updateCheckboxState(checkboxLabel) {
    const checkbox = checkboxLabel.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
        checkboxLabel.style.borderColor = '#0ea5e9';
        checkboxLabel.style.background = '#f0f9ff';
    } else {
        checkboxLabel.style.borderColor = '#e5e7eb';
        checkboxLabel.style.background = 'white';
    }
}

// Handle form submission
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        childAge: document.getElementById('childAge').value,
        distance: distanceInput.value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
        verifiedOnly: document.getElementById('verifiedOnly').checked
    };
    
    // Validate form
    if (!formData.childAge) {
        alert('Vui lòng chọn độ tuổi của con');
        return;
    }
    
    if (formData.interests.length === 0) {
        alert('Vui lòng chọn ít nhất một sở thích');
        return;
    }
    
    // Save form data to localStorage
    localStorage.setItem('searchFilters', JSON.stringify(formData));
    
    // Show loading screen
    showLoadingScreen();
    
    // Simulate API call delay (2-3 seconds)
    setTimeout(() => {
        // Redirect to search results page
        window.location.href = 'search-page.html';
    }, 2500);
});

// Show loading screen
function showLoadingScreen() {
    loadingScreen.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Hide loading screen (if needed)
function hideLoadingScreen() {
    loadingScreen.classList.remove('show');
    document.body.style.overflow = 'auto';
}
