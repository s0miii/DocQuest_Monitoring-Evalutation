import React from 'react';
import { pdf } from '@react-pdf/renderer';
import AccReportPDF from './AccReportPDF';

const GeneratePDFDocument = async (formData) => {
    const blob = await pdf(<AccReportPDF formData={formData} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
};

export default GeneratePDFDocument;
