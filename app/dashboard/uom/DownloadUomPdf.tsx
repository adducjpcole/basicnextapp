'use client';

import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import UomPdfDocument from './UomPdfDocument';

interface Uom {
  id: number;
  name: string;
  description: string | null;
}

interface DownloadUomPdfProps {
  uoms: Uom[];
}

const DownloadUomPdf: React.FC<DownloadUomPdfProps> = ({ uoms }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(
        <UomPdfDocument uoms={uoms} totalCount={uoms.length} />
      ).toBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'UnitsOfMeasure.pdf';
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

export default DownloadUomPdf;
