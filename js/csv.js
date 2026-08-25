/**
 * CSV Bulk Data Processor for LabelPrint Studio
 * Parses CSV files and maps header columns into label template placeholders.
 */

class CSVProcessor {
  static parseCSV(text) {
    const lines = text.split(/\r\n|\n/);
    const result = [];
    let headers = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = this.parseCSVLine(line);
      if (i === 0 || headers.length === 0) {
        headers = values.map(h => h.trim());
      } else {
        const rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] !== undefined ? values[idx].trim() : '';
        });
        result.push(rowObj);
      }
    }
    return { headers, rows: result };
  }

  static parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  }

  /**
   * Applies a row data mapping onto label elements containing placeholders like {{Product Name}}, {{MRP}}
   */
  static applyDataToElements(elements, rowData) {
    return elements.map(el => {
      const elCopy = JSON.parse(JSON.stringify(el));
      if (elCopy.type === 'text' && elCopy.text) {
        elCopy.text = this.replacePlaceholders(elCopy.text, rowData);
      } else if (elCopy.type === 'barcode' && elCopy.value) {
        elCopy.value = this.replacePlaceholders(elCopy.value, rowData);
      } else if (elCopy.type === 'qrcode' && elCopy.value) {
        elCopy.value = this.replacePlaceholders(elCopy.value, rowData);
      }
      return elCopy;
    });
  }

  static replacePlaceholders(str, data) {
    if (!str || !data) return str;
    return str.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
      const trimmedKey = key.trim();
      return data[trimmedKey] !== undefined ? data[trimmedKey] : match;
    });
  }
}

window.CSVProcessor = CSVProcessor;
