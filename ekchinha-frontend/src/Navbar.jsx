import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./Navbar.css";

function Navbar({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const heartFilled = location.pathname === "/saved";
  const cartFilled = location.pathname === "/cart";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="left-group" onClick={() => navigate("/")}>
        <img src="/logo.webp" alt="Logo" className="logo" />
        <span className="brand-name">EkChinha</span>
      </div>

      <div className="middle-group">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src="/search.png" alt="Search" className="search-icon" />
        </div>
      </div>

      <div className="icon-group">
        {user ? (
          <>
            <img
              src={heartFilled ? "/fill-heart.png" : "/heart.png"}
              alt="Wishlist"
              className="nav-icon"
              onClick={() => navigate("/saved")}
            />

            <img
              src={
                cartFilled ? "/fill-shopping-cart.png" : "/shopping-cart.png"
              }
              alt="Cart"
              className="nav-icon"
              onClick={() => navigate("/cart")}
            />

            <div className="profile-container" ref={dropdownRef}>
              <img
                src="/profile.png"
                alt="Profile"
                className="nav-icon profile-icon"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="profile-dropdown">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/userprofile");
                      setDropdownOpen(false);
                    }}
                  >
                    <img src="/user.png" alt="Profile" />
                    <span>Profile</span>
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                  >
                    <img src="/logout.png" alt="Logout" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <button className="login" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
