import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'RoomMatch UHM',
  description: 'Find your perfect UH Mānoa roommate safely and easily.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <main className="flex-fill">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
