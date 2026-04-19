import "./globals.css";

export const metadata = {
  title: "Rejection Management | Changan Motors",
  description: "Quality Rejection Document Management System - Changan Motors Pakistan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="bg-ambient" />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
