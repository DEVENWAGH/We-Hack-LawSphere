import "./style.css";
import { renderHomePage } from "./pages/home.js";
import { setupNavigation } from "./components/navigation.js";
import { setupAuth } from "./services/auth.js";

// Initialize the application
function initApp() {
  const app = document.querySelector("#app");

  // Create the app structure
  app.innerHTML = `
    <header class="header">
      <div class="container">
        <div class="logo">
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

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section about">
            <h2><i class="fas fa-balance-scale"></i> LawSphere</h2>
            <p>Connecting citizens with affordable legal services and promoting legal awareness.</p>
            <div class="social-links">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
          <div class="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div class="footer-section contact">
            <h2>Contact Info</h2>
            <p><i class="fas fa-map-marker-alt"></i> 123 Legal Street, Justice City</p>
            <p><i class="fas fa-phone"></i> +1 234 567 8900</p>
            <p><i class="fas fa-envelope"></i> info@lawsphere.org</p>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; 2023 LawSphere | All Rights Reserved
        </div>
      </div>
    </footer>
  `;

  // Setup navigation and authentication
  setupNavigation();
  setupAuth();

  // Render the home page by default
  renderHomePage();
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);
