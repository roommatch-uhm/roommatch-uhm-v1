'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [profileOpen, setProfileOpen] = useState(false);

  const toggleProfile = () => setProfileOpen(!profileOpen);
  const closeProfile = () => setProfileOpen(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar navbar-expand-lg shadow-sm py-3 px-4 bg-white">
      <div className="container-fluid d-flex align-items-center justify-content-between ms-3">

        {/* LOGO */}
        <Link href="/" className="d-flex align-items-center text-decoration-none">
          <Image
            src="/images/logo-option-1.png"
            alt="RoomMatch UHM Logo"
            width={200}
            height={75}
            className="me-2"
          />
        </Link>

        {/* MOBILE TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV LINKS */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* ALWAYS VISIBLE */}
            <li className="nav-item">
              <Link href="/" className={`nav-link ${isActive('/') ? 'active-link' : ''}`}>
                Home
              </Link>
            </li>

            {/* ONLY SHOW WHEN AUTHENTICATED */}
            {session && (
              <>
                <li className="nav-item">
                  <Link
                    href="/list"
                    className={`nav-link ${isActive('/list') ? 'active-link' : ''}`}
                  >
                    View RoomMatches
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/messages"
                    className={`nav-link ${isActive('/messages') ? 'active-link' : ''}`}
                  >
                    Messages
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/meetings"
                    className={`nav-link ${isActive('/meetings') ? 'active-link' : ''}`}
                  >
                    Meetings
                  </Link>
                </li>
              </>
            )}

            {/* PROFILE DROPDOWN */}
            <li className="nav-item dropdown ms-3 position-relative">
              <button
                id="profile-button"
                type="button"
                className="px-3 py-2 fw-semibold shadow-sm text-white"
                style={{
                  backgroundColor: '#116530',
                  border: 'none',
                  borderRadius: '8px',
                }}
                onClick={toggleProfile}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0e5529')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#116530')}
              >
                {session
                ? `Hi, ${
                  (session.user as any)?.username ??
                  session.user?.name ??
                  session.user?.email?.split('@')[0]
                }`
                : 'My Account'}
              </button>

              <ul
                id="profile-dropdown"
                className={
                  'dropdown-menu dropdown-menu-end mt-2 ' +
                  (profileOpen ? 'show' : '')
                }
              >
                {session && (
                  <>
                    <li>
                      <Link href="/profile" className="dropdown-item" onClick={closeProfile}>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/change-password" className="dropdown-item" onClick={closeProfile}>
                        Change Password
                      </Link>
                    </li>
                  </>
                )}

                {!session && (
                  <li>
                    <Link
                      href="/auth/signup"
                      className="dropdown-item"
                      onClick={closeProfile}
                    >
                      Create Account
                    </Link>
                  </li>
                )}

                {session && <li><hr className="dropdown-divider" /></li>}

                {session ? (
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        closeProfile();
                        signOut({ callbackUrl: '/' });
                      }}
                    >
                      Sign Out
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/auth/signin"
                      className="dropdown-item"
                      onClick={closeProfile}
                    >
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
