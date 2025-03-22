export function renderHomePage() {
  const mainContent = document.getElementById("main-content");

  mainContent.innerHTML = `
    <section class="hero">
      <h2>Access to Legal Aid Made Simple</h2>
      <p>Connect with affordable legal services and pro bono lawyers. Get the legal help you need.</p>
      <div class="hero-buttons">
        <button class="btn btn-light" id="find-lawyer-btn">Find a Lawyer</button>
        <button class="btn btn-outline-light" id="ask-ai-btn">Ask AI Assistant</button>
      </div>
    </section>
    
    <section>
      <h2 class="section-title">Our Services</h2>
      <div class="features-grid">
        <div class="feature-card card">
          <i class="fas fa-user-tie"></i>
          <h3>Lawyer Directory</h3>
          <p>Find and connect with pro bono lawyers and affordable legal services in your area.</p>
        </div>
        <div class="feature-card card">
          <i class="fas fa-robot"></i>
          <h3>AI Legal Assistant</h3>
          <p>Get instant answers to common legal questions through our AI-powered assistant.</p>
        </div>
        <div class="feature-card card">
          <i class="fas fa-book-open"></i>
          <h3>Resource Library</h3>
          <p>Access guides, documents, and educational materials on various legal topics.</p>
        </div>
        <div class="feature-card card">
          <i class="fas fa-comments"></i>
          <h3>Community Forums</h3>
          <p>Join discussions, share experiences, and learn from others facing similar legal issues.</p>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="section-title">How It Works</h2>
      <div class="steps-container">
        <div class="step card">
          <div class="step-number">1</div>
          <h3>Create an Account</h3>
          <p>Sign up to access all our features and personalized recommendations.</p>
        </div>
        <div class="step card">
          <div class="step-number">2</div>
          <h3>Describe Your Legal Need</h3>
          <p>Tell us about your situation or ask questions to our AI assistant.</p>
        </div>
        <div class="step card">
          <div class="step-number">3</div>
          <h3>Get Connected</h3>
          <p>Connect with lawyers, resources, or community members who can help.</p>
        </div>
      </div>
    </section>
    
    <section class="testimonials">
      <h2 class="section-title">Success Stories</h2>
      <div class="testimonial-slider">
        <div class="testimonial card">
          <div class="quote"><i class="fas fa-quote-left"></i></div>
          <p>LawSphere connected me with a pro bono lawyer who helped me understand my rights as a tenant. I couldn't have navigated the legal system without this support.</p>
          <div class="testimonial-author">
            <strong>Maria G.</strong>, Housing Rights Case
          </div>
        </div>
      </div>
    </section>
  `;

  // Add event listeners
  document.getElementById("find-lawyer-btn").addEventListener("click", () => {
    document.querySelector('a[data-page="lawyers"]').click();
  });

  document.getElementById("ask-ai-btn").addEventListener("click", () => {
    document.querySelector('a[data-page="ai-assistant"]').click();
  });
}
