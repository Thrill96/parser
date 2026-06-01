import './globals.css';

export const metadata = {
  title: 'AEO Monitor',
  description:
    'Track whether ChatGPT, Claude, Gemini, and Perplexity can find, recommend, and correctly identify your brand.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
