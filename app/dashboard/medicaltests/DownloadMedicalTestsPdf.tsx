'use client';

import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import MedicalTestsPdfDocument from './MedicalTestsPdfDocument';

interface MedicalTest {
  id: number;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  iduom: number;
  idcategory: number;
  normalmin: number | null;
  normalmax: number | null;
}

interface DownloadMedicalTestsPdfProps {
  tests: MedicalTest[];
}

const DownloadMedicalTestsPdf: React.FC<DownloadMedicalTestsPdfProps> = ({ tests }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(
        <MedicalTestsPdfDocument tests={tests} totalCount={tests.length} />
      ).toBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MedicalTests.pdf';
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

export default DownloadMedicalTestsPdf;
