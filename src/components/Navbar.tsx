'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar navbar-expand-lg shadow-sm py-3 px-4 bg-white">
      <div className="container-fluid d-flex align-items-center justify-content-between ms-3">
        {/* Logo */}
        <Link href="/" className="d-flex align-items-center text-decoration-none">
          <Image
            src="/images/logo-option-1.png"
            alt="RoomMatch UHM Logo"
            width={200}
            height={75}
            className="me-2"
          />
        </Link>

        {/* Hamburger menu (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link href="/" className={`nav-link ${isActive('/') ? 'active-link' : ''}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/list" className={`nav-link ${isActive('/list') ? 'active-link' : ''}`}>
                View RoomMatches
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/auth/signup" className={`nav-link ${isActive('/auth/signup') ? 'active-link' : ''}`}>
                Create a Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/messages" className={`nav-link ${isActive('/messages') ? 'active-link' : ''}`}>
                Messages
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/meetings" className={`nav-link ${isActive('/meetings') ? 'active-link' : ''}`}>
                Meetings
              </Link>
            </li>

            {/* Conditional rendering for signed in / signed out */}
            {session ? (
              <>
                <li className="nav-item ms-3">
                  <Link href="/profile" className="fw-semibold text-success text-decoration-none">
                    Hi, {session.user?.name || session.user?.email?.split('@')[0]}
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="btn btn-outline-success rounded-pill px-3 py-1 fw-semibold"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  href="/auth/signin"
                  className="btn-profile ms-3 px-3 py-2 fw-semibold shadow-sm"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
