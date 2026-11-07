// API de trazabilidad - Google Sheets
// 1. Ejecuta setup() una vez y autoriza los permisos.
// 2. Implementa como aplicacion web (ejecutar como yo, acceso: cualquier persona).
// 3. Copia la URL /exec y el TOKEN.
var SHEET_NAME = 'Registros';
var TOKEN_PROP = 'ADMIN_TOKEN';

var HEADERS = [
  'id',
  'createdAt',
  'updatedAt',
  'fechaPrestamo',
  'horaPrestamo',
  'tipoUsuario',
  'quienSolicita',
  'programa',
  'correo',
  'nombreEquipo',
  'cantidad',
  'obsPrestamo',
  'fechaDevolucion',
  'horaDevolucion',
  'estadoLimpieza',
  'obsDevolucion'
];

var TEXT_COLUMNS = [
  'createdAt',
  'updatedAt',
  'fechaPrestamo',
  'horaPrestamo',
  'fechaDevolucion',
  'horaDevolucion'
];

function applyTextFormats_(sheet) {
  var rows = Math.max(sheet.getLastRow() - 1, 1);
  TEXT_COLUMNS.forEach(function (name) {
    var index = HEADERS.indexOf(name) + 1;
    if (index > 0) {
      sheet.getRange(2, index, rows, 1).setNumberFormat('@');
    }
  });
}

function writeRow_(sheet, rowIndex, record) {
  if (rowIndex > sheet.getMaxRows()) {
    sheet.insertRowAfter(sheet.getMaxRows());
  }

  TEXT_COLUMNS.forEach(function (name) {
    var index = HEADERS.indexOf(name) + 1;
    if (index > 0) {
      sheet.getRange(rowIndex, index).setNumberFormat('@');
    }
  });

  sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([recordToRow_(record)]);
}

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0B2A6B')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
  }

  applyTextFormats_(sheet);

  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty(TOKEN_PROP);

  if (!token) {
    token = Utilities.getUuid().replace(/-/g, '');
    props.setProperty(TOKEN_PROP, token);
  }

  Logger.log('TOKEN: ' + token);
  Logger.log('HOJA: ' + ss.getUrl());
  return token;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0B2A6B')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  applyTextFormats_(sheet);
  return sheet;
}

function getToken_() {
  return PropertiesService.getScriptProperties().getProperty(TOKEN_PROP) || '';
}

function recordToRow_(record) {
  return HEADERS.map(function (key) {
    var value = record[key];
    return value === undefined || value === null ? '' : value;
  });
}

function normalizeCell_(key, value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (key === 'createdAt' || key === 'updatedAt') {
      return value.toISOString();
    }
    if (key === 'fechaPrestamo' || key === 'fechaDevolucion') {
      return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    if (key === 'horaPrestamo' || key === 'horaDevolucion') {
      return Utilities.formatDate(value, Session.getScriptTimeZone(), 'HH:mm');
    }
  }
  return value;
}

function rowToRecord_(headers, row) {
  var record = {};
  for (var i = 0; i < headers.length; i++) {
    record[headers[i]] = normalizeCell_(headers[i], row[i]);
  }
  record.cantidad = Number(record.cantidad) || 1;
  return record;
}

function listRecords_() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();

  if (lastRow < 2) return [];

  var values = sheet.getRange(1, 1, lastRow, HEADERS.length).getValues();
  var headers = values[0];
  var records = [];

  for (var i = 1; i < values.length; i++) {
    if (!values[i][0]) continue;
    records.push(rowToRecord_(headers, values[i]));
  }

  return records;
}

function upsert_(input) {
  var sheet = getSheet_();
  var record = input || {};
  var now = new Date().toISOString();

  record.id = record.id || Utilities.getUuid();
  record.createdAt = record.createdAt || now;
  record.updatedAt = now;
  record.cantidad = Number(record.cantidad) || 1;

  var lastRow = sheet.getLastRow();
  var rowIndex = 0;

  if (lastRow >= 2) {
    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(record.id)) {
        rowIndex = i + 2;
        break;
      }
    }
  }

  if (rowIndex === 0) {
    rowIndex = sheet.getLastRow() + 1;
  }

  writeRow_(sheet, rowIndex, record);

  return record;
}

function remove_(id) {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2 || !id) return false;

  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      sheet.deleteRow(i + 2);
      return true;
    }
  }
  return false;
}

function clear_() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
}

function output_(obj, callback) {
  var json = JSON.stringify(obj);

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var params = e.parameter || {};
  var callback = params.callback || '';

  if (params.action === 'list') {
    if (String(params.token || '') !== getToken_()) {
      return output_({ ok: false, error: 'Token incorrecto' }, callback);
    }

    return output_({
      ok: true,
      records: listRecords_(),
      sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
    }, callback);
  }

  return output_({ ok: true, message: 'API de trazabilidad activa' }, callback);
}

function doPost(e) {
  var body;

  try {
    body = JSON.parse(e.postData.contents);
  } catch (error) {
    return output_({ ok: false, error: 'JSON inválido' });
  }

  var action = body.action || 'create';

  if (action === 'create') {
    var record = body.record || {};

    if (!record.quienSolicita || !record.nombreEquipo) {
      return output_({ ok: false, error: 'Faltan datos obligatorios' });
    }

    var saved = upsert_(record);
    return output_({ ok: true, id: saved.id });
  }

  if (String(body.token || '') !== getToken_()) {
    return output_({ ok: false, error: 'No autorizado' });
  }

  if (action === 'update') {
    var updated = upsert_(body.record || {});
    return output_({ ok: true, id: updated.id });
  }

  if (action === 'delete') {
    remove_(body.id);
    return output_({ ok: true });
  }

  if (action === 'clear') {
    clear_();
    return output_({ ok: true });
  }

  return output_({ ok: false, error: 'Acción no válida' });
}