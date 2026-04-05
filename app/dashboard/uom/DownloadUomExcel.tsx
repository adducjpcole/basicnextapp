import ExcelJS from 'exceljs';

interface Uom {
  id: number;
  name: string;
  description: string | null;
}

export const downloadUomExcel = async (uoms: Uom[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Units of Measure');

  worksheet.columns = [
    { header: 'Row Number', key: 'rowNumber', width: 12 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Description', key: 'description', width: 40 },
  ];

  uoms.forEach((uom, index) => {
    worksheet.addRow({
      rowNumber: index + 1,
      name: uom.name,
      description: uom.description ?? '',
    });
  });

  const maxNameLen = uoms.length ? Math.max(...uoms.map((u) => (u.name || '').length)) : 0;
  const nameCol = worksheet.getColumn('name');
  nameCol.width = Math.max(nameCol.width ?? 20, maxNameLen + 8, 20);

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'UnitsOfMeasure.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
