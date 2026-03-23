import './Landing.css';
import sdsuLogo from '../assets/SDSULogo.jpg';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const router = useNavigate()

  const routeSignin = () => {
    router('/signin');
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo">
            <img src={sdsuLogo} alt="Logo" className="logo-img" />
            <span>Study Group Finder</span>
            </div>
        <nav className="nav-links">
          <button className="nav-btn">Classes</button>
          <button className="nav-btn">Dashboard</button>
          <button className="nav-btn primary" onClick={routeSignin}>SIGN IN</button>
          <button className="nav-prof-btn" onClick={() => window.location.reload()}>
            <img src="/profileIcon.svg" alt="Profile" className="prof-icon" />
          </button>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-content">
          <h1>FORMING CONNECTIONS</h1>
          <p>Be able to connect with your peers much easier and faster.</p>
          <button className="cta-btn" onClick={routeSignin}>Create Account</button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;