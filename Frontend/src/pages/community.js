export function renderCommunityPage() {
  const mainContent = document.getElementById("main-content");

  mainContent.innerHTML = `
    <section class="community-page">
      <h1 class="page-title">Community Forums</h1>
      <p class="page-description">Join discussions, share experiences, and learn from others facing similar legal issues.</p>
      
      <div class="forum-actions">
        <button id="new-topic-btn" class="btn btn-primary"><i class="fas fa-plus"></i> New Topic</button>
        <div class="search-container">
          <input type="text" id="forum-search" placeholder="Search forums...">
          <button class="btn btn-outline"><i class="fas fa-search"></i></button>
        </div>
      </div>
      
      <div class="forum-categories card">
        <h2>Forum Categories</h2>
        <div class="category-list">
          <div class="category-item">
            <div class="category-icon"><i class="fas fa-home"></i></div>
            <div class="category-info">
              <h3>Housing & Tenant Issues</h3>
              <p>Discussions about rental disputes, evictions, repairs, and tenant rights</p>
            </div>
            <div class="category-stats">
              <div><strong>523</strong> topics</div>
              <div><strong>2.1k</strong> posts</div>
            </div>
          </div>
          
          <div class="category-item">
            <div class="category-icon"><i class="fas fa-user-friends"></i></div>
            <div class="category-info">
              <h3>Family Law</h3>
              <p>Discussions about divorce, custody, child support, and other family matters</p>
            </div>
            <div class="category-stats">
              <div><strong>412</strong> topics</div>
              <div><strong>1.8k</strong> posts</div>
            </div>
          </div>
          
          <div class="category-item">
            <div class="category-icon"><i class="fas fa-briefcase"></i></div>
            <div class="category-info">
              <h3>Employment Law</h3>
              <p>Discussions about workplace disputes, discrimination, harassment, and termination</p>
            </div>
            <div class="category-stats">
              <div><strong>385</strong> topics</div>
              <div><strong>1.5k</strong> posts</div>
            </div>
          </div>
          
          <div class="category-item">
            <div class="category-icon"><i class="fas fa-gavel"></i></div>
            <div class="category-info">
              <h3>Small Claims</h3>
              <p>Discussions about small claims procedures, evidence, and court experiences</p>
            </div>
            <div class="category-stats">
              <div><strong>247</strong> topics</div>
              <div><strong>982</strong> posts</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="recent-discussions card">
        <h2>Recent Discussions</h2>
        <div class="discussion-list">
          <div class="discussion-item">
            <div class="discussion-votes">
              <div class="vote-count">12</div>
              <div class="vote-label">votes</div>
            </div>
            <div class="discussion-content">
              <h3><a href="#">Landlord won't fix heating, what are my options?</a></h3>
              <div class="discussion-meta">
                <span class="category-badge housing">Housing</span>
                <span class="reply-count"><i class="fas fa-comment"></i> 15 replies</span>
                <span class="view-count"><i class="fas fa-eye"></i> 234 views</span>
                <span class="timestamp">Posted 2 days ago by UserJohn123</span>
              </div>
            </div>
          </div>
          
          <div class="discussion-item">
            <div class="discussion-votes">
              <div class="vote-count">8</div>
              <div class="vote-label">votes</div>
            </div>
            <div class="discussion-content">
              <h3><a href="#">How does child custody work with an out-of-state move?</a></h3>
              <div class="discussion-meta">
                <span class="category-badge family">Family</span>
                <span class="reply-count"><i class="fas fa-comment"></i> 7 replies</span>
                <span class="view-count"><i class="fas fa-eye"></i> 128 views</span>
                <span class="timestamp">Posted 3 days ago by ParentInNeed</span>
              </div>
            </div>
          </div>
          
          <div class="discussion-item">
            <div class="discussion-votes">
              <div class="vote-count">15</div>
              <div class="vote-label">votes</div>
            </div>
            <div class="discussion-content">
              <h3><a href="#">Employer not paying overtime, what documentation do I need?</a></h3>
              <div class="discussion-meta">
                <span class="category-badge employment">Employment</span>
                <span class="reply-count"><i class="fas fa-comment"></i> 21 replies</span>
                <span class="view-count"><i class="fas fa-eye"></i> 302 views</span>
                <span class="timestamp">Posted 1 week ago by WorkerRights45</span>
              </div>
            </div>
          </div>
          
          <div class="discussion-item">
            <div class="discussion-votes">
              <div class="vote-count">6</div>
              <div class="vote-label">votes</div>
            </div>
            <div class="discussion-content">
              <h3><a href="#">Success story: Won my security deposit case in small claims!</a></h3>
              <div class="discussion-meta">
                <span class="category-badge claims">Small Claims</span>
                <span class="reply-count"><i class="fas fa-comment"></i> 18 replies</span>
                <span class="view-count"><i class="fas fa-eye"></i> 253 views</span>
                <span class="timestamp">Posted 5 days ago by VictoriousRenter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="community-stats card">
        <h2>Community Statistics</h2>
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-value">1,567</div>
            <div class="stat-label">Members</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">4,285</div>
            <div class="stat-label">Topics</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">16.4K</div>
            <div class="stat-label">Posts</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">138</div>
            <div class="stat-label">Online Now</div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Add event listener for new topic button
  document.getElementById("new-topic-btn").addEventListener("click", () => {
    showNewTopicModal();
  });

  // Add event listeners for discussion items
  document.querySelectorAll(".discussion-item h3 a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const topicTitle = link.textContent;
      alert(`Opening topic: ${topicTitle}`);
    });
  });

  // Add event listeners for forum categories
  document.querySelectorAll(".category-item").forEach((item) => {
    item.addEventListener("click", () => {
      const categoryName = item.querySelector("h3").textContent;
      alert(`Opening category: ${categoryName}`);
    });
  });

  // Add search functionality
  const searchInput = document.getElementById("forum-search");
  const searchButton = searchInput.nextElementSibling;

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      alert(`Searching forums for: ${searchTerm}`);
    }
  });
}

function showNewTopicModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Create New Topic</h2>
      <form id="new-topic-form">
        <div class="form-group">
          <label for="topic-title">Title</label>
          <input type="text" id="topic-title" placeholder="Enter a descriptive title" required>
        </div>
        <div class="form-group">
          <label for="topic-category">Category</label>
          <select id="topic-category" required>
            <option value="">Select a category</option>
            <option value="housing">Housing & Tenant Issues</option>
            <option value="family">Family Law</option>
            <option value="employment">Employment Law</option>
            <option value="claims">Small Claims</option>
            <option value="traffic">Traffic & Driving</option>
            <option value="consumer">Consumer Protection</option>
            <option value="immigration">Immigration</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="topic-content">Content</label>
          <textarea id="topic-content" rows="6" placeholder="Describe your situation or question in detail" required></textarea>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" id="topic-anonymous"> 
            Post anonymously
          </label>
        </div>
        <button type="submit" class="btn btn-primary">Create Topic</button>
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
  document.getElementById("new-topic-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("topic-title").value;
    const category = document.getElementById("topic-category").value;
    const content = document.getElementById("topic-content").value;
    const anonymous = document.getElementById("topic-anonymous").checked;

    alert(`Topic "${title}" created successfully in the ${category} category.`);
    document.body.removeChild(modal);
  });
}
