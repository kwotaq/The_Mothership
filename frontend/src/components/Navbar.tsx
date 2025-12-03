const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="website-title">osu!grStatistics</h1>
        </div>

        <ul className="navbar-links">
          <li className="nav-item">
            <a href="/" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="/statistics" className="nav-link">Statistics</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;