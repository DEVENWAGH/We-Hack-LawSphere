import { renderHomePage } from "../pages/home.js";
import { renderLawyersPage } from "../pages/lawyers.js";
import { renderResourcesPage } from "../pages/resources.js";
import { renderCommunityPage } from "../pages/community.js";
import { renderAIAssistantPage } from "../pages/ai-assistant.js";

export function setupNavigation() {
  const navLinks = document.querySelectorAll("#main-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      link.classList.add("active");

      // Get the page to render
      const page = link.getAttribute("data-page");

      // Render the appropriate page
      switch (page) {
        case "home":
          renderHomePage();
          break;
        case "lawyers":
          renderLawyersPage();
          break;
        case "resources":
          renderResourcesPage();
          break;
        case "community":
          renderCommunityPage();
          break;
        case "ai-assistant":
          renderAIAssistantPage();
          break;
        default:
          renderHomePage();
      }
    });
  });
}
