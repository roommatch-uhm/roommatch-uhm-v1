'use client';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1
                className="display-3 fw-bold mb-4"
                style={{ fontSize: '3.5rem' }}
              >
                RoomMatch UHM
              </h1>
              <p
                className="lead mb-4"
                style={{ fontSize: '1.25rem', color: '#6c757d' }}
              >
                A safer and more efficient way for UH Mānoa students to find
                housing and compatible roommates.
              </p>
              <Link
                href="/auth/signup"
                className="btn btn-dark btn-lg px-5 py-3"
                style={{ borderRadius: '8px', fontSize: '1.1rem' }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="container-fluid px-0 mt-5">
          <img
            src="/images/waikiki-beach.jpg"
            alt="Waikiki Beach and Diamond Head"
            className="img-fluid w-100"
            style={{
              maxHeight: '500px',
              objectFit: 'cover',
              borderRadius: '0',
              display: 'block',
            }}
          />
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="display-5 fw-bold mb-5">Get Started</h2>

          <div className="row g-5">
            {/* Create a Profile */}
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-4 d-flex justify-content-center">
                  <img
                    src="/images/create-pfp.png"
                    alt="Create a Profile"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3 className="h4 fw-bold mb-3">Create a Profile</h3>
                <p className="text-muted" style={{ fontSize: '1rem' }}>
                  Let us know what you value in your living space.
                </p>
              </div>
            </div>

            {/* Find Compatible Roommates */}
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-4 d-flex justify-content-center">
                  <img
                    src="/images/puzzle.jpg"
                    alt="Find Compatible Roommates"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3 className="h4 fw-bold mb-3">Find Compatible Roommates</h3>
                <p className="text-muted" style={{ fontSize: '1rem' }}>
                  See people who have similar priorities.
                </p>
              </div>
            </div>

            {/* Connect and Explore Options */}
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-4 d-flex justify-content-center">
                  <img
                    src="/images/connect.png"
                    alt="Connect and Explore Options"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3 className="h4 fw-bold mb-3">
                  Connect and Explore Options!
                </h3>
                <p className="text-muted" style={{ fontSize: '1rem' }}>
                  Chat with your matches and explore your housing options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="display-5 fw-bold mb-5">Testimonies</h2>

          <div className="row g-4">
            {/* Testimony 1 */}
            <div className="col-md-4">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ borderRadius: '12px' }}
              >
                <div className="card-body p-4">
                  <p className="mb-4" style={{ fontSize: '1rem' }}>
                    "I met my best friend! So glad we met with RoomMatch."
                  </p>
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/james-dion.jpg"
                      alt="James Dion"
                      className="rounded-circle me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23dc3545"/%3E%3C/svg%3E';
                      }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">James Dion</h6>
                      <small className="text-muted">User</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimony 2 */}
            <div className="col-md-4">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ borderRadius: '12px' }}
              >
                <div className="card-body p-4">
                  <p className="mb-4" style={{ fontSize: '1rem' }}>
                    "I was finally able to find someone super compatible with my lifestyle!"
                  </p>
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/deja-parker.jpg"
                      alt="Deja Parker"
                      className="rounded-circle me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%2328a745"/%3E%3C/svg%3E';
                      }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">Deja Parker</h6>
                      <small className="text-muted">User</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimony 3 */}
            <div className="col-md-4">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ borderRadius: '12px' }}
              >
                <div className="card-body p-4">
                  <p className="mb-4" style={{ fontSize: '1rem' }}>
                    "We are literally the same person. Can't believe we met through this app!"
                  </p>
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/sam-mai.jpg"
                      alt="Sam Mai"
                      className="rounded-circle me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23007bff"/%3E%3C/svg%3E';
                      }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">Sam Mai</h6>
                      <small className="text-muted">User</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="h3 fw-bold mb-2">
            Ready to Find Your Perfect Roommate?
          </h2>
          <p className="mb-3" style={{ fontSize: '0.95rem', color: '#6c757d' }}>
            Join RoomMatch UHM today and connect with compatible students at UH Mānoa
          </p>
          <Link
            href="/auth/signup"
            className="btn btn-dark px-4 py-2"
            style={{ borderRadius: '8px', fontSize: '0.95rem' }}
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}
