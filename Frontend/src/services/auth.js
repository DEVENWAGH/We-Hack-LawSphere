import { userService } from "./api.js";
import { translate } from "../utils/translations.js";

export function setupAuth() {
  const loginButton = document.getElementById("login-btn");
  const signupButton = document.getElementById("signup-btn");
  const authContainer = document.getElementById("auth-container");

  // Check if user is already logged in
  const user = localStorage.getItem("user");
  if (user) {
    showLoggedInState(JSON.parse(user));
  }

  loginButton.addEventListener("click", () => {
    showLoginModal();
  });

  signupButton.addEventListener("click", () => {
    showSignupModal();
  });

  function showLoggedInState(user) {
    authContainer.innerHTML = `
      <div class="user-profile">
        <div class="profile-image-circle" id="profile-icon">
          <img src="${user.profileImage || "/lawyer.png"}" alt="${
      user.name
    }" onerror="this.src='/lawyer.png'" crossorigin="anonymous">
        </div>
        <span><span data-i18n="welcome">${translate("welcome")}</span>, ${
      user.name
    }</span>
        <button id="logout-btn" class="btn btn-outline" data-i18n="logout">${translate(
          "logout"
        )}</button>
      </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });

    // Add click event to profile icon with image preload to ensure proper rendering
    const profileIcon = document.getElementById("profile-icon");
    const profileImage = profileIcon.querySelector("img");

    // Ensure image loads correctly
    profileImage.onload = function () {
      console.log("Header profile image loaded successfully");
    };

    profileImage.onerror = function () {
      console.warn("Failed to load header profile image, using fallback");
      this.src = "/lawyer.png";
    };

    profileIcon.addEventListener("click", () => {
      import("../components/navigation.js").then((module) => {
        module.navigateTo("user-profile");
      });
    });
  }

  function showLoginModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Login to Your Account</h2>
        
        <div class="login-type-selector">
          <button type="button" class="login-type-btn active" data-type="user">Login as User</button>
          <button type="button" class="login-type-btn" data-type="lawyer">Login as Lawyer</button>
        </div>
        
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <p class="error-message" id="login-error" style="color: red; display: none;"></p>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup login type selector
    const loginTypeBtns = modal.querySelectorAll(".login-type-btn");
    let selectedType = "user";

    loginTypeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        loginTypeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedType = btn.dataset.type;
      });
    });

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
    document
      .getElementById("login-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorElement = document.getElementById("login-error");

        try {
          errorElement.style.display = "none";
          const response = await userService.login(email, password);

          // Check if the user type matches the selected type
          const userRole = response.data.user.role;
          if (
            (selectedType === "lawyer" && userRole !== "lawyer") ||
            (selectedType === "user" && userRole === "lawyer")
          ) {
            errorElement.textContent = `This account is not registered as a ${selectedType}. Please select the correct login type.`;
            errorElement.style.display = "block";
            return;
          }

          // Store the token and user data
          localStorage.setItem(
            "user",
            JSON.stringify({
              token: response.data.token,
              name: response.data.user.name,
              email: response.data.user.email,
              id: response.data.user.id,
              role: response.data.user.role,
              profileImage: response.data.user.profileImage,
            })
          );

          document.body.removeChild(modal);
          showLoggedInState({
            name: response.data.user.name,
            profileImage: response.data.user.profileImage,
          });
        } catch (error) {
          console.error("Login error:", error);
          errorElement.textContent =
            error.response?.data?.message || "Login failed. Please try again.";
          errorElement.style.display = "block";
        }
      });
  }

  function showSignupModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Create an Account</h2>
        
        <div class="signup-type-selector">
          <button type="button" class="signup-type-btn active" data-type="user">Register as User</button>
          <button type="button" class="signup-type-btn" data-type="lawyer">Register as Lawyer</button>
        </div>
        
        <form id="signup-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required minlength="6">
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" required>
          </div>
          <p class="error-message" id="signup-error" style="color: red; display: none;"></p>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup signup type selector
    const signupTypeBtns = modal.querySelectorAll(".signup-type-btn");
    let selectedType = "user";

    signupTypeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        signupTypeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedType = btn.dataset.type;
      });
    });

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
    document
      .getElementById("signup-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
          document.getElementById("confirm-password").value;
        const errorElement = document.getElementById("signup-error");

        // Validate passwords match
        if (password !== confirmPassword) {
          errorElement.textContent = "Passwords do not match";
          errorElement.style.display = "block";
          return;
        }

        try {
          errorElement.style.display = "none";
          const userData = { name, email, password };
          const response = await userService.register(userData);

          // Store the token and user data
          localStorage.setItem(
            "user",
            JSON.stringify({
              token: response.data.token,
              name: response.data.user.name,
              email: response.data.user.email,
              id: response.data.user.id,
              role: response.data.user.role,
            })
          );

          document.body.removeChild(modal);

          // If user selected to register as lawyer, redirect to lawyer registration page
          if (selectedType === "lawyer") {
            document.querySelector('a[data-page="lawyer-register"]').click();
          } else {
            showLoggedInState({ name: response.data.user.name });
          }
        } catch (error) {
          console.error("Registration error:", error);
          errorElement.textContent =
            error.response?.data?.message ||
            "Registration failed. Please try again.";
          errorElement.style.display = "block";
        }
      });
  }
}

// Improved version of refreshUserAuth function
export function refreshUserAuth() {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;

  try {
    // Parse the stored user data
    const userData = JSON.parse(userJson);

    // Check if token exists
    if (!userData.token) {
      console.error("No token found in stored user data");
      localStorage.removeItem("user");
      return null;
    }

    // Get the token parts
    const tokenParts = userData.token.split(".");
    if (tokenParts.length !== 3) {
      console.error("Invalid token format");
      localStorage.removeItem("user");
      return null;
    }

    // Parse the payload to check expiration
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds

      if (Date.now() >= expirationTime) {
        console.log("Token has expired, clearing user data");
        localStorage.removeItem("user");
        return null;
      }

      return userData;
    } catch (e) {
      console.error("Error parsing token:", e);
      localStorage.removeItem("user");
      return null;
    }
  } catch (e) {
    console.error("Error parsing user JSON:", e);
    localStorage.removeItem("user");
    return null;
  }
}

// Check token validity on application start and clean up invalid tokens
document.addEventListener("DOMContentLoaded", () => {
  console.log("Checking token validity on application startup");
  const userData = refreshUserAuth();

  // If we have a user but getting token issues, clear it
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("auth") === "error") {
    console.log("Auth error parameter detected, clearing token");
    localStorage.removeItem("user");
    alert("Your session has expired. Please log in again.");
    // After a brief delay, redirect to home page without the query parameter
    setTimeout(() => {
      window.location.href = window.location.pathname;
    }, 1000);
  }
});
