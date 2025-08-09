import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
  },
    image: {
    width: '100%',
    height: 500,
    objectFit: 'contain',
    marginBottom: 10,
    },
});

export const GeneratePdf = ({
  orderDetails,
  orderData,
  images,
}: {
  orderDetails: any;
  orderData: any;
  images: any;
}
) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{orderDetails?.propertyAddress || 'No Address'}</Text>
      <Text style={styles.text}>{orderDetails?.propertyCity || ''}</Text>
      <Text style={styles.text}>{orderDetails?.propertyState || ''}</Text>
      <Text style={styles.text}>{orderDetails?.propertyZip || ''}</Text>

      <View style={{ marginTop: 20 }}>
        {orderData?.data &&
          Object.entries(orderData.data).map(([key, value]) => (
            <Text key={key} style={styles.text}>
              {key}: {String(value)}
            </Text>
          ))}
      </View>

      <View style={{ marginTop: 20 }}>
        {images.map((image, index) => (
            <Image src={image} style={styles.image} key={index} />
        ))}
      </View>
    </Page>
  </Document>
);
