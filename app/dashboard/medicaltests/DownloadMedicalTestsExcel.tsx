import ExcelJS from 'exceljs';

interface MedicalTest {
  id: number;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  iduom: number;
  idcategory: number;
  normalmin: number | null;
  normalmax: number | null;
}

export const downloadMedicalTestsExcel = async (tests: MedicalTest[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Medical Tests');

  worksheet.columns = [
    { header: 'Row Number', key: 'rowNumber', width: 12 },
    { header: 'Test Name', key: 'name', width: 30 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Unit', key: 'unit', width: 15 },
    { header: 'Normal Min', key: 'normalmin', width: 12 },
    { header: 'Normal Max', key: 'normalmax', width: 12 },
    { header: 'Description', key: 'description', width: 35 },
  ];

  tests.forEach((test, index) => {
    worksheet.addRow({
      rowNumber: index + 1,
      name: test.name,
      category: test.category,
      unit: test.unit,
      normalmin: test.normalmin ?? '',
      normalmax: test.normalmax ?? '',
      description: test.description ?? '',
    });
  });

  const maxNameLen = tests.length ? Math.max(...tests.map((t) => (t.name || '').length)) : 0;
  const nameCol = worksheet.getColumn('name');
  nameCol.width = Math.max(nameCol.width ?? 30, maxNameLen + 8, 30);

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MedicalTests.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
