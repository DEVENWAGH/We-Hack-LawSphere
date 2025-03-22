export function renderResourcesPage() {
  const mainContent = document.getElementById("main-content");

  mainContent.innerHTML = `
    <section class="resources-page">
      <h1 class="page-title">Legal Resources</h1>
      <p class="page-description">Access guides, documents, and educational materials on various legal topics.</p>
      
      <div class="search-container card">
        <form id="resource-search-form">
          <div class="search-inputs">
            <input type="text" id="resource-search" placeholder="Search resources...">
            <select id="resource-category">
              <option value="">All Categories</option>
              <option value="guides">Legal Guides</option>
              <option value="templates">Document Templates</option>
              <option value="videos">Video Tutorials</option>
              <option value="articles">Articles</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
      </div>
      
      <div class="featured-resources">
        <h2>Featured Resources</h2>
        <div class="resources-grid">
          <div class="resource-card card">
            <div class="resource-icon"><i class="fas fa-file-alt"></i></div>
            <div class="resource-content">
              <div class="resource-badge guide">Guide</div>
              <h3>Know Your Rights: Tenant Basics</h3>
              <p>Essential information for renters about lease agreements, maintenance responsibilities, eviction procedures, and security deposits.</p>
              <div class="resource-meta">
                <span><i class="fas fa-eye"></i> 12.5K views</span>
                <span><i class="fas fa-download"></i> 3.2K downloads</span>
              </div>
              <button class="btn btn-outline">View Resource</button>
            </div>
          </div>
          
          <div class="resource-card card">
            <div class="resource-icon"><i class="fas fa-file-contract"></i></div>
            <div class="resource-content">
              <div class="resource-badge template">Template</div>
              <h3>Simple Will Template</h3>
              <p>A basic will template with instructions on how to properly complete and execute it according to state requirements.</p>
              <div class="resource-meta">
                <span><i class="fas fa-eye"></i> 8.7K views</span>
                <span><i class="fas fa-download"></i> 5.1K downloads</span>
              </div>
              <button class="btn btn-outline">View Resource</button>
            </div>
          </div>
          
          <div class="resource-card card">
            <div class="resource-icon"><i class="fas fa-video"></i></div>
            <div class="resource-content">
              <div class="resource-badge video">Video</div>
              <h3>Small Claims Court: Step by Step</h3>
              <p>A comprehensive video tutorial walking you through the entire small claims court process from filing to collection.</p>
              <div class="resource-meta">
                <span><i class="fas fa-eye"></i> 15.3K views</span>
                <span><i class="fas fa-clock"></i> 24 min</span>
              </div>
              <button class="btn btn-outline">Watch Video</button>
            </div>
          </div>
          
          <div class="resource-card card">
            <div class="resource-icon"><i class="fas fa-file-signature"></i></div>
            <div class="resource-content">
              <div class="resource-badge template">Template</div>
              <h3>Power of Attorney Form</h3>
              <p>Customize this power of attorney template to authorize someone to make legal decisions on your behalf.</p>
              <div class="resource-meta">
                <span><i class="fas fa-eye"></i> 10.1K views</span>
                <span><i class="fas fa-download"></i> 4.8K downloads</span>
              </div>
              <button class="btn btn-outline">View Resource</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="popular-topics">
        <h2>Popular Legal Topics</h2>
        <div class="topics-grid">
          <div class="topic-card card">
            <i class="fas fa-home"></i>
            <h3>Housing & Tenant Rights</h3>
            <p>Resources about rental agreements, evictions, repairs, and tenant protections.</p>
            <button class="btn btn-sm btn-outline">Explore</button>
          </div>
          
          <div class="topic-card card">
            <i class="fas fa-user-friends"></i>
            <h3>Family Law</h3>
            <p>Information about divorce, child custody, adoption, and domestic relations.</p>
            <button class="btn btn-sm btn-outline">Explore</button>
          </div>
          
          <div class="topic-card card">
            <i class="fas fa-briefcase"></i>
            <h3>Employment Law</h3>
            <p>Workplace rights, discrimination, wage disputes, and wrongful termination.</p>
            <button class="btn btn-sm btn-outline">Explore</button>
          </div>
          
          <div class="topic-card card">
            <i class="fas fa-balance-scale"></i>
            <h3>Consumer Rights</h3>
            <p>Debt collection, consumer fraud, warranties, and product liability.</p>
            <button class="btn btn-sm btn-outline">Explore</button>
          </div>
          
          <div class="topic-card card">
            <i class="fas fa-passport"></i>
            <h3>Immigration</h3>
            <p>Visas, citizenship, asylum, deportation, and immigration procedures.</p>
            <button class="btn btn-sm btn-outline">Explore</button>
          </div>
          
          <div class="topic-card card">
            <i class="fas fa-car"></i>
            <h3>Traffic & Driving</h3>
            <p>Traffic violations, accidents, license suspension, and DUI/DWI issues.</p>
            <button class="btn btn-sm btn-outline">Explore</button>
          </div>
        </div>
      </div>
    </section>
  `;

  // Add search functionality
  document
    .getElementById("resource-search-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const searchTerm = document.getElementById("resource-search").value;
      const category = document.getElementById("resource-category").value;

      // In a real app, this would make an API call to search resources
      alert(`Searching for "${searchTerm}" in category "${category || "all"}"`);
    });

  // Add click handlers for resource buttons
  document.querySelectorAll(".resource-card button").forEach((button) => {
    button.addEventListener("click", function () {
      const resourceTitle =
        this.closest(".resource-card").querySelector("h3").textContent;
      alert(`Opening resource: ${resourceTitle}`);
    });
  });

  // Add click handlers for topic buttons
  document.querySelectorAll(".topic-card button").forEach((button) => {
    button.addEventListener("click", function () {
      const topicTitle =
        this.closest(".topic-card").querySelector("h3").textContent;
      alert(`Exploring topic: ${topicTitle}`);
    });
  });
}
