export function renderResourcesPage() {
  const mainContent = document.getElementById("main-content");

  mainContent.innerHTML = `
    <section class="resources-page">
      <h1 class="page-title">Resource Library</h1>
      <p class="page-description">Access guides, documents, and educational materials on various legal topics.</p>
      
      <div class="resource-categories">
        <button class="resource-category-btn active" data-category="all">All Resources</button>
        <button class="resource-category-btn" data-category="housing">Housing & Tenants</button>
        <button class="resource-category-btn" data-category="family">Family Law</button>
        <button class="resource-category-btn" data-category="employment">Employment</button>
        <button class="resource-category-btn" data-category="immigration">Immigration</button>
      </div>
      
      <div class="resources-grid">
        <!-- Housing & Tenants Resources -->
        <div class="resource-card" data-category="housing">
          <div class="resource-icon"><i class="fas fa-home"></i></div>
          <div class="resource-content">
            <h3>Know Your Rights: Tenant Basics</h3>
            <p>Learn about tenant rights, rental agreements, eviction processes, and how to address common housing issues.</p>
            <div class="resource-actions">
              <a href="/Tenants-Rights.pdf" target="_blank" class="btn btn-sm btn-outline">
                <i class="fas fa-eye"></i> View PDF
              </a>
              <a href="/Tenants-Rights.pdf" download="Tenants-Rights.pdf" class="btn btn-sm btn-primary">
                <i class="fas fa-download"></i> Download
              </a>
            </div>
          </div>
        </div>
        
        <div class="resource-card" data-category="housing">
          <div class="resource-icon"><i class="fas fa-building"></i></div>
          <div class="resource-content">
            <h3>Eviction Process Guide</h3>
            <p>Step-by-step explanation of the eviction process, your rights as a tenant, and how to respond to eviction notices.</p>
            <button class="btn btn-sm btn-primary">Access Guide</button>
          </div>
        </div>
        
        <!-- Family Law Resources -->
        <div class="resource-card" data-category="family">
          <div class="resource-icon"><i class="fas fa-users"></i></div>
          <div class="resource-content">
            <h3>Child Support Calculator</h3>
            <p>Interactive tool to help estimate child support payments based on your jurisdiction's guidelines.</p>
            <button class="btn btn-sm btn-primary">Use Calculator</button>
          </div>
        </div>
        
        <div class="resource-card" data-category="family">
          <div class="resource-icon"><i class="fas fa-balance-scale"></i></div>
          <div class="resource-content">
            <h3>Divorce Process Explained</h3>
            <p>Comprehensive guide to divorce proceedings, division of assets, child custody, and support arrangements.</p>
            <button class="btn btn-sm btn-primary">Read Guide</button>
          </div>
        </div>
        
        <!-- Employment Resources -->
        <div class="resource-card" data-category="employment">
          <div class="resource-icon"><i class="fas fa-briefcase"></i></div>
          <div class="resource-content">
            <h3>Workplace Discrimination</h3>
            <p>Learn about different types of workplace discrimination and the steps to take if you're experiencing it.</p>
            <button class="btn btn-sm btn-primary">Access Guide</button>
          </div>
        </div>
        
        <div class="resource-card" data-category="employment">
          <div class="resource-icon"><i class="fas fa-file-signature"></i></div>
          <div class="resource-content">
            <h3>Employment Contract Review Guide</h3>
            <p>What to look for before signing employment contracts and how to negotiate terms.</p>
            <button class="btn btn-sm btn-primary">View Guide</button>
          </div>
        </div>
        
        <!-- Immigration Resources -->
        <div class="resource-card" data-category="immigration">
          <div class="resource-icon"><i class="fas fa-passport"></i></div>
          <div class="resource-content">
            <h3>Immigration Documentation Checklist</h3>
            <p>Complete checklist of required documents for various immigration processes and applications.</p>
            <button class="btn btn-sm btn-primary">Download Checklist</button>
          </div>
        </div>
        
        <div class="resource-card" data-category="immigration">
          <div class="resource-icon"><i class="fas fa-landmark"></i></div>
          <div class="resource-content">
            <h3>Know Your Rights: Immigration Enforcement</h3>
            <p>Information about your rights during interactions with immigration enforcement agencies.</p>
            <button class="btn btn-sm btn-primary">Read More</button>
          </div>
        </div>
      </div>
    </section>
  `;

  // Add event listeners for category filtering
  document.querySelectorAll(".resource-category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      document
        .querySelectorAll(".resource-category-btn")
        .forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      btn.classList.add("active");

      // Get selected category
      const category = btn.dataset.category;

      // Filter resources
      document.querySelectorAll(".resource-card").forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Add CSS for the resource actions
  const style = document.createElement("style");
  style.textContent = `
    .resource-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    .resource-actions .btn {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  `;
  document.head.appendChild(style);

  // Check if PDF file exists and show error if it doesn't
  fetch("/Tenants-Rights.pdf")
    .then((response) => {
      if (!response.ok) {
        const tenantCard = document.querySelector(
          '.resource-card[data-category="housing"]'
        );
        const actionButtons = tenantCard.querySelector(".resource-actions");
        actionButtons.innerHTML = `
          <p class="error-message"><i class="fas fa-exclamation-circle"></i> PDF file not found</p>
        `;
      }
    })
    .catch((error) => {
      console.error("Error checking PDF file:", error);
    });
}
