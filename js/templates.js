/**
 * Template Manager for LabelPrint Studio
 * Handles default starter templates, export/import JSON, and saving user templates.
 */

const DEFAULT_TEMPLATES = [
  {
    id: "tpl_default_hardware",
    name: "Hardware / Lock Product Label",
    description: "Sample product label with barcode, price, GST and branding",
    paper: {
      name: "A4",
      width: 210,
      height: 297
    },
    label: {
      width: 63.5,
      height: 38.1,
      rows: 7,
      columns: 3,
      topMargin: 15.15,
      leftMargin: 9.75,
      horizontalGap: 0,
      verticalGap: 0,
      cornerRadius: 2
    },
    applyToAll: true,
    elements: [
      {
        id: "el_brand",
        type: "text",
        text: "NAFI LOCK INDUSTRIES",
        x: 3,
        y: 2.5,
        width: 57.5,
        height: 5,
        fontSize: 10,
        fontFamily: "Arial",
        fontWeight: "bold",
        fontStyle: "normal",
        textAlign: "center",
        color: "#111827",
        letterSpacing: 0.5,
        lineHeight: 1,
        rotation: 0
      },
      {
        id: "el_product",
        type: "text",
        text: "HEAVY DUTY PADLOCK 70 MM",
        x: 3,
        y: 8,
        width: 57.5,
        height: 4.5,
        fontSize: 8.5,
        fontFamily: "Arial",
        fontWeight: "bold",
        fontStyle: "normal",
        textAlign: "center",
        color: "#1e3a8a",
        letterSpacing: 0,
        lineHeight: 1,
        rotation: 0
      },
      {
        id: "el_price_gst",
        type: "text",
        text: "MRP ₹250  |  GST 18%",
        x: 3,
        y: 13.5,
        width: 57.5,
        height: 4,
        fontSize: 8,
        fontFamily: "Arial",
        fontWeight: "bold",
        fontStyle: "normal",
        textAlign: "center",
        color: "#047857",
        letterSpacing: 0,
        lineHeight: 1,
        rotation: 0
      },
      {
        id: "el_barcode",
        type: "barcode",
        barcodeType: "CODE128",
        value: "ABC-70",
        x: 4,
        y: 18,
        width: 38,
        height: 12,
        displayValue: true
      },
      {
        id: "el_qrcode",
        type: "qrcode",
        value: "https://nafilocks.com/item/ABC-70",
        x: 45,
        y: 18,
        width: 14,
        height: 14
      },
      {
        id: "el_code",
        type: "text",
        text: "CODE: ABC-70",
        x: 3,
        y: 33,
        width: 57.5,
        height: 3.5,
        fontSize: 7.5,
        fontFamily: "monospace",
        fontWeight: "normal",
        fontStyle: "normal",
        textAlign: "center",
        color: "#374151",
        letterSpacing: 0,
        lineHeight: 1,
        rotation: 0
      }
    ]
  },
  {
    id: "tpl_simple_address",
    name: "Standard Shipping Address Label",
    description: "Sender & Recipient address label for 21-up A4 sheet",
    paper: { name: "A4", width: 210, height: 297 },
    label: {
      width: 63.5,
      height: 38.1,
      rows: 7,
      columns: 3,
      topMargin: 15.15,
      leftMargin: 9.75,
      horizontalGap: 0,
      verticalGap: 0,
      cornerRadius: 2
    },
    applyToAll: true,
    elements: [
      {
        id: "el_to",
        type: "text",
        text: "TO:",
        x: 4,
        y: 3,
        width: 15,
        height: 4,
        fontSize: 9,
        fontFamily: "Arial",
        fontWeight: "bold",
        textAlign: "left",
        color: "#000000"
      },
      {
        id: "el_address",
        type: "text",
        text: "John Doe\n123 Business Way, Suite 400\nMetropolis, NY 10001",
        x: 4,
        y: 8,
        width: 55,
        height: 18,
        fontSize: 9,
        fontFamily: "Arial",
        fontWeight: "normal",
        textAlign: "left",
        color: "#1f2937",
        lineHeight: 1.2
      },
      {
        id: "el_ship_qr",
        type: "qrcode",
        value: "SHIP-NY-10001-99823",
        x: 46,
        y: 3,
        width: 13,
        height: 13
      }
    ]
  }
];

class TemplateManager {
  static getStarterTemplates() {
    return DEFAULT_TEMPLATES;
  }

  static exportTemplateAsJSON(templateData) {
    const jsonStr = JSON.stringify(templateData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(templateData.name || 'label_template').replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static parseImportedJSON(fileContent) {
    try {
      const data = JSON.parse(fileContent);
      if (!data.label || !data.elements) {
        throw new Error('Invalid template schema. Missing label configuration or elements array.');
      }
      return data;
    } catch (err) {
      console.error('Error importing template:', err);
      alert('Failed to parse template file: ' + err.message);
      return null;
    }
  }
}

window.DEFAULT_TEMPLATES = DEFAULT_TEMPLATES;
window.TemplateManager = TemplateManager;
