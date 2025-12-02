import "./globals.css";
import { UserProvider } from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Providers from './providers';

export const metadata = {
  title: "RoomMatch UHM",
  description: "Find your perfect UH Mānoa roommate safely and easily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100 bg-light">
        <Providers>
          <Navbar />
          <main className="flex-fill">{children}</main>
          <Footer />
        </Providers>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
