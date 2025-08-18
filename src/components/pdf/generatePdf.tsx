import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#fdfdfd',
    fontFamily: 'Helvetica',
  },

  /* ===== TOP BAR ===== */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between', // optional: spreads logo + title block
  },
  logo: { 
    width: 180, 
    height: 60, 
    marginRight: 5
},
  titleBlock: {
    flexGrow: 1,
    alignItems: 'flex-end', // <- right-align children inside the block
  },
  reportTitle: {
    fontSize: 18,
    textAlign: 'right',
    color: '#000000',
    fontWeight: 'bold',
  },
  reportSubtitle: {
    fontSize: 12,
    color: '#000000',
    marginTop: 2,
    textAlign: 'right', // <- ensure the address line is right-aligned
  },

  /* ===== SECTIONS ===== */
  section: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#000000',
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#256ccb',
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

  /* keep your existing text + image styles */
  text: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  imgTag: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 350,
    objectFit: 'contain',
    marginBottom: 10,
    borderRadius: 8
  },
  frontImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
    splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    height: '175px',
    borderRadius: 8,
  },
  half: { width: '48%' },

  ratingHeader: { 
    fontSize: 14,
    fontWeight: 600,
    color: '#000000', 
    marginBottom: 6, 
    marginTop: 6
},
  ratingBox: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: { fontSize: 36, fontWeight: 'bold', color: '#000' },
  pill: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  frontHeader: { fontSize: 12, color: '#555', marginBottom: 6, textAlign: 'center' },
});

export const GeneratePdf = ({
  orderDetails,
  rating,
  vendorDetails,
  orderData,
  images,
  tags,
  logoSrc,
}: {
  orderDetails: any;
  rating: any;
  orderData: any;
  vendorDetails: any;
  images: string[];
  tags: string[];
  logoSrc?: string;
}) => {
  // Parse JSON safely
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

  // ---- sorting unchanged except for your priority map ----
  let sortedImgs = images.map((img, i) => ({ image: img, tag: tags?.[i] ?? '', idx: i }));
  const priority: Record<string, number> = {

    'Front': 1,
    'Left Side': 2,
    'Right Side': 3,
    'Street Left': 4,
    'Street Right': 5,
    'Address': 6,
    'Across the Street': 7,
    'Street Sign': 8,
  };
  sortedImgs.sort((a, b) => {
    const priA = priority[a.tag] ?? 99;
    const priB = priority[b.tag] ?? 99;
    if (priA !== priB) return priA - priB;
    return a.idx - b.idx; // stable within same priority
  });

  // Helpers to pick fields if present
  const rLabel = (rating?.rating || 'Unknown').toString();
  const colorMap: Record<string, { bg: string; fg: string }> = {
    Good:      { bg: '#E6F4EA', fg: '#1E7B34' },
    Moderate:  { bg: '#FFF4E5', fg: '#8A4B00' },
    Elevated:  { bg: '#FFF0F0', fg: '#B3261E' },
    High:      { bg: '#FBE9E7', fg: '#C62828' },
    Unknown:   { bg: '#EEEEEE', fg: '#555555' },
  };
  const palette = colorMap[rLabel] || colorMap.Unknown;

  const gv = (k: string) => (parsedData?.[k] ?? 'N/A');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===== TOP BAR ===== */}
        <View style={styles.topBar}>
          {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : <View style={styles.logo} />}
          <View style={styles.titleBlock}>
            <Text style={styles.reportTitle}>Property Condition Report</Text>
            <Text style={styles.reportSubtitle}>
              {orderDetails?.propertyAddress || 'No Address'}
            </Text>
          </View>
        </View>

        {/* ===== ADDRESS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Street:</Text>
            <Text style={styles.detailValue}>{orderDetails?.propertyAddress || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>City/State/Zip:</Text>
            <Text style={styles.detailValue}>
              {(orderDetails?.propertyCity || 'N/A') + ', ' + (orderDetails?.propertyState || 'N/A') + ' ' + (orderDetails?.propertyZip || 'N/A')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspection Date:</Text>
            <Text style={styles.detailValue}>
              {(orderDetails?.requestedDueDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Property:</Text>
            <Text style={styles.detailValue}>
              {(orderDetails?.propertyType)}
            </Text>
          </View>
        </View>
        <View style={styles.splitRow}>
          {/* Rating card */}
          <View style={[styles.card, styles.half, {padding: 5,}]}>
            <Text style={styles.ratingHeader}>Overall Rating</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.score}>{Math.round(rating?.score ?? 0)}</Text>
              <Text style={[styles.pill, { backgroundColor: palette.bg, color: palette.fg }]}>
                {rLabel}
              </Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 10, color: '#555' }}>
                Type: {gv('propertyType')} • Stories: {gv('stories')}
              </Text>
              <Text style={{ fontSize: 10, color: '#555', marginTop: 2 }}>
                Condition: {gv('subjectCondition')} • Repairs: {gv('repairsNeeded')}
              </Text>
            </View>
          </View>

          {/* Front photo card */}
          <View style={[styles.card, styles.half]}>
              <>
                <Image src={sortedImgs[0].image} style={styles.frontImage} />
              </>
          </View>
        </View>

        {/* ===== PROPERTY INFORMATION ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          {[
            ['Property Type', gv('propertyType')],
            ['Stories', gv('stories')],
            ['Occupancy', gv('occupancy')],
            ['Neighborhood', gv('neighborhood')],
            ['View Factors', gv('viewFactors')],
            ['Subject Condition', gv('subjectCondition')],
            ['Neighborhood Conformity', gv('neighborhoodConformity')],
            ['Common Elements', gv('commonElements')],
            ['Repairs Needed', gv('repairsNeeded')],
            ['Items', gv('items')],
            ['Date Assigned', gv('date')],
          ].map(([label, value], i) => (
            <View style={styles.detailRow} key={i}>
              <Text style={styles.detailLabel}>{label}:</Text>
              <Text style={styles.detailValue}>{String(value)}</Text>
            </View>
          ))}
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendor Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{vendorDetails.fname} {vendorDetails.lname}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>License</Text>
              <Text style={styles.detailValue}>{vendorDetails.licenseNum} {vendorDetails.state} </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Company</Text>
              <Text style={styles.detailValue}>{vendorDetails.companyName}</Text>
            </View>
        </View>

        {/* ===== IMAGES ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Photos</Text>
          {sortedImgs.map((it, i) => (
            <View key={i}>
              <Image src={it.image} style={styles.image} />
              <Text style={{ ...styles.imgTag }}>{it.tag ?? ''}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
