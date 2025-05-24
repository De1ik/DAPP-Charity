import "./css/main.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";


function App() {
  return (
    <>
      <Header />
      <main className="desktop-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background" />
          <div className="hero-inner">
            <div className="hero-titles">
              <h1 className="hero-title">Crypto<br /><span className="jarity-accent">JARity</span></h1>
              <div className="hero-subtitle">With Crypto for Charity</div>
              <a href="jars" className="hero-donate-btn">DONATE</a>
            </div>
            <img
              className="hero-planet"
              alt="Planet"
              src="/images/planet.png"
            />
          </div>
        </section>

        {/* How it Works */}
        <div className="main-block">
          <section className="how-section">
            <h2 className="section-title">How it works</h2>
            <div className="how-box">
              <ul className="how-list">
                <li>Create a fundraiser</li>
                <li>Share your cause and spread the word</li>
                <li>Accept donations in crypto</li>
                <li>Withdraw funds directly</li>
                <li>Track donations and goal progress</li>
              </ul>
            </div>
            <a href="jars" className="section-donate-btn">DONATE</a>
          </section>

          {/* Featured Funds */}
          <section className="featured-section">
            <h2 className="section-title">Featured Funds</h2>
            <div className="featured-box">
              <p>
                Explore meaningful fundraisers created by people like you, or supporting nonprofits.<br/>
                Find causes, create projects, and be part of the change.
              </p>
            </div>
            <a href="jars" className="section-donate-btn">DONATE</a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App

