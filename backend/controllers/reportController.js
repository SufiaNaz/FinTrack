const Transaction = require("../models/Transaction");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

exports.getReport = async (req, res) => {
    const { period } = req.params;
    try {
        const { start, end, type } = parsePeriod(period);
        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });

        const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

        const categoryBreakdown = {};
        transactions.filter((t) => t.type === "expense").forEach((t) => {
            categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
        });

        res.status(200).json({ period, type, totalIncome: income, totalExpense: expense, netSavings: income - expense, categoryBreakdown, transactions });
    } catch (err) {
        res.status(500).json({ message: "Error generating report", error: err.message });
    }
};

exports.exportReport = async (req, res) => {
    const { period, format } = req.body;
    if (!period || !format) return res.status(400).json({ message: "period and format are required" });
    if (!["excel", "pdf"].includes(format)) return res.status(400).json({ message: "format must be excel or pdf" });

    try {
        const { start, end } = parsePeriod(period);
        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });

        if (format === "excel") {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Transactions");
            sheet.columns = [
                { header: "Date",        key: "date",        width: 15 },
                { header: "Type",        key: "type",        width: 10 },
                { header: "Category",    key: "category",    width: 20 },
                { header: "Amount",      key: "amount",      width: 12 },
                { header: "Description", key: "description", width: 30 },
            ];
            transactions.forEach((t) => {
                sheet.addRow({
                    date:        new Date(t.date).toLocaleDateString(),
                    type:        t.type,
                    category:    t.category,
                    amount:      t.amount,
                    description: t.description || "",
                });
            });
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=FinTrack_${period}.xlsx`);
            await workbook.xlsx.write(res);
            return res.end();
        }

        if (format === "pdf") {
            const doc = new PDFDocument({ margin: 40 });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=FinTrack_${period}.pdf`);
            doc.pipe(res);
            doc.fontSize(18).text(`FinTrack Report — ${period}`, { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Total Transactions: ${transactions.length}`);
            doc.moveDown();
            transactions.forEach((t) => {
                doc.fontSize(10).text(
                    `${new Date(t.date).toLocaleDateString()} | ${t.type.toUpperCase()} | ${t.category} | Rs.${t.amount} | ${t.description || "-"}`
                );
            });
            return doc.end();
        }
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ message: "Error exporting report", error: err.message });
        }
    }
};

function parsePeriod(period) {
    if (/^\d{4}-\d{2}$/.test(period)) {
        const [year, month] = period.split("-").map(Number);
        return { start: new Date(year, month - 1, 1), end: new Date(year, month, 0, 23, 59, 59), type: "monthly" };
    }
    if (/^\d{4}$/.test(period)) {
        const year = Number(period);
        return { start: new Date(year, 0, 1), end: new Date(year, 11, 31, 23, 59, 59), type: "yearly" };
    }
    throw new Error("Invalid period format. Use YYYY-MM or YYYY.");
}
