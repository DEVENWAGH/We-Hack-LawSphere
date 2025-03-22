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
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();

      // For demo purposes, just simulate login
      const user = {
        name: "Demo User",
        email: document.getElementById("email").value,
      };

      localStorage.setItem("user", JSON.stringify(user));
      document.body.removeChild(modal);
      showLoggedInState(user);
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
            <input type="password" id="password" required>
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" required>
          </div>
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
    document.getElementById("signup-form").addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate passwords match
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // For demo purposes, just simulate signup
      const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
      };

      localStorage.setItem("user", JSON.stringify(user));
      document.body.removeChild(modal);
      showLoggedInState(user);
    });
  }
}
