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
    justifyContent: 'space-between',
  },
  logo: { 
    width: 200, 
    height: 50, 
    marginRight: 5
  },
  titleBlock: {
    flexGrow: 1,
    alignItems: 'flex-end',
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
    textAlign: 'right',
  },

  /* ===== SECTIONS ===== */
  section: {
    marginTop: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
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
  detailAddress: {
    color: '#000000',
    fontSize: 12,
    marginTop: 2,
  },

  /* nicer info rows */
  infoBlock: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#f5f7fb',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222222',
  },
  infoValue: {
    fontSize: 13,
    color: '#333333',
    marginLeft: 12,
    flexShrink: 1,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 13,
    color: '#333333',
    backgroundColor: '#f5f7fb',
    marginTop: 4,
    lineHeight: 1.4,
  },

  /* text + image styles */
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
    borderRadius: 8,
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
    fontSize: 20,
    fontWeight: 600,
    color: '#000000', 
    marginBottom: 6, 
    marginTop: 2,
  },
  ratingBox: {
    marginTop: 25,
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

  // ---- image sorting (unchanged) ----
  let sortedImgs = images.map((img, i) => ({ image: img, tag: tags?.[i] ?? '', idx: i }));
  const priority: Record<string, number> = {
    Front: 1,
    'Left Side': 2,
    'Right Side': 3,
    'Street Left': 4,
    'Street Right': 5,
    Address: 6,
    'Across the Street': 7,
    'Street Sign': 8,
  };
  sortedImgs.sort((a, b) => {
    const priA = priority[a.tag] ?? 99;
    const priB = priority[b.tag] ?? 99;
    if (priA !== priB) return priA - priB;
    return a.idx - b.idx;
  });

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
  const gl = (k: string) => {
    const v = parsedData?.[k];
    if (Array.isArray(v)) return v.join(', ');
    return v ?? 'N/A';
  };

  // Prefer inspection date from the form, fall back to requestedDueDate
  const inspectionDate =
    gv('date') !== 'N/A'
      ? gv('date')
      : orderDetails?.requestedDueDate || 'N/A';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===== TOP BAR ===== */}
        <View style={styles.topBar}>
          {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : <View style={styles.logo} />}
          <View style={styles.titleBlock}>
            <Text style={styles.reportTitle}>Property Condition Report</Text>
            <Text style={styles.detailAddress}>
              {orderDetails?.propertyAddress || 'N/A'}{' '}
              {(orderDetails?.propertyCity || 'N/A') +
                ', ' +
                (orderDetails?.propertyState || 'N/A') +
                ' ' +
                (orderDetails?.propertyZip || 'N/A')}
            </Text>
          </View>
        </View>

        {/* ===== RATING + FRONT PHOTO ===== */}
        <View style={styles.splitRow}>
          {/* Rating card */}
          <View style={[styles.card, styles.half, { padding: 5 }]}>
            <Text style={styles.ratingHeader}>Property Rating</Text>
            <View style={styles.ratingBox}>
              <Text style={[styles.pill, { backgroundColor: palette.bg, color: palette.fg }]}>
                {rLabel}
              </Text>
            </View>
            <View style={{ marginTop: 55 }}>
              <Text style={{ fontSize: 10, color: '#555' }}>
                Type: {gv('propertyType')} • Stories: {gv('stories')}
              </Text>
              <Text style={{ fontSize: 10, color: '#555', marginTop: 2 }}>
                Condition: {gv('subjectCondition')}
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

        {/* ===== PROPERTY INFORMATION (BASIC FACTS) ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Classification</Text>
              <Text style={styles.infoValue}>{gv('propertyType') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Property Type</Text>
              <Text style={styles.infoValue}>{gl('items') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Stories</Text>
              <Text style={styles.infoValue}>{gv('stories') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Occupancy</Text>
              <Text style={styles.infoValue}>{gv('occupancy') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Occupied By</Text>
              <Text style={styles.infoValue}>{gv('occupiedBy') || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* ===== PROPERTY CONDITION ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Condition</Text>
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>General Condition</Text>
              <Text style={styles.infoValue}>{gv('subjectCondition') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Neighborhood Condition</Text>
              <Text style={styles.infoValue}>{gv('neighborhoodCondition') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Neighborhood Conformity</Text>
              <Text style={styles.infoValue}>{gv('neighborhoodConformity') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>View Factors / Structural Issues</Text>
              <Text style={styles.infoValue}>{gl('viewFactors') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Common Elements</Text>
              <Text style={styles.infoValue}>{gv('commonElements') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Items Present</Text>
              <Text style={styles.infoValue}>{gl('signage') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Comment</Text>
              <Text style={styles.infoValue}>{gv('signageComment') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Damage To Property</Text>
              <Text style={styles.infoValue}>{gl('neighborhood') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Structural Issues Comment</Text>
              <Text style={styles.infoValue}>{gv('structuralComment') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Detached Structures</Text>
              <Text style={styles.infoValue}>{gv('detachStructures') || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Inspection Date</Text>
              <Text style={styles.infoValue}>{inspectionDate || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* ===== ADDITIONAL NOTES ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.notesText}>
            {gv('notes') || "N/A"}
          </Text>
        </View>

        {/* ===== VENDOR INFORMATION ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendor Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>
              {vendorDetails.fname} {vendorDetails.lname}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>License</Text>
            <Text style={styles.detailValue}>
              {vendorDetails.licenseNum} {vendorDetails.state}
            </Text>
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
