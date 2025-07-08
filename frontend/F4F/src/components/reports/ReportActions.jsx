// Import html2pdf if not already imported
import html2pdf from 'html2pdf.js';

const handlePrintReport = () => {
  const reportElement = document.querySelector('.report-container');
  
  // Add PDF-specific classes temporarily
  reportElement.classList.add('pdf-optimized');
  
  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: 'resume-analysis-report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  
  html2pdf().set(opt).from(reportElement).save().then(() => {
    // Remove PDF-specific classes after export
    reportElement.classList.remove('pdf-optimized');
  });
};