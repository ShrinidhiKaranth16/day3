// utils/exportUtils.ts
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCSV(data: any[], filename: string) {
  const csvHeader = Object.keys(data[0]).join(",") + "\n";
  const csvRows = data.map((row) =>
    Object.values(row)
      .map((val) => `"${val}"`)
      .join(",")
  );
  const csvContent = csvHeader + csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}.csv`);
}

export function exportPDF(data: any[], filename: string, title: string) {
  const doc = new jsPDF();
  doc.text(title, 14, 16);
  autoTable(doc, {
    startY: 20,
    head: [Object.keys(data[0])],
    body: data.map((row) => Object.values(row)),
  });
  doc.save(`${filename}.pdf`);
}
