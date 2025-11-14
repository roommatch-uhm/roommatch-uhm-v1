import Link from "next/link";

export default function Footer() {
  return (
    <footer className="uh-footer text-white py-5 mt-auto">
      <div className="container">
        <div className="row justify-content-between align-items-start">
          {/* Logo + Socials */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">RoomMatch UHM</h5>
            <div className="d-flex gap-3 mt-3">
              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook fs-4 text-white"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-4 text-white"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="bi bi-youtube fs-4 text-white"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram fs-4 text-white"></i>
              </a>
            </div>
          </div>

          {/* Created By */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Created By:</h6>
            <ul className="list-unstyled">
              <li>Brooke Clifton</li>
              <li>Harrison Gray</li>
              <li>Lara Miyakawa Ho</li>
              <li>Ethan Garcia</li>
              <li>Miley Chun</li>
            </ul>
          </div>

          {/* Create a Profile */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Profile</h6>
            <ul className="list-unstyled">
              <li>
                <Link href="/create" className="text-white text-decoration-none">
                  Create Your Profile
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-white text-decoration-none">
                  Edit Your Profile
                </Link>
              </li>
              <li>
                <Link href="/matches" className="text-white text-decoration-none">
                  View RoomMatches
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-white text-decoration-none">
                  Chat with RoomMatches
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center small mt-4 text-light">
          © {new Date().getFullYear()} RoomMatch UHM — University of Hawaiʻi at Mānoa
        </div>
      </div>
    </footer>
  );
}
