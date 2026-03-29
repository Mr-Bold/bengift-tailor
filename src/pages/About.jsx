import './About.css'

function About() {
  return (
    <div className="about">
      <div className="page-header">
        <h1>About Tailor Master</h1>
        <p>A Complete Solution for Tailors</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>About the Application</h2>
          <p>
            Tailor Master is a comprehensive tailoring shop management system designed to streamline
            your daily operations. From job card creation to delivery tracking, this application
            helps you manage every aspect of your tailoring business efficiently.
          </p>
        </div>

        <div className="about-section">
          <h2>Key Features</h2>
          <ul className="features-list">
            <li>✓ Create and manage job cards</li>
            <li>✓ Track job status from order to delivery</li>
            <li>✓ Customer and worker management</li>
            <li>✓ Payment tracking and balance calculation</li>
            <li>✓ Business reports and analytics</li>
            <li>✓ Master data management</li>
            <li>✓ Print job cards</li>
            <li>✓ Data backup and restore</li>
            <li>✓ Offline-first with localStorage</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Developed By</h2>
          <div className="developer-info">
            <div className="logo">BG</div>
            <div>
              <h3>BenGift Clothing</h3>
              <p>Quality Tailoring Solutions</p>
              <p className="contact">Help Line: +91-9829221582</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Version Information</h2>
          <p>Version: 1.0.0</p>
          <p>Web Application</p>
          <p>Built with React</p>
        </div>

        <div className="about-section">
          <h2>Support</h2>
          <p>
            For support, feature requests, or bug reports, please contact us at the help line number
            provided above.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
