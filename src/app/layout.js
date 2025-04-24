import './globals.css'

export const metadata = {
  title: 'Italian Brainrot Quiz',
  description: 'Test your knowledge of Italian Brainrot characters',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
