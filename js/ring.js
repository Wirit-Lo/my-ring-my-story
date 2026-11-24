/* =========================================================
   Ring connection — profile driven (Web Bluetooth)
   ---------------------------------------------------------
   ตั้งค่าแหวนผ่าน "โปรไฟล์" (JSON) แทนการแก้โค้ด:
   - service / char : ชื่อมาตรฐาน (heart_rate), 16-bit ("0xfff0") หรือ UUID เต็ม
   - parse          : hr | uint8 | uint16le | int16le | uint32le
   - offset, scale  : ตำแหน่ง byte เริ่มต้น และตัวคูณ (เช่น 0.01)
   - alert.write    : ข้อมูล hex ที่ส่งไปให้แหวนสั่น เช่น "01"
   - namePrefix     : ชื่ออุปกรณ์ขึ้นต้นด้วย (ใช้กรองตอนค้นหา)
   Depends on globals from app.js: $, S, P, bt, setHR, renderAll, toast, btStatus, stopSim, sv
   ========================================================= */

const RING_STD = {
  name: 'Bluetooth Heart Rate มาตรฐาน',
  namePrefix: '',
  hr:      { service: 'heart_rate',      char: 'heart_rate_measurement', parse: 'hr' },
  battery: { service: 'battery_service', char: 'battery_level',          parse: 'uint8' },
  temp: null, steps: null, alert: null
};

// ตัวอย่างสำหรับแหวน OEM — แก้ UUID ให้ตรงกับเอกสารของผู้ขาย
const RING_TPL = {
  name: 'แหวนของฉัน (กำหนดเอง)',
  namePrefix: 'R0',
  hr:      { service: 'heart_rate', char: 'heart_rate_measurement', parse: 'hr' },
  temp:    { service: '0xfff0', char: '0xfff1', parse: 'int16le', scale: 0.01 },
  steps:   { service: '0xfff0', char: '0xfff2', parse: 'uint32le' },
  battery: { service: 'battery_service', char: 'battery_level', parse: 'uint8' },
  alert:   { service: '0xfff0', char: '0xfff3', write: '01' }
};

// service ที่พบบ่อยในแหวน/สายรัดราคาประหยัด — Web Bluetooth อ่านได้เฉพาะ service ที่ประกาศไว้ล่วงหน้า
const RING_COMMON = ['heart_rate', 'battery_service', 'device_information',
  '0xfff0', '0xffe0', '0xfee0', '0xfee7', '0xffb0', '0xfe59', '0x180d',
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e' /* Nordic UART */];

const RING_METRICS = { hr: 'ชีพจร', temp: 'อุณหภูมิ', steps: 'ก้าว', battery: 'แบตเตอรี่' };

let RP = (() => { try { const o = JSON.parse(localStorage.getItem('mrms_ring') || 'null'); if (o && typeof o === 'object') return o } catch (e) {} return structuredClone(RING_STD) })();
let ringLog = [], ringCam = null;

/* ---------- helpers ---------- */
const uu = x => typeof x === 'string' && /^0x[0-9a-f]{4}$/i.test(x) ? parseInt(x, 16) : (typeof x === 'string' && /^[0-9a-f]{8}-/i.test(x) ? x.toLowerCase() : x);
const hexBytes = h => Uint8Array.from((String(h || '').replace(/[^0-9a-f]/gi, '').match(/../g) || []).map(b => parseInt(b, 16)));
const toHex = dv => [...new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength)].map(b => b.toString(16).padStart(2, '0')).join(' ');

function ringParse(dv, m) {
  const o = m.offset || 0, k = m.scale || 1;
  switch (m.parse) {
    case 'hr':       return dv.getUint8(0) & 1 ? dv.getUint16(1, true) : dv.getUint8(1);
    case 'uint8':    return dv.getUint8(o) * k;
    case 'uint16le': return dv.getUint16(o, true) * k;
    case 'int16le':  return dv.getInt16(o, true) * k;
    case 'uint32le': return dv.getUint32(o, true) * k;
    default: throw new Error('parse ไม่รู้จัก: ' + m.parse);
  }
}

function ringApply(key, v) {
  if (!isFinite(v)) return;
  if (key === 'hr') { if (v > 20 && v < 250) setHR(Math.round(v)) }
  else if (key === 'temp') { S.temp = v; renderAll() }
  else if (key === 'steps') { S.steps = Math.round(v); S.liveSteps = 1; renderAll() }
  else if (key === 'battery') { const e = $('#btBat'); if (e) e.textContent = '🔋 ' + Math.round(v) + '%' }
}

function ringServices() {
  const s = new Set(RING_COMMON.map(uu));
  ['hr', 'temp', 'steps', 'battery', 'alert'].forEach(k => RP[k] && RP[k].service && s.add(uu(RP[k].service)));
  return [...s];
}

/* ---------- connect ---------- */
async function ringSubscribe(server, key, m) {
  const svc = await server.getPrimaryService(uu(m.service));
  const ch = await svc.getCharacteristic(uu(m.char));
  const on = dv => { try { ringApply(key, ringParse(dv, m)) } catch (e) {} };
  if (ch.properties.notify || ch.properties.indicate) {
    await ch.startNotifications();
    ch.addEventListener('characteristicvaluechanged', e => on(e.target.value));
    if (ch.properties.read) on(await ch.readValue());
  } else if (ch.properties.read) {
    on(await ch.readValue());
    const t = setInterval(async () => { if (!server.connected) return clearInterval(t); try { on(await ch.readValue()) } catch (e) {} }, 30000);
  } else throw new Error('อ่านค่าไม่ได้');
}

async function btToggle() {
  if (bt.dev && bt.dev.gatt.connected) { bt.dev.gatt.disconnect(); return }
  if (!navigator.bluetooth) { btStatus('เบราว์เซอร์นี้ไม่รองรับบลูทูธ — ใช้ Chrome บน Android หรือคอมพิวเตอร์ (iPhone ยังไม่รองรับ) หรือลองโหมดจำลอง', 0); return }
  try {
    btStatus('กำลังค้นหาแหวน…', 0);
    const opt = { optionalServices: ringServices() };
    if (RP.namePrefix) opt.filters = [{ namePrefix: RP.namePrefix }];
    else if (RP.hr && RP.hr.service) opt.filters = [{ services: [uu(RP.hr.service)] }];
    else opt.acceptAllDevices = true;
    const d = await navigator.bluetooth.requestDevice(opt); bt.dev = d;
    d.addEventListener('gattserverdisconnected', () => { btStatus('ตัดการเชื่อมต่อแล้ว', 0); $('#btBtn').textContent = 'เชื่อมต่อแหวน'; bt.alert = null });
    btStatus('กำลังเชื่อมต่อ ' + (d.name || 'แหวน') + '…', 0);
    const server = await d.gatt.connect(), ok = [];
    for (const k of Object.keys(RING_METRICS)) {
      if (!RP[k]) continue;
      try { await ringSubscribe(server, k, RP[k]); ok.push(RING_METRICS[k]) } catch (e) { console.warn('[ring]', k, e.message) }
    }
    bt.alert = null;
    if (RP.alert) { try { const s = await server.getPrimaryService(uu(RP.alert.service)); bt.alert = await s.getCharacteristic(uu(RP.alert.char)); ok.push('สั่นเตือน') } catch (e) { console.warn('[ring] alert', e.message) } }
    if (bt.sim) stopSim();
    btStatus('เชื่อมต่อแล้ว: ' + (d.name || 'Smart Ring') + (ok.length ? ' · ' + ok.join(' · ') : ' · ไม่พบข้อมูลที่ตั้งค่าไว้ ลองใช้ "สำรวจอุปกรณ์"'), 1);
    $('#btBtn').textContent = 'ตัดการเชื่อมต่อ';
  } catch (e) {
    const n = e.name;
    btStatus(n === 'NotFoundError' ? 'ยกเลิกหรือไม่พบแหวน — ตรวจชื่ออุปกรณ์ในหน้าตั้งค่าแหวน' : (n === 'SecurityError' || n === 'NotAllowedError') ? 'ไม่ได้รับอนุญาตให้ใช้บลูทูธ — ต้องเปิดผ่าน https และอนุญาตในเบราว์เซอร์' : 'เชื่อมต่อไม่สำเร็จ: ' + e.message, 0);
  }
}

// เรียกจาก app.js เมื่อถึงเวลาพัก
function ringAlert() {
  try {
    if (!bt.alert || !bt.dev || !bt.dev.gatt.connected) return;
    const data = hexBytes(RP.alert && RP.alert.write || '01');
    (bt.alert.writeValueWithoutResponse && !bt.alert.properties.write ? bt.alert.writeValueWithoutResponse(data) : bt.alert.writeValue(data)).catch(() => {});
  } catch (e) {}
}

/* ---------- explorer: list services / characteristics ---------- */
function rlog(t) { ringLog.push(t); const e = $('#rxLog'); e.hidden = false; e.textContent = ringLog.join('\n'); e.scrollTop = e.scrollHeight }

async function ringExplore() {
  if (!navigator.bluetooth) { toast('เบราว์เซอร์นี้ไม่รองรับบลูทูธ'); return }
  ringLog = []; $('#rxCopy').hidden = true;
  let d;
  try {
    d = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: ringServices() });
    rlog('อุปกรณ์: ' + (d.name || '(ไม่มีชื่อ)') + '\nid: ' + d.id + '\n');
    const server = await d.gatt.connect();
    const svcs = await server.getPrimaryServices();
    if (!svcs.length) rlog('ไม่พบ service ที่รู้จัก — ใช้แอป nRF Connect หา UUID แล้วเพิ่มใน JSON');
    for (const s of svcs) {
      rlog('■ service ' + s.uuid);
      let chs = []; try { chs = await s.getCharacteristics() } catch (e) {}
      for (const c of chs) {
        const p = c.properties, pr = ['read', 'write', 'writeWithoutResponse', 'notify', 'indicate'].filter(k => p[k]).join(',');
        let v = ''; if (p.read) { try { v = ' = ' + toHex(await c.readValue()) } catch (e) {} }
        rlog('   └ ' + c.uuid + ' [' + pr + ']' + v);
      }
    }
    rlog('\nเสร็จแล้ว ✓ คัดลอกผลลัพธ์ไปตั้งค่า หรือส่งให้ผู้พัฒนา');
    $('#rxCopy').hidden = false;
    if (d.name && !RP.namePrefix) { RP.namePrefix = d.name; ringRender(); toast('ใส่ชื่ออุปกรณ์ในการตั้งค่าแล้ว (ยังไม่บันทึก)') }
  } catch (e) { if (e.name !== 'NotFoundError') rlog('ผิดพลาด: ' + e.message) }
  finally { try { d && d.gatt.connected && d.gatt.disconnect() } catch (e) {} }
}

function ringCopyLog() { navigator.clipboard.writeText(ringLog.join('\n')).then(() => toast('คัดลอกแล้ว'), () => toast('คัดลอกไม่ได้ — กดค้างที่ข้อความแทน')) }

/* ---------- QR scan ---------- */
async function ringScanQR() {
  if (ringCam) { ringStopCam(); return }
  if (!('BarcodeDetector' in window)) { toast('เบราว์เซอร์นี้สแกน QR ไม่ได้ — วางข้อความจาก QR ในช่องด้านล่างแทน'); $('#rxPaste').focus(); return }
  try {
    const det = new BarcodeDetector({ formats: ['qr_code'] }), v = $('#rxVideo');
    ringCam = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    v.srcObject = ringCam; v.hidden = false; await v.play(); $('#rxScanBtn').textContent = 'ปิดกล้อง';
    const tick = async () => {
      if (!ringCam) return;
      try { const r = await det.detect(v); if (r.length) { ringStopCam(); ringHandleQR(r[0].rawValue); return } } catch (e) {}
      setTimeout(tick, 300);
    };
    tick();
  } catch (e) { ringStopCam(); toast('เปิดกล้องไม่ได้ — ' + (e.name === 'NotAllowedError' ? 'ยังไม่ได้อนุญาตกล้อง' : e.message)) }
}

function ringStopCam() {
  if (ringCam) ringCam.getTracks().forEach(t => t.stop());
  ringCam = null;
  const v = $('#rxVideo'); if (v) { v.hidden = true; v.srcObject = null }
  const b = $('#rxScanBtn'); if (b) b.textContent = 'เปิดกล้องสแกน';
}

function ringHandleQR(text) {
  const t = String(text || '').trim(); if (!t) { toast('ยังไม่มีข้อความ'); return }
  // 1) ไฟล์ตั้งค่า JSON
  try { const o = JSON.parse(t); if (o && typeof o === 'object' && (o.hr || o.temp || o.steps || o.namePrefix)) { RP = Object.assign({ name: 'จาก QR' }, o); ringSave(); toast('โหลดการตั้งค่าจาก QR แล้ว ✨'); return } } catch (e) {}
  // 2) MAC address — เว็บใช้ MAC ไม่ได้
  if (/^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.test(t)) { toast('QR นี้เป็น MAC address — เว็บใช้ไม่ได้ ใช้ "สำรวจอุปกรณ์" หาชื่อแหวนแทน'); return }
  // 3) ลิงก์ — ดึงพารามิเตอร์ชื่อถ้ามี
  let name = t;
  try { const u = new URL(t); name = u.searchParams.get('name') || u.searchParams.get('device') || ''; if (!name) { toast('QR เป็นลิงก์ ไม่มีชื่ออุปกรณ์ — ลองเปิดลิงก์ดูคู่มือแหวน'); return } } catch (e) {}
  // 4) ข้อความธรรมดา = ชื่ออุปกรณ์
  RP.namePrefix = name.slice(0, 29); ringSave(); toast('ตั้งชื่ออุปกรณ์เป็น "' + RP.namePrefix + '" แล้ว');
}

/* ---------- settings page ---------- */
function ringRender() {
  const cur = $('#rxCur'); if (!cur) return;
  const has = Object.keys(RING_METRICS).filter(k => RP[k]).map(k => RING_METRICS[k]);
  cur.textContent = (RP.name || 'ไม่มีชื่อ') + ' · ค้นหา: ' + (RP.namePrefix ? 'ชื่อขึ้นต้น "' + RP.namePrefix + '"' : 'ตาม service') + ' · อ่าน: ' + (has.join(', ') || '-') + (RP.alert ? ' · สั่นเตือนได้' : '');
  $('#rxJson').value = JSON.stringify(RP, null, 2);
  const p = $('#btProf'); if (p) p.textContent = 'โปรไฟล์: ' + (RP.name || '-');
}
function ringSave() { try { localStorage.setItem('mrms_ring', JSON.stringify(RP)) } catch (e) {} ringRender() }
function ringUse(k) { RP = structuredClone(k === 'tpl' ? RING_TPL : RING_STD); ringSave(); toast('ใช้โปรไฟล์: ' + RP.name) }
function ringSaveJson() {
  try {
    const o = JSON.parse($('#rxJson').value);
    if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error('ต้องเป็น object');
    for (const k of ['hr', 'temp', 'steps', 'battery']) if (o[k] && (!o[k].service || !o[k].char || !o[k].parse)) throw new Error(k + ' ต้องมี service, char, parse');
    RP = o; ringSave(); toast('บันทึกการตั้งค่าแหวนแล้ว ✨');
  } catch (e) { toast('JSON ไม่ถูกต้อง: ' + e.message) }
}
function ringPage() { ringRender() }

ringRender();
