"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar navbar-expand-lg shadow-sm py-3 px-4 bg-white">
      <div className="container-fluid d-flex align-items-center justify-content-between ms-3">
        <Link href="/" className="d-flex align-items-center text-decoration-none">
          <Image
            src="/images/logo-option-1.png"
            alt="RoomMatch UHM Logo"
            width={200}
            height={75}
            className="me-2"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${isActive("/") ? "active-link" : ""}`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/view"
                className={`nav-link ${isActive("/view") ? "active-link" : ""}`}
              >
                View RoomMatches
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/create"
                className={`nav-link ${isActive("/create") ? "active-link" : ""}`}
              >
                Create a Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/messages"
                className={`nav-link ${isActive("/messages") ? "active-link" : ""}`}
              >
                Messages
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/meetings"
                className={`nav-link ${isActive("/meetings") ? "active-link" : ""}`}
              >
                Meetings
              </Link>
            </li>
            <li className="nav-item">
              <Link
              href="/profile"
              className="btn-profile ms-3 px-3 py-2 fw-semibold shadow-sm"
              >
                My Profile
                </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
