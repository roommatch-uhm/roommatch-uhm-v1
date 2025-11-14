import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <main className="flex-fill">{children}</main>
      </body>
    </html>
  );
}
