import { lawyerService } from "../services/api.js";

export async function renderLawyerProfilePage(lawyerId) {
  const mainContent = document.getElementById("main-content");

  // Show loading state
  mainContent.innerHTML = `
    <section class="lawyer-profile-page">
      <div class="loading-spinner">Loading lawyer profile...</div>
    </section>
  `;

  try {
    // Fetch lawyer details
    const response = await lawyerService.getLawyerById(lawyerId);
    const lawyer = response.data.data;

    // Fetch lawyer reviews
    const reviewsResponse = await lawyerService.getLawyerReviews(lawyerId);
    const reviews = reviewsResponse.data.data || [];

    // Check if current user is the profile owner
    const currentUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    const isProfileOwner = currentUser && lawyer.userId === currentUser.id;

    mainContent.innerHTML = `
      <section class="lawyer-profile-page">
        <div class="profile-header">
          <div class="profile-image">
            <img src="/lawyer.png"  alt="${lawyer.name}">
            ${
              isProfileOwner
                ? `<button id="change-photo-btn" class="btn btn-sm btn-outline"><i class="fas fa-camera"></i> Change Photo</button>`
                : ""
            }
          </div>
          <div class="profile-info">
            <h1>${lawyer.name}</h1>
            <div class="rating-container">
              ${generateStars(lawyer.averageRating)}
              <span class="rating-text">${lawyer.averageRating.toFixed(1)}/5 (${
      reviews.length
    } reviews)</span>
            </div>
            <p class="practice-areas"><strong>Practice Areas:</strong> ${lawyer.practiceAreas.join(
              ", "
            )}</p>
            <p><strong>Location:</strong> ${lawyer.officeAddress.city}, ${
      lawyer.officeAddress.state
    }</p>
            <p><strong>Services:</strong> ${lawyer.serviceTypes.join(", ")}</p>
            <p><strong>Languages:</strong> ${lawyer.languages.join(", ")}</p>
            <p><strong>Consultation Fee:</strong> ₹${lawyer.consultationFee}</p>
          </div>
          <div class="profile-actions">
            ${
              isProfileOwner
                ? `<button id="edit-profile-btn" class="btn btn-primary"><i class="fas fa-edit"></i> Edit Profile</button>`
                : `<button class="btn btn-primary schedule-consultation-btn">Schedule Consultation</button>
                 <button class="btn btn-outline contact-btn">Contact</button>`
            }
          </div>
        </div>
        
        <div class="profile-tabs">
          <button class="tab-btn active" data-tab="about">About</button>
          <button class="tab-btn" data-tab="education">Education</button>
          <button class="tab-btn" data-tab="reviews">Reviews</button>
        </div>
        
        <div class="profile-content">
          <div class="tab-content active" id="about-tab">
            <h2>About</h2>
            <p>${lawyer.bio || "No bio information available."}</p>
            
            <h3>Contact Information</h3>
            <p><strong>Address:</strong> ${lawyer.officeAddress.street}, ${
      lawyer.officeAddress.city
    }, ${lawyer.officeAddress.state} ${lawyer.officeAddress.zipCode}</p>
            <p><strong>Email:</strong> ${lawyer.email}</p>
            <p><strong>Phone:</strong> ${lawyer.phone || "Not provided"}</p>
            
            <h3>Bar Information</h3>
            <p><strong>Bar Council:</strong> ${
              lawyer.barCouncil || "Not specified"
            }</p>
            <p><strong>Bar Number:</strong> ${
              lawyer.barNumber || "Not provided"
            }</p>
          </div>
          
          <div class="tab-content" id="education-tab">
            <h2>Education</h2>
            ${lawyer.education
              .map(
                (edu) => `
              <div class="education-item">
                <h3>${edu.degree}</h3>
                <p>${edu.institution}</p>
                <p>Graduated: ${edu.graduationYear}</p>
              </div>
            `
              )
              .join("")}
          </div>
          
          <div class="tab-content" id="reviews-tab">
            <h2>Client Reviews</h2>
            <div class="add-review-container">
              ${
                localStorage.getItem("user") && !isProfileOwner
                  ? `<button id="write-review-btn" class="btn btn-outline">Write a Review</button>`
                  : !localStorage.getItem("user")
                  ? `<p>Please <a href="#" id="login-to-review">login</a> to write a review</p>`
                  : ""
              }
            </div>
            
            <div class="reviews-list">
              ${
                reviews.length > 0
                  ? reviews
                      .map(
                        (review) => `
                  <div class="review-item">
                    <div class="review-header">
                      <div class="reviewer-info">
                        <h4>${review.user.name}</h4>
                        <span class="review-date">${new Date(
                          review.createdAt
                        ).toLocaleDateString()}</span>
                      </div>
                      <div class="review-rating">
                        ${generateStars(review.rating)}
                      </div>
                    </div>
                    <p class="review-content">${review.comment}</p>
                  </div>
                `
                      )
                      .join("")
                  : `<p class="no-reviews">No reviews yet. Be the first to review this lawyer.</p>`
              }
            </div>
          </div>
        </div>
      </section>
    `;

    // Add tab functionality
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all tabs
        document
          .querySelectorAll(".tab-btn")
          .forEach((t) => t.classList.remove("active"));
        document
          .querySelectorAll(".tab-content")
          .forEach((t) => t.classList.remove("active"));

        // Add active class to selected tab
        this.classList.add("active");
        document
          .getElementById(`${this.dataset.tab}-tab`)
          .classList.add("active");
      });
    });

    // Setup review button functionality
    const writeReviewBtn = document.getElementById("write-review-btn");
    if (writeReviewBtn) {
      writeReviewBtn.addEventListener("click", () => showReviewModal(lawyerId));
    }

    // Login to review functionality
    const loginToReview = document.getElementById("login-to-review");
    if (loginToReview) {
      loginToReview.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("login-btn").click();
      });
    }

    // Schedule consultation button
    const scheduleBtn = document.querySelector(".schedule-consultation-btn");
    if (scheduleBtn) {
      scheduleBtn.addEventListener("click", () =>
        showSchedulingModal(lawyer.name, lawyerId)
      );
    }

    // Edit profile button
    const editProfileBtn = document.getElementById("edit-profile-btn");
    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", () =>
        showEditProfileModal(lawyer, lawyerId)
      );
    }

    // Change photo button
    const changePhotoBtn = document.getElementById("change-photo-btn");
    if (changePhotoBtn) {
      changePhotoBtn.addEventListener("click", () =>
        showChangePhotoModal(lawyer, lawyerId)
      );
    }
  } catch (error) {
    console.error("Error loading lawyer profile:", error);
    mainContent.innerHTML = `
      <section class="lawyer-profile-page">
        <div class="error-message">
          <h2>Error Loading Profile</h2>
          <p>We encountered a problem loading this lawyer's profile. Please try again later.</p>
          <button class="btn btn-primary" id="back-btn">Go Back</button>
        </div>
      </section>
    `;

    document.getElementById("back-btn").addEventListener("click", () => {
      history.back();
    });
  }
}

// Helper function to generate star ratings
function generateStars(rating) {
  let starsHTML = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  // Add half star if needed
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half"></i>';
  }

  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

// Show modal for writing a review
function showReviewModal(lawyerId) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Write a Review</h2>
      <form id="review-form">
        <div class="form-group">
          <label>Rating</label>
          <div class="star-rating-input">
            <i class="far fa-star" data-rating="1"></i>
            <i class="far fa-star" data-rating="2"></i>
            <i class="far fa-star" data-rating="3"></i>
            <i class="far fa-star" data-rating="4"></i>
            <i class="far fa-star" data-rating="5"></i>
            <input type="hidden" id="rating-input" value="0">
          </div>
        </div>
        <div class="form-group">
          <label for="review-comment">Your Review</label>
          <textarea id="review-comment" rows="5" required placeholder="Share your experience with this lawyer..."></textarea>
        </div>
        <div class="error-message" id="review-error" style="display: none;"></div>
        <button type="submit" class="btn btn-primary">Submit Review</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Setup star rating functionality
  const stars = modal.querySelectorAll(".star-rating-input i");
  const ratingInput = modal.querySelector("#rating-input");

  stars.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const rating = this.dataset.rating;

      // Reset all stars
      stars.forEach((s) => (s.className = "far fa-star"));

      // Fill stars up to the selected one
      for (let i = 0; i < rating; i++) {
        stars[i].className = "fas fa-star";
      }
    });

    star.addEventListener("mouseout", function () {
      // Reset to current value
      const currentRating = parseInt(ratingInput.value);
      resetStars(stars, currentRating);
    });

    star.addEventListener("click", function () {
      const rating = this.dataset.rating;
      ratingInput.value = rating;
      resetStars(stars, rating);
    });
  });

  function resetStars(stars, rating) {
    stars.forEach((s, i) => {
      s.className = i < rating ? "fas fa-star" : "far fa-star";
    });
  }

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
    .getElementById("review-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const errorElement = document.getElementById("review-error");
      errorElement.style.display = "none";

      const rating = parseInt(document.getElementById("rating-input").value);
      const comment = document.getElementById("review-comment").value.trim();

      // Validate rating
      if (rating < 1 || rating > 5) {
        errorElement.textContent = "Please select a rating (1-5 stars).";
        errorElement.style.display = "block";
        return;
      }

      // Validate comment
      if (!comment) {
        errorElement.textContent = "Please provide a review comment.";
        errorElement.style.display = "block";
        return;
      }

      try {
        const submitBtn = modal.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";

        // Submit the review
        const response = await lawyerService.addReview(lawyerId, {
          rating,
          comment,
        });

        if (response.data.success) {
          alert("Your review has been submitted successfully!");
          document.body.removeChild(modal);
          // Reload the page to show the new review
          renderLawyerProfilePage(lawyerId);
        } else {
          errorElement.textContent =
            response.data.message ||
            "Failed to submit review. Please try again.";
          errorElement.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Submit Review";
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        errorElement.textContent =
          error.response?.data?.message ||
          "Failed to submit review. Please try again.";
        errorElement.style.display = "block";

        const submitBtn = modal.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Submit Review";
      }
    });
}

// Show scheduling modal
function showSchedulingModal(lawyerName, lawyerId) {
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

// Show modal for changing profile photo
function showChangePhotoModal(lawyer, lawyerId) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Update Profile Photo</h2>
      <div class="profile-upload-container">
        <div class="profile-image-preview">
          <img id="profile-preview" src="${
            lawyer.profileImage || "/lawyer.png"
          }" alt="Profile preview">
        </div>
        <div class="upload-controls">
          <input type="file" id="profile-image" name="profileImage" accept="image/*" style="display: none;">
          <button type="button" id="upload-trigger" class="btn btn-outline">Choose New Photo</button>
          <p class="form-help">Maximum size: 2MB. Formats: JPG, PNG</p>
        </div>
      </div>
      <div class="error-message" id="upload-error" style="display: none;"></div>
      <div class="modal-actions">
        <button id="save-photo-btn" class="btn btn-primary" disabled>Save Changes</button>
        <button id="cancel-photo-btn" class="btn btn-outline">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Setup file input trigger
  const uploadTrigger = modal.querySelector("#upload-trigger");
  const profileImageInput = modal.querySelector("#profile-image");
  const profilePreview = modal.querySelector("#profile-preview");
  const saveBtn = modal.querySelector("#save-photo-btn");
  const errorElement = modal.querySelector("#upload-error");

  uploadTrigger.addEventListener("click", () => {
    profileImageInput.click();
  });

  // Handle image preview and validation
  profileImageInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        errorElement.textContent = "File is too large. Maximum size is 2MB.";
        errorElement.style.display = "block";
        e.target.value = ""; // Reset the input
        return;
      }

      // Check file type
      if (!file.type.match("image/(jpeg|jpg|png)")) {
        errorElement.textContent = "Only JPG and PNG files are allowed.";
        errorElement.style.display = "block";
        e.target.value = ""; // Reset the input
        return;
      }

      // Reset error message
      errorElement.style.display = "none";

      // Preview the image
      const reader = new FileReader();
      reader.onload = function (event) {
        profilePreview.src = event.target.result;
        uploadTrigger.textContent = "Change Photo";
        saveBtn.disabled = false;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle save button click
  saveBtn.addEventListener("click", async () => {
    if (profileImageInput.files.length === 0) {
      return;
    }

    try {
      saveBtn.disabled = true;
      saveBtn.textContent = "Uploading...";
      errorElement.style.display = "none";

      // Create form data for file upload
      const formData = new FormData();
      formData.append("profileImage", profileImageInput.files[0]);

      // Log the form data to ensure it's correctly formed
      console.log(
        "Uploading image:",
        profileImageInput.files[0].name,
        profileImageInput.files[0].size,
        profileImageInput.files[0].type
      );

      // Upload the image using the corrected API service
      const response = await lawyerService.uploadProfileImage(formData);

      console.log("Upload response:", response);

      if (response.data && response.data.success) {
        // Update the user object in localStorage with new image URL
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          userData.profileImage =
            response.data.data.profileImage || response.data.url;
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // Reload the page to show the updated profile image
        alert("Profile image updated successfully!");
        renderLawyerProfilePage(lawyerId);
        document.body.removeChild(modal);
      } else {
        errorElement.textContent =
          (response.data && response.data.message) ||
          "Failed to upload image. Please try again.";
        errorElement.style.display = "block";
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Changes";
      }
    } catch (error) {
      console.error("Image upload error:", error);
      errorElement.textContent =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Failed to upload image. Please try again.";
      errorElement.style.display = "block";
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Changes";
    }
  });

  // Handle cancel button click
  modal.querySelector("#cancel-photo-btn").addEventListener("click", () => {
    document.body.removeChild(modal);
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
}

// Show modal for editing lawyer profile
function showEditProfileModal(lawyer, lawyerId) {
  const modal = document.createElement("div");
  modal.classList.add("modal", "large-modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Edit Profile</h2>
      <form id="edit-profile-form">
        <div class="form-section">
          <h3>Professional Information</h3>
          
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows="4" placeholder="Tell clients about yourself and your practice">${
              lawyer.bio || ""
            }</textarea>
          </div>
          
          <div class="form-group">
            <label>Practice Areas</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" name="practiceAreas" value="Family Law" ${
                  lawyer.practiceAreas.includes("Family Law") ? "checked" : ""
                }> Family Law
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="practiceAreas" value="Criminal Defense" ${
                  lawyer.practiceAreas.includes("Criminal Defense")
                    ? "checked"
                    : ""
                }> Criminal Defense
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="practiceAreas" value="Immigration" ${
                  lawyer.practiceAreas.includes("Immigration") ? "checked" : ""
                }> Immigration
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="practiceAreas" value="Housing & Tenants Rights" ${
                  lawyer.practiceAreas.includes("Housing & Tenants Rights")
                    ? "checked"
                    : ""
                }> Housing & Tenants Rights
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="practiceAreas" value="Employment Law" ${
                  lawyer.practiceAreas.includes("Employment Law")
                    ? "checked"
                    : ""
                }> Employment Law
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="practiceAreas" value="Civil Rights" ${
                  lawyer.practiceAreas.includes("Civil Rights") ? "checked" : ""
                }> Civil Rights
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="practiceAreas" value="Consumer Protection" ${
                  lawyer.practiceAreas.includes("Consumer Protection")
                    ? "checked"
                    : ""
                }> Consumer Protection
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="practiceAreas" value="Other" ${
                  lawyer.practiceAreas.includes("Other") ? "checked" : ""
                }> Other
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label>Service Types</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" name="serviceTypes" value="Pro Bono" ${
                  lawyer.serviceTypes.includes("Pro Bono") ? "checked" : ""
                }> Pro Bono
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="serviceTypes" value="Low Cost" ${
                  lawyer.serviceTypes.includes("Low Cost") ? "checked" : ""
                }> Low Cost
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="serviceTypes" value="Sliding Scale" ${
                  lawyer.serviceTypes.includes("Sliding Scale") ? "checked" : ""
                }> Sliding Scale
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="serviceTypes" value="Standard Rates" ${
                  lawyer.serviceTypes.includes("Standard Rates")
                    ? "checked"
                    : ""
                }> Standard Rates
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" value="${
              lawyer.phone || ""
            }">
          </div>
          
          <div class="form-group">
            <label for="bar-number">Bar Number</label>
            <input type="text" id="bar-number" name="barNumber" value="${
              lawyer.barNumber || ""
            }">
          </div>
          
          <div class="form-group">
            <label for="bar-council">Bar Council</label>
            <select id="bar-council" name="barCouncil">
              <option value="">Select Bar Council</option>
              <option value="Bar Council of India" ${
                lawyer.barCouncil === "Bar Council of India" ? "selected" : ""
              }>Bar Council of India</option>
              <option value="Bar Council of Delhi" ${
                lawyer.barCouncil === "Bar Council of Delhi" ? "selected" : ""
              }>Bar Council of Delhi</option>
              <option value="Bar Council of Maharashtra and Goa" ${
                lawyer.barCouncil === "Bar Council of Maharashtra and Goa"
                  ? "selected"
                  : ""
              }>Bar Council of Maharashtra and Goa</option>
              <option value="Bar Council of Tamil Nadu" ${
                lawyer.barCouncil === "Bar Council of Tamil Nadu"
                  ? "selected"
                  : ""
              }>Bar Council of Tamil Nadu</option>
              <option value="Bar Council of Uttar Pradesh" ${
                lawyer.barCouncil === "Bar Council of Uttar Pradesh"
                  ? "selected"
                  : ""
              }>Bar Council of Uttar Pradesh</option>
              <option value="Bar Council of West Bengal" ${
                lawyer.barCouncil === "Bar Council of West Bengal"
                  ? "selected"
                  : ""
              }>Bar Council of West Bengal</option>
              <option value="Bar Council of Rajasthan" ${
                lawyer.barCouncil === "Bar Council of Rajasthan"
                  ? "selected"
                  : ""
              }>Bar Council of Rajasthan</option>
              <option value="Bar Council of Kerala" ${
                lawyer.barCouncil === "Bar Council of Kerala" ? "selected" : ""
              }>Bar Council of Kerala</option>
              <option value="Other" ${
                lawyer.barCouncil === "Other" ? "selected" : ""
              }>Other</option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Languages</h3>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="English" ${
                lawyer.languages.includes("English") ? "checked" : ""
              }> English
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Hindi" ${
                lawyer.languages.includes("Hindi") ? "checked" : ""
              }> Hindi
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Bengali" ${
                lawyer.languages.includes("Bengali") ? "checked" : ""
              }> Bengali
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Telugu" ${
                lawyer.languages.includes("Telugu") ? "checked" : ""
              }> Telugu
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Marathi" ${
                lawyer.languages.includes("Marathi") ? "checked" : ""
              }> Marathi
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Tamil" ${
                lawyer.languages.includes("Tamil") ? "checked" : ""
              }> Tamil
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Gujarati" ${
                lawyer.languages.includes("Gujarati") ? "checked" : ""
              }> Gujarati
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Kannada" ${
                lawyer.languages.includes("Kannada") ? "checked" : ""
              }> Kannada
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Malayalam" ${
                lawyer.languages.includes("Malayalam") ? "checked" : ""
              }> Malayalam
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Punjabi" ${
                lawyer.languages.includes("Punjabi") ? "checked" : ""
              }> Punjabi
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="languages" value="Other" ${
                lawyer.languages.includes("Other") ? "checked" : ""
              }> Other
            </label>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Office Address</h3>
          <div class="form-group">
            <label for="street">Street Address</label>
            <input type="text" id="street" name="officeAddress.street" value="${
              lawyer.officeAddress.street
            }" required>
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" name="officeAddress.city" value="${
              lawyer.officeAddress.city
            }" required>
          </div>
          <div class="form-group">
            <label for="state">State</label>
            <select id="state" name="officeAddress.state" required>
              <option value="">Select State</option>
              <option value="Andhra Pradesh" ${
                lawyer.officeAddress.state === "Andhra Pradesh"
                  ? "selected"
                  : ""
              }>Andhra Pradesh</option>
              <option value="Arunachal Pradesh" ${
                lawyer.officeAddress.state === "Arunachal Pradesh"
                  ? "selected"
                  : ""
              }>Arunachal Pradesh</option>
              <option value="Assam" ${
                lawyer.officeAddress.state === "Assam" ? "selected" : ""
              }>Assam</option>
              <option value="Bihar" ${
                lawyer.officeAddress.state === "Bihar" ? "selected" : ""
              }>Bihar</option>
              <option value="Chhattisgarh" ${
                lawyer.officeAddress.state === "Chhattisgarh" ? "selected" : ""
              }>Chhattisgarh</option>
              <option value="Delhi" ${
                lawyer.officeAddress.state === "Delhi" ? "selected" : ""
              }>Delhi</option>
              <option value="Goa" ${
                lawyer.officeAddress.state === "Goa" ? "selected" : ""
              }>Goa</option>
              <option value="Gujarat" ${
                lawyer.officeAddress.state === "Gujarat" ? "selected" : ""
              }>Gujarat</option>
              <option value="Haryana" ${
                lawyer.officeAddress.state === "Haryana" ? "selected" : ""
              }>Haryana</option>
              <option value="Himachal Pradesh" ${
                lawyer.officeAddress.state === "Himachal Pradesh"
                  ? "selected"
                  : ""
              }>Himachal Pradesh</option>
              <option value="Jharkhand" ${
                lawyer.officeAddress.state === "Jharkhand" ? "selected" : ""
              }>Jharkhand</option>
              <option value="Karnataka" ${
                lawyer.officeAddress.state === "Karnataka" ? "selected" : ""
              }>Karnataka</option>
              <option value="Kerala" ${
                lawyer.officeAddress.state === "Kerala" ? "selected" : ""
              }>Kerala</option>
              <option value="Madhya Pradesh" ${
                lawyer.officeAddress.state === "Madhya Pradesh"
                  ? "selected"
                  : ""
              }>Madhya Pradesh</option>
              <option value="Maharashtra" ${
                lawyer.officeAddress.state === "Maharashtra" ? "selected" : ""
              }>Maharashtra</option>
              <option value="Manipur" ${
                lawyer.officeAddress.state === "Manipur" ? "selected" : ""
              }>Manipur</option>
              <option value="Meghalaya" ${
                lawyer.officeAddress.state === "Meghalaya" ? "selected" : ""
              }>Meghalaya</option>
              <option value="Mizoram" ${
                lawyer.officeAddress.state === "Mizoram" ? "selected" : ""
              }>Mizoram</option>
              <option value="Nagaland" ${
                lawyer.officeAddress.state === "Nagaland" ? "selected" : ""
              }>Nagaland</option>
              <option value="Odisha" ${
                lawyer.officeAddress.state === "Odisha" ? "selected" : ""
              }>Odisha</option>
              <option value="Punjab" ${
                lawyer.officeAddress.state === "Punjab" ? "selected" : ""
              }>Punjab</option>
              <option value="Rajasthan" ${
                lawyer.officeAddress.state === "Rajasthan" ? "selected" : ""
              }>Rajasthan</option>
              <option value="Sikkim" ${
                lawyer.officeAddress.state === "Sikkim" ? "selected" : ""
              }>Sikkim</option>
              <option value="Tamil Nadu" ${
                lawyer.officeAddress.state === "Tamil Nadu" ? "selected" : ""
              }>Tamil Nadu</option>
              <option value="Telangana" ${
                lawyer.officeAddress.state === "Telangana" ? "selected" : ""
              }>Telangana</option>
              <option value="Tripura" ${
                lawyer.officeAddress.state === "Tripura" ? "selected" : ""
              }>Tripura</option>
              <option value="Uttar Pradesh" ${
                lawyer.officeAddress.state === "Uttar Pradesh" ? "selected" : ""
              }>Uttar Pradesh</option>
              <option value="Uttarakhand" ${
                lawyer.officeAddress.state === "Uttarakhand" ? "selected" : ""
              }>Uttarakhand</option>
              <option value="West Bengal" ${
                lawyer.officeAddress.state === "West Bengal" ? "selected" : ""
              }>West Bengal</option>
            </select>
          </div>
          <div class="form-group">
            <label for="zip">PIN Code</label>
            <input type="text" id="zip" name="officeAddress.zipCode" pattern="[0-9]{6}" value="${
              lawyer.officeAddress.zipCode
            }" required>
            <p class="form-help">6-digit PIN code (e.g., 110001)</p>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Consultation Fee</h3>
          <div class="form-group">
            <label for="consultation-fee">Initial Consultation Fee (₹)</label>
            <input type="number" id="consultation-fee" name="consultationFee" min="0" value="${
              lawyer.consultationFee
            }">
            <p class="form-help">Enter 0 for free initial consultations</p>
          </div>
        </div>
        
        <div class="error-message" id="edit-form-error" style="display: none;"></div>
        
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <button type="button" id="cancel-edit-btn" class="btn btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle cancel button
  modal.querySelector("#cancel-edit-btn").addEventListener("click", () => {
    document.body.removeChild(modal);
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

  // Load cities based on selected state
  document.getElementById("state").addEventListener("change", function () {
    const selectedState = this.value;
    // Implementation for loading cities would go here
  });

  // Handle form submit
  document
    .getElementById("edit-profile-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const formError = document.getElementById("edit-form-error");
        formError.style.display = "none";

        // Collect form data
        const practiceAreas = Array.from(
          document.querySelectorAll('input[name="practiceAreas"]:checked')
        ).map((el) => el.value);

        const serviceTypes = Array.from(
          document.querySelectorAll('input[name="serviceTypes"]:checked')
        ).map((el) => el.value);

        const languages = Array.from(
          document.querySelectorAll('input[name="languages"]:checked')
        ).map((el) => el.value);

        // Validate required fields
        if (practiceAreas.length === 0) {
          formError.textContent = "Please select at least one practice area";
          formError.style.display = "block";
          return;
        }

        if (serviceTypes.length === 0) {
          formError.textContent = "Please select at least one service type";
          formError.style.display = "block";
          return;
        }

        if (languages.length === 0) {
          formError.textContent = "Please select at least one language";
          formError.style.display = "block";
          return;
        }

        // Build office address object
        const officeAddress = {
          street: document.getElementById("street").value,
          city: document.getElementById("city").value,
          state: document.getElementById("state").value,
          zipCode: document.getElementById("zip").value,
        };

        if (
          !officeAddress.street ||
          !officeAddress.city ||
          !officeAddress.state ||
          !officeAddress.zipCode
        ) {
          formError.textContent = "Please complete all office address fields";
          formError.style.display = "block";
          return;
        }

        // Get consultation fee
        const consultationFee =
          parseFloat(document.getElementById("consultation-fee").value) || 0;

        // Prepare data for API
        const updatedData = {
          practiceAreas,
          serviceTypes,
          languages,
          bio: document.getElementById("bio").value.trim(),
          phone: document.getElementById("phone").value.trim(),
          barNumber:
            document.getElementById("bar-number").value.trim() || undefined,
          barCouncil: document.getElementById("bar-council").value || undefined,
          officeAddress,
          consultationFee,
        };

        // Show loading indicator
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Saving...";

        // Submit data to update the profile
        const response = await lawyerService.updateLawyer(
          lawyerId,
          updatedData
        );

        if (response.data.success) {
          alert("Your profile has been updated successfully!");
          document.body.removeChild(modal);
          renderLawyerProfilePage(lawyerId);
        } else {
          formError.textContent =
            response.data.message ||
            "An error occurred while updating your profile";
          formError.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      } catch (error) {
        console.error("Profile update error:", error);
        const formError = document.getElementById("edit-form-error");
        formError.textContent =
          error.response?.data?.message ||
          "Failed to update profile. Please try again.";
        formError.style.display = "block";

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Save Changes";
      }
    });
}
