'use client';

import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import TestCategoriesPdfDocument from './TestCategoriesPdfDocument';

interface TestCategory {
  id: number;
  name: string;
  description: string | null;
}

interface DownloadTestCategoriesPdfProps {
  categories: TestCategory[];
}

const DownloadTestCategoriesPdf: React.FC<DownloadTestCategoriesPdfProps> = ({ categories }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(
        <TestCategoriesPdfDocument categories={categories} totalCount={categories.length} />
      ).toBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TestCategories.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="text-xs font-semibold uppercase tracking-widest bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-4 py-2 transition-all disabled:opacity-50"
      title="Download PDF"
    >
      {isGenerating ? 'Preparing…' : 'Download PDF'}
    </button>
  );
};

export default DownloadTestCategoriesPdf;
