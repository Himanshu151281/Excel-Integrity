import xlsx from 'xlsx';
import { sheetConfigs } from '../config/validation.js';

export function validateExcelFile(buffer) {
  const workbook = xlsx.read(buffer);
  const results = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    const config = sheetConfigs[sheetName] || sheetConfigs.default;
    const { validRows, errors } = validateSheet(data, config, sheetName);

    results.push({
      name: sheetName,
      data: validRows,
      errors
    });
  }

  return results;
}

function validateSheet(data, config, sheetName) {
  const validRows = [];
  const errors = [];

  data.forEach((row, index) => {
    const rowErrors = validateRow(row, config.columns);
    
    if (rowErrors.length > 0) {
      errors.push(...rowErrors.map(error => ({
        sheet: sheetName,
        row: index + 2, // Add 2 to account for header row and 0-based index
        message: error
      })));
    } else {
      validRows.push({
        id: crypto.randomUUID(),
        ...row
      });
    }
  });

  return { validRows, errors };
}

function validateRow(row, columnConfig) {
  const errors = [];

  for (const [field, config] of Object.entries(columnConfig)) {
    const value = row[field];

    if (config.required && (value === undefined || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value !== undefined && value !== '') {
      if (config.type === 'number' && (isNaN(value) || typeof value !== 'number')) {
        errors.push(`${field} must be a number`);
      }

      if (config.type === 'date' && isNaN(new Date(value).getTime())) {
        errors.push(`${field} must be a valid date`);
      }

      if (config.validate && !config.validate(value)) {
        errors.push(`${field} validation failed`);
      }
    }
  }

  return errors;
}