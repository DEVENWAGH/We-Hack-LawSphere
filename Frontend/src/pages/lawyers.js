import { lawyerService } from "../services/api.js";
import { navigateTo } from "../components/navigation.js";

export function renderLawyersPage() {
  const mainContent = document.getElementById("main-content");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  mainContent.innerHTML = `
    <section class="lawyers-page">
      <h1 class="page-title">Find a Lawyer</h1>
      <p class="page-description">Connect with pro bono lawyers or affordable legal services in your area.</p>
      
      <div class="search-container card">
        <form id="lawyer-search-form">
          <div class="search-inputs">
            <div class="form-group">
              <label for="practice-area">Practice Area</label>
              <select id="practice-area">
                <option value="">All Areas</option>
                <option value="Family Law">Family Law</option>
                <option value="Criminal Defense">Criminal Defense</option>
                <option value="Immigration">Immigration</option>
                <option value="Housing & Tenants Rights">Housing & Tenants Rights</option>
                <option value="Employment Law">Employment Law</option>
                <option value="Civil Rights">Civil Rights</option>
                <option value="Consumer Protection">Consumer Protection</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="location">Location</label>
              <input type="text" id="location" placeholder="City, State or ZIP">
            </div>
            
            <div class="form-group">
              <label for="service-type">Service Type</label>
              <select id="service-type">
                <option value="">All Types</option>
                <option value="Pro Bono">Pro Bono</option>
                <option value="Low Cost">Low Cost</option>
                <option value="Sliding Scale">Sliding Scale</option>
                <option value="Standard Rates">Standard Rates</option>
              </select>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
      </div>
      
      <div id="search-results" class="search-results">
        <div class="loading-spinner">Loading lawyers...</div>
      </div>
    </section>
  `;

  // Load lawyers from API
  loadLawyers();

  // Add search functionality
  document
    .getElementById("lawyer-search-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      // Get filter values
      const practiceArea = document.getElementById("practice-area").value;
      const location = document.getElementById("location").value;
      const serviceType = document.getElementById("service-type").value;

      // Apply filters
      loadLawyers({ practiceArea, location, serviceType });
    });
}

// Function to load lawyers from API
async function loadLawyers(filters = {}) {
  const resultsContainer = document.getElementById("search-results");

  try {
    // Show loading indicator
    resultsContainer.innerHTML =
      '<div class="loading-spinner">Loading lawyers...</div>';

    // Get lawyers from API
    const response = await lawyerService.getLawyers(filters);
    const lawyers = response.data.data;

    if (!lawyers || lawyers.length === 0) {
      resultsContainer.innerHTML =
        '<div class="no-results">No lawyers found matching your criteria.</div>';
      return;
    }

    // Build HTML for each lawyer
    const lawyersHTML = lawyers
      .map(
        (lawyer) => `
      <div class="lawyer-card card" data-id="${lawyer.id}">
        <div class="lawyer-info">
          <img src="${lawyer.profileImage || "/lawyer.png"}" alt="${
          lawyer.name
        }" class="lawyer-photo" onerror="this.src='/lawyer.png'">
          <div class="lawyer-details">
            <h3>${lawyer.name}</h3>
            <p class="lawyer-specialties"><strong>Practice Areas:</strong> ${lawyer.practiceAreas.join(
              ", "
            )}</p>
            <p><strong>Location:</strong> ${lawyer.location}</p>
            <p><strong>Services:</strong> ${lawyer.serviceTypes.join(", ")}</p>
            <p><strong>Languages:</strong> ${lawyer.languages.join(", ")}</p>
            <div class="lawyer-rating">
              <span class="stars">
                ${generateStars(lawyer.rating)}
              </span>
              <span>${lawyer.rating}/5 (${lawyer.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        <div class="lawyer-actions">
          <button class="btn btn-outline view-profile-btn">View Profile</button>
          <button class="btn btn-primary schedule-btn">Schedule Consultation</button>
        </div>
      </div>
    `
      )
      .join("");

    resultsContainer.innerHTML = lawyersHTML;

    // Add event listeners for lawyer actions
    document.querySelectorAll(".view-profile-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const lawyerId = this.closest(".lawyer-card").dataset.id;

        // Navigate to lawyer profile page with the lawyer ID
        navigateTo("lawyer-profile", { id: lawyerId });
      });
    });

    document.querySelectorAll(".schedule-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const lawyerId = this.closest(".lawyer-card").dataset.id;
        const lawyerName =
          this.closest(".lawyer-card").querySelector("h3").textContent;
        showSchedulingModal(lawyerName, lawyerId);
      });
    });
  } catch (error) {
    console.error("Error loading lawyers:", error);
    resultsContainer.innerHTML =
      '<div class="error-message">Failed to load lawyers. Please try again later.</div>';
  }
}

// Helper function to generate star rating HTML
function generateStars(rating) {
  let starsHTML = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  // Add half star if needed
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half"></i>';
  }

  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

function showSchedulingModal(lawyerName, lawyerId) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Schedule a Consultation with ${lawyerName}</h2>
      <form id="scheduling-form">
        <div class="form-group">
          <label for="consultation-date">Date</label>
          <input type="date" id="consultation-date" required min="${
            new Date().toISOString().split("T")[0]
          }">
        </div>
        <div class="form-group">
          <label for="consultation-time">Time</label>
          <select id="consultation-time" required>
            <option value="">Select a time</option>
            <option value="9:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </select>
        </div>
        <div class="form-group">
          <label for="consultation-type">Consultation Type</label>
          <select id="consultation-type" required>
            <option value="video">Video Call</option>
            <option value="phone">Phone Call</option>
            <option value="in-person">In Person</option>
          </select>
        </div>
        <div class="form-group">
          <label for="consultation-notes">Brief description of your legal issue</label>
          <textarea id="consultation-notes" rows="4"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Request Consultation</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal when clicking on x
  modal.querySelector(".close").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // Handle form submit
  document.getElementById("scheduling-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert(
      `Consultation request sent to ${lawyerName}. They will contact you to confirm.`
    );
    document.body.removeChild(modal);
  });
}
