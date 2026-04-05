import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageNumber: {
    fontSize: 9,
    color: '#000000',
  },
  filterInfo: {
    fontSize: 9,
    marginBottom: 15,
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#000000',
    borderBottomWidth: 0.5,
    minHeight: 20,
    alignItems: 'center',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    paddingBottom: 2,
    marginBottom: 2,
  },
  tableCol: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableCell: {
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 5,
  },
});

interface MedicalTestsPdfDocumentProps {
  tests: MedicalTest[];
  totalCount: number;
}

const MedicalTestsPdfDocument: React.FC<MedicalTestsPdfDocumentProps> = ({
  tests,
  totalCount,
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Header */}
      <View fixed>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Medical Tests</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
        <Text style={styles.filterInfo}>Total records: {totalCount}</Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeaderRow} fixed>
        <View style={{ ...styles.tableCol, width: '5%' }}>
          <Text style={[styles.tableCellHeader, { textAlign: 'right', paddingRight: 4 }]}>No.</Text>
        </View>
        <View style={{ ...styles.tableCol, width: '28%' }}>
          <Text style={styles.tableCellHeader}>Test Name</Text>
        </View>
        <View style={{ ...styles.tableCol, width: '15%' }}>
          <Text style={styles.tableCellHeader}>Category</Text>
        </View>
        <View style={{ ...styles.tableCol, width: '12%' }}>
          <Text style={styles.tableCellHeader}>Unit</Text>
        </View>
        <View style={{ ...styles.tableCol, width: '8%' }}>
          <Text style={[styles.tableCellHeader, { textAlign: 'right' }]}>Min</Text>
        </View>
        <View style={{ ...styles.tableCol, width: '8%' }}>
          <Text style={[styles.tableCellHeader, { textAlign: 'right' }]}>Max</Text>
        </View>
        <View style={{ ...styles.tableCol, width: '24%' }}>
          <Text style={styles.tableCellHeader}>Description</Text>
        </View>
      </View>

      {/* Table Rows */}
      <View style={styles.table}>
        {tests.map((test, index) => (
          <View key={test.id} style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '5%' }}>
              <Text style={[styles.tableCell, { textAlign: 'right', paddingRight: 4 }]}>{index + 1}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '28%' }}>
              <Text style={styles.tableCell}>{test.name}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.tableCell}>{test.category}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '12%' }}>
              <Text style={styles.tableCell}>{test.unit}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '8%' }}>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>
                {test.normalmin ?? '—'}
              </Text>
            </View>
            <View style={{ ...styles.tableCol, width: '8%' }}>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>
                {test.normalmax ?? '—'}
              </Text>
            </View>
            <View style={{ ...styles.tableCol, width: '24%' }}>
              <Text style={styles.tableCell}>{test.description ?? ''}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text>
          {tests.length} of {totalCount} Medical Tests
        </Text>
      </View>
    </Page>
  </Document>
);

export default MedicalTestsPdfDocument;
