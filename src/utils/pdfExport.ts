import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Direct PDF Generator using html2canvas & jsPDF
 * Renders the document into an A4 formatted PDF file and triggers download
 */
export async function downloadDocumentAsPdf(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    window.print();
    return false;
  }

  try {
    // Add print preparation class
    element.classList.add('rendering-pdf');

    const canvas = await html2canvas(element, {
      scale: 2, // 2x for sharp vector-like text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    element.classList.remove('rendering-pdf');

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Remaining pages with exact page-by-page offsets
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.warn('Direct PDF export encountered an issue, falling back to browser print dialog:', error);
    element.classList.remove('rendering-pdf');
    window.print();
    return false;
  }
}
