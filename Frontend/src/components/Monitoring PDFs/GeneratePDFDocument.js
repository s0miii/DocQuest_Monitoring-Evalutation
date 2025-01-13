import React from 'react';
import { pdf } from '@react-pdf/renderer';
import AccReportPDF from './AccReportPDF';

const GeneratePDFDocument = async (accReport, projectDetails) => {
    try {
        // Generate PDF Blob
        const blob = await pdf(<AccReportPDF accReport={accReport} projectDetails={projectDetails} />).toBlob();

        // Create a temporary URL for the PDF and open it in a new tab
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank'); // Opens the PDF in a new tab
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

export default GeneratePDFDocument;

