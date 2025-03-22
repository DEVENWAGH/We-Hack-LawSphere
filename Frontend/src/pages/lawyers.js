export function renderLawyersPage() {
  const mainContent = document.getElementById("main-content");

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
                <option value="family">Family Law</option>
                <option value="criminal">Criminal Defense</option>
                <option value="immigration">Immigration</option>
                <option value="housing">Housing & Tenants Rights</option>
                <option value="employment">Employment Law</option>
                <option value="civil">Civil Rights</option>
                <option value="consumer">Consumer Protection</option>
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
                <option value="pro-bono">Pro Bono</option>
                <option value="low-cost">Low Cost</option>
                <option value="sliding-scale">Sliding Scale</option>
                <option value="standard">Standard Rates</option>
              </select>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
      </div>
      
      <div id="search-results" class="search-results">
        <div class="lawyer-card card">
          <div class="lawyer-info">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Jane Smith" class="lawyer-photo">
            <div class="lawyer-details">
              <h3>Jane Smith, Esq.</h3>
              <p class="lawyer-specialties"><strong>Practice Areas:</strong> Family Law, Immigration</p>
              <p><strong>Location:</strong> New York, NY</p>
              <p><strong>Services:</strong> Pro Bono, Sliding Scale</p>
              <p><strong>Languages:</strong> English, Spanish</p>
              <div class="lawyer-rating">
                <span class="stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star-half"></i>
                </span>
                <span>4.5/5 (28 reviews)</span>
              </div>
            </div>
          </div>
          <div class="lawyer-actions">
            <button class="btn btn-outline view-profile-btn">View Profile</button>
            <button class="btn btn-primary schedule-btn">Schedule Consultation</button>
          </div>
        </div>
        
        <div class="lawyer-card card">
          <div class="lawyer-info">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael Johnson" class="lawyer-photo">
            <div class="lawyer-details">
              <h3>Michael Johnson, Esq.</h3>
              <p class="lawyer-specialties"><strong>Practice Areas:</strong> Housing Law, Consumer Protection</p>
              <p><strong>Location:</strong> New York, NY</p>
              <p><strong>Services:</strong> Low Cost</p>
              <p><strong>Languages:</strong> English</p>
              <div class="lawyer-rating">
                <span class="stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="far fa-star"></i>
                </span>
                <span>4.0/5 (42 reviews)</span>
              </div>
            </div>
          </div>
          <div class="lawyer-actions">
            <button class="btn btn-outline view-profile-btn">View Profile</button>
            <button class="btn btn-primary schedule-btn">Schedule Consultation</button>
          </div>
        </div>
        
        <div class="lawyer-card card">
          <div class="lawyer-info">
            <img src="https://randomuser.me/api/portraits/women/33.jpg" alt="Sophia Rodriguez" class="lawyer-photo">
            <div class="lawyer-details">
              <h3>Sophia Rodriguez, Esq.</h3>
              <p class="lawyer-specialties"><strong>Practice Areas:</strong> Immigration, Civil Rights</p>
              <p><strong>Location:</strong> New York, NY</p>
              <p><strong>Services:</strong> Pro Bono, Sliding Scale</p>
              <p><strong>Languages:</strong> English, Spanish, Portuguese</p>
              <div class="lawyer-rating">
                <span class="stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </span>
                <span>5.0/5 (17 reviews)</span>
              </div>
            </div>
          </div>
          <div class="lawyer-actions">
            <button class="btn btn-outline view-profile-btn">View Profile</button>
            <button class="btn btn-primary schedule-btn">Schedule Consultation</button>
          </div>
        </div>
      </div>
    </section>
  `;

  // Add search functionality
  document
    .getElementById("lawyer-search-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      // In a real app, this would make an API call to search for lawyers
      alert("Search functionality would filter lawyers based on criteria");
    });

  // Add event listeners for lawyer actions
  document.querySelectorAll(".view-profile-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const lawyerName =
        this.closest(".lawyer-card").querySelector("h3").textContent;
      alert(`Viewing profile for ${lawyerName}`);
    });
  });

  document.querySelectorAll(".schedule-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const lawyerName =
        this.closest(".lawyer-card").querySelector("h3").textContent;
      showSchedulingModal(lawyerName);
    });
  });
}

function showSchedulingModal(lawyerName) {
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
