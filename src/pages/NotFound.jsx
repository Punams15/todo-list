import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h2>404 - Page Not Found</h2>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
}

export default NotFound;