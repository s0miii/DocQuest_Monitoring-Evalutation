import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Font registration
Font.register({ family: 'Arial', src: '/fonts/arial.TTF' });
Font.register({ family: 'ArialB', src: '/fonts/arialb.TTF' });
Font.register({ family: 'Zapf', src: '/fonts/zapf.ttf' });

const styles = StyleSheet.create({
    headerContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 5 
    },
    logoContainer: { 
        paddingRight: 5 
    },
    textContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    universityName: { 
        textAlign: 'center', 
        fontSize: 12, 
        fontFamily: 'Zapf', 
        marginBottom: 2 
    },
    campuses: { 
        textAlign: 'center', 
        fontSize: 7, 
        fontFamily: 'Zapf' 
    },
    page: { 
        fontFamily: 'Arial', 
        fontSize: 10, 
        paddingTop: 5, 
        paddingBottom: 65, 
        paddingHorizontal: 30,
        paddingLeft: 72,
        paddingRight: 36,
    },
    logo: { 
        width: 60, 
        height: 60, 
    },
    tableColone: {
        width: '',
        padding: '5',
    },
    tableColone30: {
        width: '30%',
        padding: '5',
    },
    tableColone70: {
        width: '70%',
        padding: '5',
    },
    tableColtwo: {
        width: '50%',
        padding: '5',
    },
    tableColthree: {
        width: '33.33%',
        padding: '5',
    },
});

const Header = () => (
    <View style={[styles.headerContainer]}>
        <View style={[styles.logoContainer, { width: 10 }]}>
            <Image style={styles.logo} src="/images/ustp_logo.png" />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.universityName}> University of Science and Technology of Southern Philippines </Text>
            <Text style={styles.campuses}> Alubijid | Balubal | Cagayan de Oro | Claveria | Jasaan | Oroquieta | Panaon | Villanueva </Text>
        </View>
    </View>
);

const Footer = ({ pageNumber }) => (
    <View
        style={{
            position: 'absolute',
            bottom: 20,
            right: 30,
            fontSize: 10,
            fontFamily: 'Arial',
        }}
    >
        <Text>{pageNumber}</Text>
    </View>
);

const AccReportPDF = ({ formData, projectDetails }) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Header />
                <View>
                <Text style={[{ fontSize: '12', textAlign: 'center', marginTop: 10, marginBottom: 7, justifyContent: 'center', fontFamily: 'ArialB', }]}>
                    Extension Accomplishment Report
                </Text>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                    <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> BANNER PROGRAM TITLE: </Text>
                    </View>
                    <View style={[styles.tableColone70, { flexDirection: 'row', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> {formData.banner_program_title}</Text>
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                    <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> FLAGSHIP PROGRAM: </Text>
                    </View>
                    <View style={[styles.tableColone70, { flexDirection: 'row', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> {formData.flagship_program}</Text>
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                    <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> PROJECT TITLE: </Text>
                    </View>
                    <View style={[styles.tableColone70, { flexDirection: 'row', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> {projectDetails.projectTitle}</Text>
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                    <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> TYPE OF PROJECT: </Text>
                    </View>
                    <View style={[styles.tableColone70, { flexDirection: 'row', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> {projectDetails.projectType}</Text>
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                    <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> PROJECT CATEGORY: </Text>
                    </View>
                    <View style={[styles.tableColone70, { flexDirection: 'row', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> {projectDetails.programCategories}</Text>
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                    <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> TITLE OF RESEARCH: </Text>
                    </View>
                    <View style={[styles.tableColone70, { flexDirection: 'row', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text> {projectDetails.researchTitle}</Text>
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: '#D1FFBD' }]}>
                    <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text>PROPONENTS: {projectDetails.proponents}</Text>
                    </View>
                    <View style={[styles.tableColone70, { flexDirection: 'column', fontFamily: 'ArialB', backgroundColor: '#D1FFBD' }]}>
                        <View style={[{ borderBottom: 1, borderColor: '#000', padding: '1%' }]}>
                            <Text>PROGRAM: {projectDetails.programs}</Text>
                        </View>
                        <View style={[{ borderBottom: 1, borderColor: '#000', padding: '1%' }]}>
                            <Text>ACCREDITATION LEVEL: {projectDetails.accreditationLevel}</Text>
                        </View>
                        <View style={{ padding: '1%' }}>
                            <Text>COLLEGE: {projectDetails.college}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.tableColone, { flexDirection: 'row', border: 1, borderBottom: 0, paddingLeft: '1%', paddingRight: '1%', backgroundColor: '#D1FFBD', fontFamily: 'ArialB', }]}>
                    <Text> TARGET GROUPS/BENEFICIARIES: {projectDetails.beneficiaries} </Text>
                </View>
                <View style={[styles.tableColone, { flexDirection: 'row', border: 1, borderBottom: 0, paddingLeft: '1%', paddingRight: '1%', backgroundColor: '#D1FFBD', fontFamily: 'ArialB', }]}>
                    <Text> PROJECT LOCATION: {projectDetails.projectLocation} </Text>
                </View>
                <View style={[styles.tableColone, { flexDirection: 'row', border: 1, borderBottom: 0, paddingLeft: '1%', paddingRight: '1%', backgroundColor: '#D1FFBD', fontFamily: 'ArialB', }]}>
                    <Text> PARTNER AGENCY: {projectDetails.partnerAgency} </Text>
                </View>
                <View style={[styles.tableColone, { flexDirection: 'row', border: 1, borderBottom: 0, paddingLeft: '1%', paddingRight: '1%', backgroundColor: '#D1FFBD', fontFamily: 'ArialB', }]}>
                    <Text> TRAINING MODALITY: {formData.training_modality} </Text>
                </View>

                <View style={[{ border: 1, borderBottom: 0, paddingLeft: '1%', paddingRight: '1%', fontFamily: 'ArialB' }]}></View>
                <View style={{ height: 10 }}></View>
                
                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: '#D1FFBD' }]}>
                    <View style={[styles.tableColthree, { flexDirection: 'row', borderRight: 1, justifyContent: 'center', alignItems: 'center', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text style={{ textAlign: 'center' }}>ACTUAL START DATE OF{"\n"}IMPLEMENTATION:</Text>
                    </View>
                    <View style={[styles.tableColthree, { flexDirection: 'row', borderRight: 1, justifyContent: 'center', alignItems: 'center', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text style={{ textAlign: 'center' }}>ACTUAL END DATE OF{"\n"}IMPLEMENTATION:</Text>
                    </View>
                    <View style={[styles.tableColthree, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text>TOTAL NUMBER OF DAYS:</Text>
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                    <View style={[styles.tableColthree, { flexDirection: 'row', borderRight: 1, justifyContent: 'center', alignItems: 'center', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text>{formData.actualStartDateImplementation}</Text>
                    </View>
                    <View style={[styles.tableColthree, { flexDirection: 'row', borderRight: 1, justifyContent: 'center', alignItems: 'center', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text>{formData.actualEndDateImplementation}</Text>
                    </View>
                    <View style={[styles.tableColthree, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '1%', fontFamily: 'ArialB' }]}>
                        <Text>{formData.total_number_of_days}</Text>
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                    <View style={{ flex: 1, padding: '2%', fontFamily: 'ArialB' }}>
                        <Text style={{ textAlign: 'left' }}>Submitted by:</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 10 }}>
                            <Text style={{ fontFamily: 'ArialB', textDecoration: 'underline', textAlign: 'center' }}>{formData.submitted_by}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 15, marginBottom: 10 }}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}>Main Proponent/Project Leader</Text>
                        </View>
                    </View>
                </View>

                <View style={[{ border: 1, borderBottom: 0, paddingLeft: '1%', paddingRight: '1%', fontFamily: 'ArialB' }]}></View>
                <View style={{ height: 10 }}></View>

                {/* PREXC Achievement Table */}
                <View style={[{ flexDirection: 'column', border: 1, borderTop: 1 }]}>
                    <View style={[{ flexDirection: 'row', backgroundColor: 'white', borderBottom: 1 }]}>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }]}>
                            <Text style={{ fontFamily: 'ArialB' }}>PREXC Achievement</Text>
                        </View>
                    </View>

                    <View style={[{ flexDirection: 'row', backgroundColor: 'white', borderBottom: 1 }]}>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRight: 1, padding: 5 }]}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}> Persons Trained Weighted by the Number of days Training </Text>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: 'auto' }}>? {formData.traineesWeighted}</Text>
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRight: 1, padding: 5 }]}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}> Actual Number of Trainees based on{"\n"}Attendance Sheets </Text>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: 'auto' }}>? {formData.actualTrainees}</Text>
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRight: 1, padding: 5 }]}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}> Actual Number of Days Training </Text>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: 'auto' }}>? {formData.actualDays}</Text>
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }]}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}> Persons Trained </Text>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: 'auto' }}>? {formData.personsTrained}</Text>
                        </View>
                    </View>

                    {/* Second Data Row */}
                    <View style={[{ flexDirection: 'row', backgroundColor: 'white' }]}>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRight: 1, padding: 5 }]}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}> Number of Trainees/{"\n"}Facilitator who evaluated the training to be at least <Text style={{ fontFamily: 'ArialB' }}>satisfactory</Text> </Text>
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5, borderRight: 1 }]}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}>? {formData.satisfactoryEvaluation}</Text>
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRight: 1, padding: 5 }]}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}>Rating</Text>
                            <Text style={{ fontFamily: 'ArialB', textAlign: 'center' }}>100%</Text>
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }]}>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}></Text>
                            <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}></Text>
                        </View>
                    </View>
                </View>
                <View style={[{ borderBottom: 0, paddingLeft: '1%', paddingRight: '1%', fontFamily: 'ArialB' }]}></View>
            </View>
        <Footer pageNumber={1} />
    </Page>

        {/* Page 2 */}
        <Page size="A4" style={styles.page}>
            <Header />
            <View>
                <Text style={{ fontFamily: 'ArialB', fontSize: 12, textAlign: 'center', marginVertical: 10 }}> Project Narrative </Text>

                <View style={{ width: '100%' }}>
                    <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                        <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>Description of Major activities and topics covered</Text>
                        </View>
                        <View style={[styles.tableColone70, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>{formData.activities_topics}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                        <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>Issues and Challenges{"\n"}encountered</Text>
                        </View>
                        <View style={[styles.tableColone70, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>{formData.issues_challenges}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                        <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>Quality of the Participants’{"\n"}Engagement</Text>
                        </View>
                        <View style={[styles.tableColone70, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>{formData.participant_engagement_quality}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                        <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>Discussion of questions raised and comments from the{"\n"}participants</Text>
                        </View>
                        <View style={[styles.tableColone70, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>{formData.discussion_comments}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', border: 1, borderBottom: 0, backgroundColor: 'white' }]}>
                        <View style={[styles.tableColone30, { flexDirection: 'row', borderRight: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>Ways Forward and Plans</Text>
                        </View>
                        <View style={[styles.tableColone70, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '1%', fontFamily: 'Arial' }]}>
                            <Text>{formData.ways_forward_plans}</Text>
                        </View>
                    </View>
                    <View style={[{ border: 1, borderBottom: 0 }]}></View>
                </View>
            </View>
            <Footer pageNumber={2} />
        </Page>

            {/* Page 3 */}
            <Page size="A4" style={styles.page}>
            <Header />
            <View style={{ marginTop: 20, marginBottom: 20 }}>
                <Text style={{ fontFamily: 'ArialB', fontSize: 12, textAlign: 'center' }}> Photo Documentation </Text>
            </View>

            {/* <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
                <Text style={{ fontFamily: 'Arial', fontSize: 10 }}>Prepared by:</Text>
                <Text style={{ fontFamily: 'ArialB', fontSize: 10, marginTop: 5, textDecoration: 'underline', }} >
                    Dr/Engr/Mr/Ms. John Doe PhD/MEd/MSc/MD
                </Text>
                <Text style={{ fontFamily: 'Arial', fontSize: 10, marginTop: 5 }}>
                    Office/Designation (ex. Faculty/College of Information Technology and Communication)
                </Text>
            </View>

            <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
                <Text style={{ fontFamily: 'Arial', fontSize: 10 }}>Noted by:</Text>
                <Text style={{ fontFamily: 'ArialB', fontSize: 10, marginTop: 5, textDecoration: 'underline', }}>
                    Dr. Maria Teresa M. Fajardo
                </Text>
                <Text style={{ fontFamily: 'Arial', fontSize: 10, marginTop: 5 }}>
                    Director, Extension and Community Relations Division
                </Text>
            </View> */}
            <Footer pageNumber={3} />
        </Page>
        </Document>
    );
};

export default AccReportPDF;