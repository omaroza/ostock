import './globals.css';

export const metadata = {
  title: 'عُمان ستوك | منصة عُمانية للمحتوى الإبداعي',
  description:
    'عُمان ستوك: منصة عُمانية للمحتوى البصري والصوتي المرخّص — صور وفيديو وأصوات وقوالب وفيكتور لأشخاص ومواقع عُمانية حقيقية. من عُمان… إلى العالم.',
  icons: {
    icon: '/favicon-32.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
