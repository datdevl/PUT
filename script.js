// ========================================
// Danh sách tài khoản người dùng
// ========================================
let accounts = [];

// ========================================
// Hàm tải danh sách tài khoản từ Google Sheet
// ========================================
async function fetchAccountsFromGoogleSheet() {
  const url = 'https://docs.google.com/spreadsheets/d/1sI6e6ZSoDGEHfsww0AqYI3q6MbCSKmTa4r233qYJTiI/export?format=csv';
  try {
    const res = await fetch(url);
    const text = await res.text();
    const lines = text.trim().split('\n');
    accounts = lines.slice(1).map(line => {
      const parts = line.split(',');
      const username = parts[1]?.trim();
      const password = parts[2]?.trim();
      return { username, password };
    }).filter(acc => acc.username && acc.password);
  } catch (err) {
    console.error('Lỗi khi tải Google Sheet:', err);
  }
}

// ========================================
// Biến toàn cục lưu thông tin khóa học
// ========================================
let globalData = {
  names: [],
  prices: [],
  videos: [],
  pics: [],
  ids: []
};
let dataReady = false;

// ========================================
// Hàm tạo mật khẩu ngẫu nhiên
// ========================================
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 6; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

// ========================================
// Hàm tải dữ liệu khóa học từ file QUANLI.txt
// ========================================
async function loadCourseData() {
  const res = await fetch('./QUANLI.txt');
  const text = await res.text();

  const parseBlock = (label) => {
    const regex = new RegExp(`${label}\\[(.*?)\\]`, 's');
    const match = text.match(regex);
    if (!match) return [];
    return match[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line !== ']');
  };

  globalData.videos = parseBlock("ID_video");
  globalData.pics = parseBlock("ID_pic");
  globalData.names = parseBlock("ID_name");
  globalData.prices = parseBlock("ID_money");
  globalData.ids = parseBlock("ID_courses");

  dataReady = true;

  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('course');
  let index = -1;

  if (courseParam?.startsWith('course')) {
    const num = parseInt(courseParam.replace('course', ''));
    if (!isNaN(num)) index = num - 1;
  } else if (courseParam) {
    index = globalData.ids.findIndex(id => id.toUpperCase() === courseParam.toUpperCase());
  }

  if (index >= 0 && index < globalData.names.length) {
    document.getElementById('courseName').textContent = globalData.names[index];
    document.getElementById('coursePrice').textContent = globalData.prices[index];
    document.getElementById('courseId').textContent = globalData.names[index];
  }
}

// ========================================
// Hàm mô phỏng thanh toán và hiển thị input ID
// ========================================
function simulatePayment() {
  alert('QTV đã cấp ID cho học viên, vui lòng nhập ID để bắt đầu !');
  document.getElementById('videoLink')?.classList.remove('hidden');
}

// ========================================
// Hàm kiểm tra ID khóa học
// ========================================
function checkCourseId() {
  if (!dataReady) {
    alert('⏳ Vui lòng đợi dữ liệu tải xong rồi thử lại.');
    return;
  }
  const inputId = document.getElementById('courseIdInput').value.trim().toUpperCase();
  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('course');

  let expectedIndex = -1;
  if (courseParam?.startsWith('course')) {
    const num = parseInt(courseParam.replace('course', ''));
    if (!isNaN(num)) expectedIndex = num - 1;
  } else {
    expectedIndex = globalData.ids.findIndex(id => id.toUpperCase() === courseParam?.toUpperCase());
  }

  if (expectedIndex >= 0 && expectedIndex < globalData.ids.length) {
    const expectedId = globalData.ids[expectedIndex]?.toUpperCase();
    if (inputId === expectedId) {
      const videoFile = globalData.videos[expectedIndex];
      window.location.href = `./TAINGUYEN/${videoFile}`;
      return;
    }
  }

  alert('❌ ID chưa chính xác!');
}

// ========================================
// Hàm phát hiện thông tin thiết bị
// ========================================
function detectDeviceInfo() {
  const userAgent = navigator.userAgent;
  let os = "Không xác định";
  if (/Windows NT/.test(userAgent)) os = "Windows";
  else if (/Mac OS X/.test(userAgent)) os = "macOS";
  else if (/Android/.test(userAgent)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";
  else if (/Linux/.test(userAgent)) os = "Linux";

  const browser = (() => {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Không rõ";
  })();

  return { os, browser };
}

// ========================================
// Hàm gửi dữ liệu đăng ký đến Google Form
// ========================================
async function submitToGoogleForm(contact, password, name) {
  const webAppURL = 'https://script.google.com/macros/s/AKfycbyTGDxYZ_frQHHLEh2FjVJ3S3RogDfRxAJACdoYGgjaDhLCpqp_pMix0WefFecimte7/exec';
  
  const url = `${webAppURL}?contact=${encodeURIComponent(contact)}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(name)}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors'
    });
    console.log('Dữ liệu đã gửi thành công:', { contact, password, name });
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu:', error);
  }
}

// ========================================
// Xử lý sự kiện đăng ký
// ========================================
let submitted = false;

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (submitted) return;
    submitted = true;

    const name = document.getElementById('name').value.trim();
    const contact = document.getElementById('contact').value.trim();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = /^0\d{9}$/.test(contact);

    if (!isEmail && !isPhone) {
      alert("❌ Vui lòng nhập đúng Email hoặc Số điện thoại hợp lệ (10 số).");
      submitted = false;
      return;
    }

    if (!name) {
      alert("❌ Vui lòng nhập Họ và tên.");
      submitted = false;
      return;
    }

    const password = generateRandomPassword();

    await submitToGoogleForm(contact, password, name);

    const contactLabel = isEmail ? "Email" : "Số điện thoại";
    alert(`✅ Đăng ký thành công!\nHọ và tên: ${name}\n${contactLabel}: ${contact}\nMật khẩu: ${password}`);

    setTimeout(() => {
      submitted = false;
      registerForm.reset();
    }, 1500);
  });
}

// ========================================
// Xử lý sự kiện đăng nhập
// ========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    await fetchAccountsFromGoogleSheet();
    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
      alert('Đăng nhập thành công!');
      window.location.href = 'courses.html';
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  });
}

// ========================================
// Tải dữ liệu khóa học khi vào trang thanh toán
// ========================================
if (window.location.pathname.includes('payment.html')) {
  window.onload = loadCourseData;
}