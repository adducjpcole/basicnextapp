import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface Uom {
  id: number;
  name: string;
  description: string | null;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
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
    fontSize: 10,
    color: '#000000',
  },
  filterInfo: {
    fontSize: 10,
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
    fontSize: 10,
  },
  tableCell: {
    fontSize: 10,
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

interface UomPdfDocumentProps {
  uoms: Uom[];
  totalCount: number;
}

const UomPdfDocument: React.FC<UomPdfDocumentProps> = ({ uoms, totalCount }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View fixed>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Units of Measure</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
        <Text style={styles.filterInfo}>Total records: {totalCount}</Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeaderRow} fixed>
        <View style={{ ...styles.tableCol, width: '8%' }}>
          <Text style={[styles.tableCellHeader, { textAlign: 'right', paddingRight: 8 }]}>No.</Text>
        </View>
        <View style={{ ...styles.tableCol, width: '22%' }}>
          <Text style={styles.tableCellHeader}>Name</Text>
        </View>
        <View style={{ ...styles.tableCol, width: '70%' }}>
          <Text style={styles.tableCellHeader}>Description</Text>
        </View>
      </View>

      {/* Table Rows */}
      <View style={styles.table}>
        {uoms.map((uom, index) => (
          <View key={uom.id} style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '8%' }}>
              <Text style={[styles.tableCell, { textAlign: 'right', paddingRight: 8 }]}>{index + 1}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '22%' }}>
              <Text style={styles.tableCell}>{uom.name}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '70%' }}>
              <Text style={styles.tableCell}>{uom.description ?? ''}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text>
          {uoms.length} of {totalCount} Units of Measure
        </Text>
      </View>
    </Page>
  </Document>
);

export default UomPdfDocument;
