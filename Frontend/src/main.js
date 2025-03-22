import "./style.css";
import { renderHomePage } from "./pages/home.js";
import { setupNavigation, navigateTo } from "./components/navigation.js";
import { setupAuth } from "./services/auth.js";

// Initialize the application
function initApp() {
  const app = document.querySelector("#app");

  // Create the app structure - now using the footer from home.js
  app.innerHTML = `
    <header class="header">
      <div class="container">
        <div class="logo" id="logo-home-link">
          <h1><i class="fas fa-balance-scale"></i> LawSphere</h1>
        </div>
        <nav id="main-nav">
          <ul>
            <li><a href="#" data-page="home" class="active">Home</a></li>
            <li><a href="#" data-page="lawyers">Find Lawyers</a></li>
            <li><a href="#" data-page="resources">Resources</a></li>
            <li><a href="#" data-page="community">Community</a></li>
            <li><a href="#" data-page="ai-assistant">AI Assistant</a></li>
          </ul>
        </nav>
        <div class="auth-buttons" id="auth-container">
          <button id="login-btn" class="btn btn-outline">Login</button>
          <button id="signup-btn" class="btn btn-primary">Sign Up</button>
        </div>
      </div>
    </header>

    <main id="main-content" class="container">
      <!-- Page content will be loaded here -->
    </main>

    <!-- Footer will be dynamically added from home.js -->
    <div id="footer-container"></div>
  `;

  // Setup navigation and authentication
  setupNavigation();
  setupAuth();

  // Setup logo click to navigate to home
  document.getElementById("logo-home-link").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("home");
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Import the renderFooter function and render it
  import("./pages/home.js").then((module) => {
    const footerContainer = document.getElementById("footer-container");
    footerContainer.innerHTML = module.renderFooter();

    // Set up social link event listeners
    setupSocialLinks();
  });

  // Render the home page by default
  renderHomePage();
}

// Function to set up the social links
function setupSocialLinks() {
  // Add event listeners to social media links to prevent default navigation behavior
  document.querySelectorAll(".social-links .social-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      // Stop the event from being handled by the app's navigation system
      e.stopPropagation();

      // Open the link in a new tab
      window.open(this.href, "_blank");
    });
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initApp();

  // Add a global click handler for external links
  document.addEventListener("click", (e) => {
    // Check if this is an external link (has target="_blank")
    const externalLink = e.target.closest('a[target="_blank"]');
    if (externalLink) {
      e.preventDefault();
      e.stopPropagation();
      window.open(externalLink.href, "_blank");
      return;
    }

    // Rest of your click handling code
    // ...
  });
});
