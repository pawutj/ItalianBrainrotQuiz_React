'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Quiz component with SSR disabled
// since it contains browser-specific APIs like window.fs
const ItalianBrainrotQuiz = dynamic(() => import('./components/ItalianBrainrotQuiz'), {
  ssr: false,
  loading: () => <p className="flex items-center justify-center min-h-screen">Loading quiz...</p>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ItalianBrainrotQuiz />
    </div>
  );
}
