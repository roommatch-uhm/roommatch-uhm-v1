'use client';

export default function SupportFAQ() {
  return (
    <main>
      {/* Header Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">Support and FAQs</h1>
            <p className="lead text-muted">
              Find answers to common questions about RoomMatch UHM
            </p>
          </div>

          {/* FAQs */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="mb-5">
                <h2 className="h4 fw-bold mb-4">Frequently Asked Questions</h2>

                {/* FAQ Item */}
                <div className="card mb-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <h3 className="h5 fw-bold mb-3">What is RoomMatch UHM?</h3>
                    <p className="text-muted mb-0">
                      RoomMatch UHM is a platform designed to help University of Hawaiʻi at Mānoa students
                      find compatible roommates. Our matching system helps connect students based on their
                      preferences, lifestyle habits, and compatibility factors.
                    </p>
                  </div>
                </div>

                {/* FAQ Item */}
                <div className="card mb-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <h3 className="h5 fw-bold mb-3">How do I create a profile?</h3>
                    <p className="text-muted mb-0">
                      To create a profile, sign up for an account and navigate to the &quot;Create Your Profile&quot;
                      page. Fill out information about yourself, your preferences, and what you&apos;re looking for
                      in a roommate. The more detailed your profile, the better your matches will be!
                    </p>
                  </div>
                </div>

                {/* FAQ Item */}
                <div className="card mb-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <h3 className="h5 fw-bold mb-3">How does the matching system work?</h3>
                    <p className="text-muted mb-0">
                      Our matching system analyzes your profile information and preferences to calculate
                      compatibility scores with other users. You can view potential roommates in the
                      RoomMatch directory, sorted by compatibility.
                    </p>
                  </div>
                </div>

                {/* FAQ Item */}
                <div className="card mb-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <h3 className="h5 fw-bold mb-3">How do I contact potential roommates?</h3>
                    <p className="text-muted mb-0">
                      Once you find someone you&apos;re interested in, you can use our built-in messaging
                      feature to start a conversation. Navigate to the &quot;Chat with RoomMatches&quot; section
                      to send and receive messages.
                    </p>
                  </div>
                </div>

                {/* FAQ Item */}
                <div className="card mb-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <h3 className="h5 fw-bold mb-3">Can I edit my profile after creating it?</h3>
                    <p className="text-muted mb-0">
                      Yes! You can edit your profile at any time by going to the &quot;Edit Your Profile&quot;
                      page. Keep your information up-to-date to ensure the best possible matches.
                    </p>
                  </div>
                </div>

                {/* FAQ Item */}
                <div className="card mb-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <h3 className="h5 fw-bold mb-3">Is my information private and secure?</h3>
                    <p className="text-muted mb-0">
                      We take your privacy seriously. Your personal information is only visible to other
                      registered users of the platform. You control what information you share in your profile.
                    </p>
                  </div>
                </div>

                {/* FAQ Item */}
                <div className="card mb-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <h3 className="h5 fw-bold mb-3">Who can use RoomMatch UHM?</h3>
                    <p className="text-muted mb-0">
                      RoomMatch UHM is exclusively for University of Hawaiʻi at Mānoa students. You&apos;ll
                      need a valid UH email address to create an account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
