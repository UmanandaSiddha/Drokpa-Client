"use client";

import { useState } from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";

interface InvoiceItem {
    name: string;
    description: string;
    quantity: number;
    rate: number;
    tax: number;
}

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
}

const DEMO_INVOICE: InvoiceData = {
    invoiceNumber: "INV-2026-00142",
    date: "March 4, 2026",
    dueDate: "March 18, 2026",
    items: [
        {
            name: "Yak Lodge Homestay - 3 Nights",
            description: "Cozy mountainside homestay with local family, includes meals and activities",
            quantity: 1,
            rate: 8500,
            tax: 1275,
        },
        {
            name: "Tawang Monastery Trek Guide",
            description: "Professional trek guide for 4-day high altitude trek including camping",
            quantity: 2,
            rate: 5000,
            tax: 1500,
        },
        {
            name: "Bomdila Town Tour",
            description: "Full-day guided cultural tour with lunch and local artisan visit",
            quantity: 1,
            rate: 3500,
            tax: 525,
        },
    ],
    subtotal: 22500,
    tax: 3300,
    total: 25800,
};

// PDF Styles
const pdfStyles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEAE0',
    },
    brandName: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: '#005246',
        marginBottom: 4,
    },
    brandSubtitle: {
        fontSize: 10,
        color: '#686766',
    },
    invoiceTitle: {
        fontSize: 10,
        color: '#686766',
        marginBottom: 4,
    },
    invoiceNumber: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: '#353030',
    },
    detailsGrid: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 9,
        color: '#686766',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
        fontFamily: 'Helvetica-Bold',
    },
    detailValue: {
        fontSize: 11,
        color: '#353030',
        fontFamily: 'Helvetica-Bold',
    },
    statusBadge: {
        backgroundColor: '#D1FAE5',
        color: '#047857',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        alignSelf: 'flex-start',
    },
    billSection: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEAE0',
    },
    billColumn: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 9,
        color: '#686766',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: 'Helvetica-Bold',
    },
    billName: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: '#353030',
        marginBottom: 4,
    },
    billInfo: {
        fontSize: 10,
        color: '#686766',
        marginBottom: 2,
    },
    table: {
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#EFEAE0',
        paddingBottom: 8,
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0EDE4',
        paddingVertical: 12,
    },
    colDescription: {
        flex: 3,
    },
    colQty: {
        flex: 1,
        textAlign: 'center',
    },
    colRate: {
        flex: 1,
        textAlign: 'right',
    },
    colAmount: {
        flex: 1,
        textAlign: 'right',
    },
    tableHeaderText: {
        fontSize: 9,
        color: '#686766',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'Helvetica-Bold',
    },
    itemName: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#353030',
        marginBottom: 3,
    },
    itemDescription: {
        fontSize: 9,
        color: '#686766',
    },
    itemText: {
        fontSize: 10,
        color: '#353030',
    },
    itemAmount: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#353030',
    },
    summary: {
        alignSelf: 'flex-end',
        width: '50%',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEAE0',
    },
    summaryLabel: {
        fontSize: 10,
        color: '#686766',
    },
    summaryValue: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#353030',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 82, 70, 0.08)',
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: '#353030',
    },
    totalValue: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: '#005246',
    },
    footer: {
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#EFEAE0',
        backgroundColor: '#FDFBF6',
        padding: 20,
    },
    footerText: {
        fontSize: 9,
        color: '#686766',
        textAlign: 'center',
        lineHeight: 1.4,
    },
});

// PDF Document Component
const InvoicePDF = ({ data }: { data: InvoiceData }) => (
    <Document>
        <Page size="A4" style={pdfStyles.page}>
            {/* Header */}
            <View style={pdfStyles.header}>
                <View>
                    <Text style={pdfStyles.brandName}>Drokpa</Text>
                    <Text style={pdfStyles.brandSubtitle}>Adventure Booking Platform</Text>
                </View>
                <View>
                    <Text style={pdfStyles.invoiceTitle}>Invoice</Text>
                    <Text style={pdfStyles.invoiceNumber}>{data.invoiceNumber}</Text>
                </View>
            </View>

            {/* Details Grid */}
            <View style={pdfStyles.detailsGrid}>
                <View style={pdfStyles.detailItem}>
                    <Text style={pdfStyles.detailLabel}>Invoice Date</Text>
                    <Text style={pdfStyles.detailValue}>{data.date}</Text>
                </View>
                <View style={pdfStyles.detailItem}>
                    <Text style={pdfStyles.detailLabel}>Due Date</Text>
                    <Text style={pdfStyles.detailValue}>{data.dueDate}</Text>
                </View>
                <View style={pdfStyles.detailItem}>
                    <Text style={pdfStyles.detailLabel}>Booking Reference</Text>
                    <Text style={[pdfStyles.detailValue, { color: '#005246' }]}>BK-26-0142</Text>
                </View>
                <View style={pdfStyles.detailItem}>
                    <Text style={pdfStyles.detailLabel}>Status</Text>
                    <Text style={pdfStyles.statusBadge}>Confirmed</Text>
                </View>
            </View>

            {/* Bill To/From */}
            <View style={pdfStyles.billSection}>
                <View style={pdfStyles.billColumn}>
                    <Text style={pdfStyles.sectionTitle}>Bill To</Text>
                    <Text style={pdfStyles.billName}>Sarah Anderson</Text>
                    <Text style={pdfStyles.billInfo}>sarah.anderson@email.com</Text>
                    <Text style={pdfStyles.billInfo}>+1 (555) 123-4567</Text>
                </View>
                <View style={pdfStyles.billColumn}>
                    <Text style={pdfStyles.sectionTitle}>From</Text>
                    <Text style={pdfStyles.billName}>Drokpa Adventures</Text>
                    <Text style={pdfStyles.billInfo}>Arunachal Pradesh, India</Text>
                    <Text style={pdfStyles.billInfo}>hello@drokpa.com</Text>
                </View>
            </View>

            {/* Items Table */}
            <View style={pdfStyles.table}>
                <View style={pdfStyles.tableHeader}>
                    <Text style={[pdfStyles.tableHeaderText, pdfStyles.colDescription]}>Description</Text>
                    <Text style={[pdfStyles.tableHeaderText, pdfStyles.colQty]}>Qty</Text>
                    <Text style={[pdfStyles.tableHeaderText, pdfStyles.colRate]}>Rate</Text>
                    <Text style={[pdfStyles.tableHeaderText, pdfStyles.colAmount]}>Amount</Text>
                </View>
                {data.items.map((item, index) => (
                    <View key={index} style={pdfStyles.tableRow}>
                        <View style={pdfStyles.colDescription}>
                            <Text style={pdfStyles.itemName}>{item.name}</Text>
                            <Text style={pdfStyles.itemDescription}>{item.description}</Text>
                        </View>
                        <Text style={[pdfStyles.itemText, pdfStyles.colQty]}>{item.quantity}</Text>
                        <Text style={[pdfStyles.itemText, pdfStyles.colRate]}>₹{item.rate.toLocaleString()}</Text>
                        <Text style={[pdfStyles.itemAmount, pdfStyles.colAmount]}>
                            ₹{(item.rate * item.quantity).toLocaleString()}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Summary */}
            <View style={pdfStyles.summary}>
                <View style={pdfStyles.summaryRow}>
                    <Text style={pdfStyles.summaryLabel}>Subtotal</Text>
                    <Text style={pdfStyles.summaryValue}>₹{data.subtotal.toLocaleString()}</Text>
                </View>
                <View style={pdfStyles.summaryRow}>
                    <Text style={pdfStyles.summaryLabel}>Tax (GST 18%)</Text>
                    <Text style={pdfStyles.summaryValue}>₹{data.tax.toLocaleString()}</Text>
                </View>
                <View style={pdfStyles.totalRow}>
                    <Text style={pdfStyles.totalLabel}>Total Amount</Text>
                    <Text style={pdfStyles.totalValue}>₹{data.total.toLocaleString()}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={pdfStyles.footer}>
                <Text style={pdfStyles.footerText}>
                    Thank you for choosing Drokpa Adventures! We're excited to welcome you to Arunachal Pradesh.{'\n'}
                    For questions, contact us at hello@drokpa.com or call +91-XXXX-XXXX.
                </Text>
            </View>
        </Page>
    </Document>
);

export default function InvoiceClient() {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const blob = await pdf(<InvoicePDF data={DEMO_INVOICE} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice-${DEMO_INVOICE.invoiceNumber}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download invoice:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFBF6]">
            {/* Hero Section */}
            <section className="relative pt-20 sm:pt-28 md:pt-36 pb-12 sm:pb-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ backgroundColor: 'rgba(0, 82, 70, 0.08)', filter: "blur(48px)" }} />
                    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{ backgroundColor: 'rgba(252, 97, 30, 0.08)', filter: "blur(48px)" }} />
                </div>

                <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-8 bg-[#005246] rounded-sm" />
                            <span
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    color: "#005246",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.15em",
                                }}
                            >
                                Invoice
                            </span>
                        </div>

                        <h1
                            style={{
                                fontFamily: "var(--font-subjectivity), sans-serif",
                                fontWeight: 700,
                                fontSize: "clamp(44px, 9vw, 96px)",
                                color: "#353030",
                                lineHeight: "clamp(48px, 10vw, 104px)",
                                letterSpacing: "-0.07em",
                            }}
                        >
                            Your Adventure <span className="text-[#005246]">Receipt</span>
                        </h1>

                        <p
                            className="mt-6 sm:mt-8 max-w-2xl"
                            style={{
                                fontFamily: "var(--font-mona-sans)",
                                fontWeight: 400,
                                fontSize: "clamp(16px, 3.5vw, 20px)",
                                color: "#686766",
                                lineHeight: "clamp(24px, 5vw, 32px)",
                            }}
                        >
                            Download and save your booking confirmation. This invoice details everything about your upcoming Arunachal Pradesh experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Invoice Container */}
            <section className="py-12 sm:py-16 md:py-20">
                <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    {/* Download Button */}
                    <div className="mb-8 flex justify-start sm:justify-end">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#005246] text-white hover:bg-[#004236] disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                            style={{ fontFamily: "var(--font-mona-sans)" }}
                        >
                            <Download className="w-4 h-4" />
                            {isDownloading ? "Generating..." : "Download Invoice"}
                        </button>
                    </div>

                    {/* Invoice */}
                    <div
                        data-invoice-content
                        className="invoice-container max-w-4xl mx-auto rounded-3xl border border-[#EFEAE0] overflow-hidden"
                        style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.08)", backgroundColor: '#ffffff' }}
                    >
                        {/* Invoice Header */}
                        <div className="relative pt-12 pb-8 px-8 sm:px-12 border-b border-[#EFEAE0]">
                            {/* Background Decoration */}
                            <div className="absolute inset-0 -z-10">
                                <div
                                    className="absolute top-0 right-0 w-64 h-64 rounded-full blur-2xl"
                                    // style={{ background: 'radial-gradient(circle, rgba(0, 82, 70, 0.05) 0%, transparent 70%)' }}
                                    style={{
                                        backgroundColor: "rgba(0,82,70,0.05)",
                                        filter: "blur(40px)"
                                    }}
                                />
                            </div>

                            <div className="flex items-start justify-between gap-6">
                                {/* Logo/Brand */}
                                <div className="flex-1">
                                    <div
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            fontSize: "32px",
                                            color: "#005246",
                                            letterSpacing: "-0.05em",
                                        }}
                                    >
                                        Drokpa
                                    </div>
                                    <p
                                        className="mt-1 text-sm text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        Adventure Booking Platform
                                    </p>
                                </div>

                                {/* Invoice Info */}
                                <div className="text-right">
                                    <p
                                        className="text-sm text-[#686766] mb-2"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        Invoice
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            fontSize: "20px",
                                            color: "#353030",
                                            letterSpacing: "-0.04em",
                                        }}
                                    >
                                        {DEMO_INVOICE.invoiceNumber}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="px-8 sm:px-12 py-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                                <div>
                                    <p
                                        className="text-xs text-[#686766] mb-1 uppercase tracking-wider"
                                        style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                                    >
                                        Invoice Date
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 600,
                                            color: "#353030",
                                        }}
                                    >
                                        {DEMO_INVOICE.date}
                                    </p>
                                </div>
                                <div>
                                    <p
                                        className="text-xs text-[#686766] mb-1 uppercase tracking-wider"
                                        style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                                    >
                                        Due Date
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 600,
                                            color: "#353030",
                                        }}
                                    >
                                        {DEMO_INVOICE.dueDate}
                                    </p>
                                </div>
                                <div>
                                    <p
                                        className="text-xs text-[#686766] mb-1 uppercase tracking-wider"
                                        style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                                    >
                                        Booking Reference
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 600,
                                            color: "#005246",
                                        }}
                                    >
                                        BK-26-0142
                                    </p>
                                </div>
                                <div>
                                    <p
                                        className="text-xs text-[#686766] mb-1 uppercase tracking-wider"
                                        style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                                    >
                                        Status
                                    </p>
                                    <p
                                        className="text-sm font-medium px-3 py-1 rounded-full w-fit"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            backgroundColor: 'rgb(209, 250, 229)',
                                            color: 'rgb(4, 120, 87)'
                                        }}
                                    >
                                        Confirmed
                                    </p>
                                </div>
                            </div>

                            {/* Bill To */}
                            <div className="grid md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-[#EFEAE0]">
                                <div>
                                    <p
                                        className="text-xs text-[#686766] mb-3 uppercase tracking-wider"
                                        style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                                    >
                                        Bill To
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            fontSize: "18px",
                                            color: "#353030",
                                            letterSpacing: "-0.03em",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        Sarah Anderson
                                    </p>
                                    <p
                                        className="text-sm text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        sarah.anderson@email.com
                                    </p>
                                    <p
                                        className="text-sm text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        +1 (555) 123-4567
                                    </p>
                                </div>

                                <div>
                                    <p
                                        className="text-xs text-[#686766] mb-3 uppercase tracking-wider"
                                        style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                                    >
                                        From
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            fontSize: "18px",
                                            color: "#353030",
                                            letterSpacing: "-0.03em",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        Drokpa Adventures
                                    </p>
                                    <p
                                        className="text-sm text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        Arunachal Pradesh, India
                                    </p>
                                    <p
                                        className="text-sm text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        hello@drokpa.com
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mb-10">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-[#EFEAE0]">
                                            <th
                                                className="text-left py-3 px-2"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 700,
                                                    fontSize: "12px",
                                                    color: "#686766",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                }}
                                            >
                                                Description
                                            </th>
                                            <th
                                                className="text-center py-3 px-2"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 700,
                                                    fontSize: "12px",
                                                    color: "#686766",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                }}
                                            >
                                                Qty
                                            </th>
                                            <th
                                                className="text-right py-3 px-2"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 700,
                                                    fontSize: "12px",
                                                    color: "#686766",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                }}
                                            >
                                                Rate
                                            </th>
                                            <th
                                                className="text-right py-3 px-2"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 700,
                                                    fontSize: "12px",
                                                    color: "#686766",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                }}
                                            >
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {DEMO_INVOICE.items.map((item, index) => (
                                            <tr key={index} className="border-b border-[#F0EDE4]">
                                                <td className="py-4 px-2">
                                                    <p
                                                        style={{
                                                            fontFamily: "var(--font-mona-sans)",
                                                            fontWeight: 600,
                                                            color: "#353030",
                                                            marginBottom: "0.25rem",
                                                        }}
                                                    >
                                                        {item.name}
                                                    </p>
                                                    <p
                                                        className="text-sm text-[#686766]"
                                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                                    >
                                                        {item.description}
                                                    </p>
                                                </td>
                                                <td
                                                    className="text-center py-4 px-2"
                                                    style={{ fontFamily: "var(--font-mona-sans)", color: "#353030" }}
                                                >
                                                    {item.quantity}
                                                </td>
                                                <td
                                                    className="text-right py-4 px-2"
                                                    style={{ fontFamily: "var(--font-mona-sans)", color: "#353030" }}
                                                >
                                                    ₹{item.rate.toLocaleString()}
                                                </td>
                                                <td
                                                    className="text-right py-4 px-2"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 600,
                                                        color: "#353030",
                                                    }}
                                                >
                                                    ₹{(item.rate * item.quantity).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="flex justify-end">
                                <div className="w-full md:w-96">
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-[#EFEAE0]">
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    color: "#686766",
                                                }}
                                            >
                                                Subtotal
                                            </p>
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 600,
                                                    color: "#353030",
                                                }}
                                            >
                                                ₹{DEMO_INVOICE.subtotal.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center pb-3 border-b border-[#EFEAE0]">
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    color: "#686766",
                                                }}
                                            >
                                                Tax (GST 18%)
                                            </p>
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 600,
                                                    color: "#353030",
                                                }}
                                            >
                                                ₹{DEMO_INVOICE.tax.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center p-4 rounded-2xl" style={{ backgroundColor: 'rgba(0, 82, 70, 0.08)' }}>
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                                    fontWeight: 700,
                                                    fontSize: "16px",
                                                    color: "#353030",
                                                    letterSpacing: "-0.03em",
                                                }}
                                            >
                                                Total Amount
                                            </p>
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                                    fontWeight: 700,
                                                    fontSize: "20px",
                                                    color: "#005246",
                                                    letterSpacing: "-0.04em",
                                                }}
                                            >
                                                ₹{DEMO_INVOICE.total.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Footer */}
                        <div className="px-8 sm:px-12 py-8 border-t border-[#EFEAE0] bg-[#FDFBF6]">
                            <p
                                className="text-sm text-[#686766] text-center"
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            >
                                Thank you for choosing Drokpa Adventures! We're excited to welcome you to Arunachal Pradesh.
                                For questions, contact us at hello@drokpa.com or call +91-XXXX-XXXX.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
