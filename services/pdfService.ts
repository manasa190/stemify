
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AnalysisResult } from '../types';

export const generateInstitutionalReport = (result: AnalysisResult, imageBase64: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('STEMIFY INSTITUTIONAL REPORT', 15, 25);
  doc.setFontSize(10);
  doc.text('Protocol v2.1 | Neural Agri-Pathology Analysis', 15, 33);

  // Diagnostic Summary
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text(`Primary Diagnosis: ${result.diseaseName}`, 15, 55);
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Scientific Name: ${result.scientificName}`, 15, 62);
  
  // Severity Badge
  const severityStr = result.severity.toUpperCase();
  const severityColors: Record<string, number[]> = {
    high: [244, 63, 94],
    medium: [245, 158, 11],
    low: [16, 185, 129]
  };
  
  const color = severityColors[result.severity] || severityColors.low;
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(150, 50, 45, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(`${severityStr} SEVERITY`, 155, 58);

  // Neural Statistics Table
  const statsTable = [
    ['Neural Model', 'Confidence Score', 'Inference Engine'],
    ['Expert System', `${(result.confidence * 100).toFixed(1)}%`, 'Gemini 3 Pro'],
    ['Local CNN', `${(result.cnnLayerInsights?.confidence ? result.cnnLayerInsights.confidence * 100 : 0).toFixed(1)}%`, result.cnnLayerInsights?.architecture || 'MobileNetV2']
  ];

  (doc as any).autoTable({
    startY: 70,
    head: [statsTable[0]],
    body: statsTable.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] }
  });

  // Diagnostic Explanation
  const yAfterStats = (doc as any).lastAutoTable.finalY + 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text('PATHOLOGICAL EVALUATION', 15, yAfterStats);
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const explanationLines = doc.splitTextToSize(result.explanation, 180);
  doc.text(explanationLines, 15, yAfterStats + 7);

  // Management Recommendations Table
  const managementTable = [
    ['Protocol Type', 'Technical Guidelines'],
    ['Mandatory (DO)', result.detailedRecommendations.immediate.join('\n• ')],
    ['Restricted (DONT)', result.detailedRecommendations.prohibited.join('\n• ')],
    ['Prevention', result.preventiveMeasures.join('\n• ')]
  ];

  (doc as any).autoTable({
    startY: yAfterStats + 7 + (explanationLines.length * 5) + 5,
    body: managementTable,
    theme: 'striped',
    columnStyles: {
      0: { fontStyle: 'bold', width: 40 },
      1: { cellWidth: 140 }
    }
  });

  // Source Image Section (Removed Heatmap reference)
  const yAfterManagement = (doc as any).lastAutoTable.finalY + 10;
  if (yAfterManagement < pageHeight - 80) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('VALIDATION SOURCE IMAGE:', 15, yAfterManagement);
    try {
      doc.addImage(imageBase64, 'JPEG', 15, yAfterManagement + 5, 80, 60);
    } catch (e) {
      doc.text('[Image encoding error - placeholder only]', 15, yAfterManagement + 10);
    }
  } else {
    doc.addPage();
    doc.text('VALIDATION SOURCE IMAGE:', 15, 20);
    doc.addImage(imageBase64, 'JPEG', 15, 25, 120, 90);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Confidential Institutional Document. Distributed via MongoDB Atlas Protocol.', 15, 285);
  doc.text(`Doc ID: ${crypto.randomUUID().substring(0,8)} | Generated: ${new Date().toLocaleString()}`, 130, 285);

  doc.save(`STEMIFY_DIAGNOSIS_${Date.now()}.pdf`);
};
