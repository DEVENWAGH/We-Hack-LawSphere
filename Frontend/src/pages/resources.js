import { resourceService } from "../services/api.js";

export function renderResourcesPage() {
  const mainContent = document.getElementById("main-content");

  // Show loading state
  mainContent.innerHTML = `
    <section class="resources-page">
      <h1 class="page-title">Legal Resources</h1>
      <p class="page-description">Access free legal guides, templates, and educational materials.</p>
      
      <div class="resources-filter card">
        <div class="filter-section">
          <span class="filter-label">Category:</span>
          <div class="filter-options" id="category-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <!-- Categories will be loaded dynamically -->
          </div>
        </div>
        
        <div class="filter-section">
          <span class="filter-label">Type:</span>
          <div class="filter-options">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="Guide">Guides</button>
            <button class="filter-btn" data-filter="Template">Templates</button>
            <button class="filter-btn" data-filter="Video">Videos</button>
            <button class="filter-btn" data-filter="Article">Articles</button>
          </div>
        </div>
        
        <div class="search-container">
          <input type="text" id="resource-search" placeholder="Search resources...">
          <button class="btn btn-outline" id="search-btn"><i class="fas fa-search"></i></button>
        </div>
      </div>
      
      <div class="resources-container" id="resources-container">
        <div class="loading-spinner">Loading resources...</div>
      </div>
    </section>
  `;

  // Load resources
  loadResources();

  // Load categories
  loadCategories();

  // Set up search functionality
  document.getElementById("search-btn").addEventListener("click", () => {
    const searchTerm = document.getElementById("resource-search").value.trim();
    if (searchTerm) {
      filterResources({ search: searchTerm });
    }
  });

  // Enter key in search box
  document
    .getElementById("resource-search")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        document.getElementById("search-btn").click();
      }
    });
}

async function loadResources(filters = {}) {
  const resourcesContainer = document.getElementById("resources-container");

  try {
    // Get resources from API
    const response = await resourceService.getResources(filters);
    const resources = response.data.data;

    if (resources.length === 0) {
      resourcesContainer.innerHTML = `<p class="no-results">No resources found matching your criteria.</p>`;
      return;
    }

    // Render resources
    resourcesContainer.innerHTML = `
      <div class="resources-grid">
        ${resources.map((resource) => renderResourceCard(resource)).join("")}
      </div>
    `;

    // Add event listeners for action buttons
    document.querySelectorAll(".resource-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const resourceId = btn.dataset.id;
        viewResource(resourceId);
      });
    });

    document.querySelectorAll(".resource-download-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const resourceId = btn.dataset.id;
        downloadResource(resourceId);

        // Increment download count
        resourceService.incrementDownload(resourceId).catch((error) => {
          console.error("Error incrementing download count:", error);
        });
      });
    });
  } catch (error) {
    console.error("Error loading resources:", error);
    resourcesContainer.innerHTML = `<p class="error-message">Failed to load resources. Please try again later.</p>`;
  }
}

async function loadCategories() {
  try {
    // Get categories from API
    const response = await resourceService.getResourceCategories();
    const categories = response.data.data;

    const categoryFilters = document.getElementById("category-filters");

    // Add category filter buttons
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "filter-btn";
      button.setAttribute("data-filter", category);
      button.textContent = category;

      button.addEventListener("click", () => {
        // Remove active class from all category buttons
        document
          .querySelectorAll("#category-filters .filter-btn")
          .forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        button.classList.add("active");

        // Filter resources by category
        filterResources({ category });
      });

      categoryFilters.appendChild(button);
    });

    // Add event listener to "All" button
    const allButton = document.querySelector(
      "#category-filters .filter-btn[data-filter='all']"
    );
    allButton.addEventListener("click", () => {
      // Remove active class from all category buttons
      document
        .querySelectorAll("#category-filters .filter-btn")
        .forEach((btn) => btn.classList.remove("active"));

      // Add active class to "All" button
      allButton.classList.add("active");

      // Load all resources
      loadResources();
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

function filterResources(filters) {
  loadResources(filters);
}

function renderResourceCard(resource) {
  const hasFile = resource.file ? true : false;

  return `
    <div class="resource-card">
      <div class="resource-type ${resource.type.toLowerCase()}">${
    resource.type
  }</div>
      <h3 class="resource-title">${resource.title}</h3>
      <p class="resource-category">${resource.category}</p>
      <p class="resource-description">${resource.description}</p>
      <div class="resource-meta">
        <span><i class="fas fa-eye"></i> ${resource.views}</span>
        ${
          resource.downloads
            ? `<span><i class="fas fa-download"></i> ${resource.downloads}</span>`
            : ""
        }
        ${
          resource.duration
            ? `<span><i class="fas fa-clock"></i> ${resource.duration}</span>`
            : ""
        }
      </div>
      <div class="resource-actions">
        ${
          hasFile
            ? `
          <button class="btn btn-primary resource-view-btn" data-id="${resource.id}">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn btn-outline resource-download-btn" data-id="${resource.id}">
            <i class="fas fa-download"></i> Download
          </button>
        `
            : `
          <button class="btn btn-primary" disabled>Coming Soon</button>
        `
        }
      </div>
    </div>
  `;
}

function viewResource(resourceId) {
  // Open the resource in a new tab for viewing
  window.open(
    `${resourceService.getApiUrl()}/resources/${resourceId}/file`,
    "_blank"
  );
}

function downloadResource(resourceId) {
  // Trigger file download
  window.open(
    `${resourceService.getApiUrl()}/resources/${resourceId}/file?download=true`,
    "_blank"
  );
}
