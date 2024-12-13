import React, { useEffect, useState } from 'react';
import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';
import axios from 'axios';

// Font registration
Font.register({ family: 'Arial', src: '/fonts/arial.TTF' });
Font.register({ family: 'ArialB', src: '/fonts/arialb.TTF' });
Font.register({ family: 'Zapf', src: '/fonts/zapf.ttf' });

const styles = StyleSheet.create({
    headerContainer: { flexDirection: 'row', alignItems: 'center', padding: 5 },
    logoContainer: { paddingRight: 5 },
    logo: { width: 60, height: 'auto' },
    textContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    universityName: { textAlign: 'center', fontSize: 12, fontFamily: 'Zapf', marginBottom: 2 },
    campuses: { textAlign: 'center', fontSize: 7, fontFamily: 'Zapf' },
    page: { fontFamily: 'Arial', fontSize: 10, paddingTop: 35, paddingBottom: 65, paddingHorizontal: 30 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    logo: { width: 50, height: 50, marginRight: 10 },
    title: { fontSize: 14, textAlign: 'center', textTransform: 'uppercase', marginBottom: 3 },
    sectionHeader: { fontSize: 12, color: 'white', backgroundColor: '#000000', padding: 3, marginBottom: 2 },
    row: { flexDirection: 'row', borderBottomWidth: 1, alignItems: 'center', minHeight: 20 },
    boldText: { fontWeight: 'bold' },
    cell: { flex: 1, fontSize: 10, padding: 2 },
    box: { padding: 5 },
    headerText: {
        fontSize: 11,
        textAlign: 'center',
        fontFamily: 'ArialB',
        margin: 5,
    },
    tableHeader: {
        backgroundColor: '#CCCCCC',
        padding: 3,
        color: '#000',
        border: 1,
        borderColor: '#000',
        borderWidth: 1,
    },
    tableCell: {
        border: 1,
        borderColor: '#000',
        borderWidth: 1,
        padding: 2,
    },
    tableRow: {
        flexDirection: 'row',
    },
    section: {
        marginBottom: 10,
    },
    subsectionHeader: {
        backgroundColor: 'white',
        padding: 3,
    },
    fieldTitle: {
        backgroundColor: 'white',
        padding: 3,
        border: 1,
        borderColor: '#000',
        borderWidth: 1,
    },
    fieldValue: {
        padding: 3,
        border: 1,
        borderColor: '#000',
        borderWidth: 1,
        minHeight: 20,
    },
});

const Header = () => (
    <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Image style={styles.logo} src="/images/ustp_logo.png" />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.universityName}>University of Science and Technology of Southern Philippines</Text>
            <Text style={styles.campuses}>Alubijid | Balubal | Cagayan de Oro | Claveria | Jasaan | Oroquieta | Panaon | Villanueva</Text>
        </View>
    </View>
);

const AccReportPDF = ({ projectID }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://api.example.com/projects/${projectID}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        fetchData();
    }, [projectID]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.title}>Extension Accomplishment Report</Text>
                
                {/* Fields */}
                <View style={styles.tableRow}>
                    <Text style={styles.fieldTitle}>BANNER PROGRAM TITLE</Text>
                    <Text style={styles.fieldValue}></Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.fieldTitle}>FLAGSHIP PROGRAM</Text>
                    <Text style={styles.fieldValue}></Text>
                </View>
            </Page>
        </Document>
    );
};

export default AccReportPDF;