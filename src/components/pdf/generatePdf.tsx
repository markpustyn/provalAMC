import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 22,
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
    marginRight: 5,
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
    marginTop: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: 'semibold',
    color: '#000000',
    backgroundColor: '#dddddd',
    paddingLeft: 6,
  },

  photoTitle: {
    fontSize: 15,
    marginBottom: 21,
    marginTop: 6,
    fontWeight: 'semibold',
    color: '#000000',
    backgroundColor: '#dddddd',
    paddingLeft: 6,
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
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#222222',
    width: '65%',
  },

  infoValue: {
    fontSize: 12,
    color: '#333333',
    width: '35%',
    textAlign: 'right',
    flexWrap: 'wrap',
  },

  notesText: {
    fontSize: 12,
    color: '#333333',
    marginTop: 4,
    lineHeight: 1.3,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.3,
  },
  disclaimerTitle: {
    fontSize: 10,
    marginBottom: 6,
    color: '#000000',
    backgroundColor: '#dddddd',
    paddingLeft: 6,
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

  spacerGrow: {
    flexGrow: 1,
  },
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
  "No Potential Risks Noted": {
    bg: "#E6F4EA", // light green
    fg: "#1E7B34", // green text
  },
  "Potential Risks Identified": {
    bg: "#FFF9E6", // light yellow
    fg: "#8A6D1D", // yellow brown text
  },
  Unknown: {
    bg: "#EEEEEE",
    fg: "#555555",
  },
}
  const palette = colorMap[rLabel] || colorMap.Unknown;

  const gv = (k: string) => (parsedData?.[k] ?? 'N/A');
  const gl = (k: string) => {
    const v = parsedData?.[k];
    if (Array.isArray(v)) return v.join(', ');
    return v ?? 'N/A';
  };

  // Prefer inspection date from the form, fall back to requestedDueDate
  const inspectionDate =
    gv('date') !== 'N/A' ? gv('date') : orderDetails?.requestedDueDate || 'N/A';

  const TopHeader = () => (
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
  );

  return (
    <Document>
      {/* PAGE 1: Title + Property Information + Property Condition */}
      <Page size="A4" style={styles.page}>
        <TopHeader />

        {/* ===== RATING + FRONT PHOTO ===== */}
        <View style={styles.splitRow}>
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
                {gv('subjectCondition')}
              </Text>
            </View>
          </View>

          <View style={[styles.card, styles.half]}>
            <Image src={sortedImgs[0]?.image} style={styles.frontImage} />
          </View>
        </View>

        {/* Keep these on page 1 */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Classification</Text>
              <Text style={styles.infoValue}>{gv('propertyUse') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Property Type</Text>
              <Text style={styles.infoValue}>{gv('propertyType') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Stories</Text>
              <Text style={styles.infoValue}>{gv('stories') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Occupancy</Text>
              <Text style={styles.infoValue}>{gv('occupancy') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Occupied By</Text>
              <Text style={styles.infoValue}>{gv('occupiedBy') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Inspection Date</Text>
              <Text style={styles.infoValue}>{inspectionDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Property Condition</Text>
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>General Condition</Text>
              <Text style={styles.infoValue}>{gv('subjectCondition') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Significant Damages</Text>
              <Text style={styles.infoValue}>{gv('significantDamages') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Neighborhood Condition</Text>
              <Text style={styles.infoValue}>{gv('neighborhoodCondition') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Neighborhood Conformity</Text>
              <Text style={styles.infoValue}>{gv('neighborhoodConformity') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Structural Issues</Text>
              <Text style={styles.infoValue}>{gl('structuralIssues') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Structural Issues Notes</Text>
              <Text style={styles.infoValue}>{gv('structuralIssuesNotes') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Items Present</Text>
              <Text style={styles.infoValue}>{gl('signage') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Items Present Notes</Text>
              <Text style={styles.infoValue}>{gv('signageNotes') || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Detached Structures</Text>
              <Text style={styles.infoValue}>{gv('detachStructures') || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* This empty space gives room for Property Condition to grow */}
        <View style={styles.spacerGrow} />
      </Page>

      {/* PAGE 2: Additional Notes + Vendor Information (always starts here) */}
      <Page size="A4" style={styles.page}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.notesText}>{gv('notes') || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendor Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>
              {vendorDetails?.fname} {vendorDetails?.lname}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>License</Text>
            <Text style={styles.detailValue}>
              {vendorDetails?.licenseNum} {vendorDetails?.state}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Company</Text>
            <Text style={styles.detailValue}>{vendorDetails?.companyName}</Text>
          </View>
        </View>

        {/* Images keep same styling and can continue to next pages naturally */}
        <View style={styles.section}>
          <Text style={styles.photoTitle}>Property Photos</Text>
          {sortedImgs.map((it, i) => (
            <View key={i}>
              <Image src={it.image} style={styles.image} />
              <Text style={{ ...styles.imgTag }}>{it.tag ?? ''}</Text>
            </View>
          ))}
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
  <View style={styles.section}>
    <Text style={styles.disclaimerTitle}>Disclaimer</Text>
    <Text style={styles.disclaimerText}>
This Property Condition Report is based on a limited exterior only visual inspection performed in accordance with the agreed scope of work. The inspection is not a full property inspection and should not be relied upon to identify all defects or conditions.

The report does not evaluate life expectancy of components, latent defects, construction quality, or internal systems. No assessment is made of structural integrity, foundation, roof systems, electrical systems, mechanical systems, plumbing systems, environmental conditions, or code compliance.

Observations are limited to conditions visible at the time of inspection without the use of tools, testing, disassembly, or entry into the interior of the property.

This report is intended solely to assist the client in making property related decisions within applicable regulatory requirements. It is prepared exclusively for the use of the client identified in the report and may not be relied upon by any other party.

Reproduction or distribution of this report without written authorization is prohibited.
    </Text>
  </View>

      </Page>
    </Document>
  );
};
