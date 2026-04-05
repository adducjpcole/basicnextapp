import ExcelJS from 'exceljs';

interface TestCategory {
  id: number;
  name: string;
  description: string | null;
}

export const downloadTestCategoriesExcel = async (categories: TestCategory[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Test Categories');

  worksheet.columns = [
    { header: 'Row Number', key: 'rowNumber', width: 12 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Description', key: 'description', width: 40 },
  ];

  categories.forEach((cat, index) => {
    worksheet.addRow({
      rowNumber: index + 1,
      name: cat.name,
      description: cat.description ?? '',
    });
  });

  const maxNameLen = categories.length
    ? Math.max(...categories.map((c) => (c.name || '').length))
    : 0;
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
  a.download = 'TestCategories.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
