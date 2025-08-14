import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#fdfdfd',
    fontFamily: 'Helvetica',
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  header: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#444',
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007ACC',
    borderLeftStyle: 'solid',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    color: '#333',
  },
    image: {
    width: '100%',
    height: 350,
    objectFit: 'contain',
    marginBottom: 10,
    },
});

export const GeneratePdf = ({
  orderDetails,
  orderData,
  images,
  tags,
}: {
  orderDetails: any;
  orderData: any;
  images: string[];
  tags: string[];
}) => {
  // Parse JSON if necessary
  let parsedData: Record<string, any> = {};
  try {
    parsedData =
      typeof orderData === 'string'
        ? JSON.parse(orderData)
        : typeof orderData?.data === 'string'
        ? JSON.parse(orderData.data)
        : orderData?.data || {};
  } catch {
    parsedData = {};
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>{orderDetails?.propertyAddress || 'No Address'}</Text>
        <Text style={styles.subHeader}>
          {orderDetails?.propertyCity || ''}, {orderDetails?.propertyState || ''} {orderDetails?.propertyZip || ''}
        </Text>

        {/* Property Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          {Object.entries(parsedData).map(([label, value], i) => (
            <View style={styles.detailRow} key={i}>
              <Text style={styles.detailLabel}>{label}:</Text>
              <Text style={styles.detailValue}>{String(value) || 'N/A'}</Text>
            </View>
          ))}
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Photos</Text>
          {images.map((image, index) => (
            <View key={index}>
              <Image src={image} style={styles.image} />
              <Text style={styles.text}>{tags?.[index] ?? ''}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
