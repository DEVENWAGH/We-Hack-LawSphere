import { userService } from "./api.js";

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
        <span>Welcome, ${user.name}</span>
        <button id="logout-btn" class="btn btn-outline">Logout</button>
      </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });
  }

  function showLoginModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Login to Your Account</h2>
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
          showLoggedInState({ name: response.data.user.name });
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
          showLoggedInState({ name: response.data.user.name });
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
