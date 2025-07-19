// ========================
// Danh sách tài khoản
// ========================
const accounts = [
  { username: 'levandat', password: '1032007aA@' },
  { username: 'put', password: 'put' }
  // Thêm tài khoản mới tại đây
];

// ========================
// Danh sách ID khóa học
// ========================
const courseIds = [
  { course: 'course1', courseIds: ['CC1003', 'CC0302'], video: './TAINGUYEN/vid1.mp4' },
  { course: 'course2', courseIds: ['AE2007'], video: './TAINGUYEN/vid2.mp4' }
  // Thêm khóa học mới tại đây
];

// ========================
// Hàm tạo mật khẩu ngẫu nhiên
// ========================
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

// ========================
// Xử lý trang thanh toán
// ========================
function loadPaymentPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');

  const courseData = {
    course1: { name: 'BÀI 1: CAPCUT', price: '900,000 VNĐ', video: './TAINGUYEN/vid1.mp4' },
    course2: { name: 'BÀI 1: AFTER EFFECT', price: '1,200,000 VNĐ', video: './TAINGUYEN/vid2.mp4' }
    // Thêm khóa học mới tại đây
  };

  if (courseId && courseData[courseId]) {
    document.getElementById('courseName').textContent = courseData[courseId].name;
    document.getElementById('coursePrice').textContent = courseData[courseId].price;
    document.getElementById('courseId').textContent = courseId;
  }
}

// ========================
// Xử lý đăng ký
// ========================
// Hàm tạo mật khẩu ngẫu nhiên
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 6; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

// Lấy hệ điều hành & trình duyệt
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

// Gửi form đăng ký
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = generateRandomPassword();
  const { os, browser } = detectDeviceInfo();

  // Lấy IP máy
  let ipAddress = 'Không xác định';
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    ipAddress = data.ip;
  } catch {
    ipAddress = 'Lỗi khi lấy IP';
  }

  const subject = '📩 Đăng ký tài khoản';
  const body = `
📩 <b>ĐĂNG KÝ TÀI KHOẢN TRUY CẬP KHÓA HỌC</b>

🧑‍💻 <b>Thông tin người đăng ký:</b>
  🔹 <b>Họ và tên:</b> <b>${name}</b>
  🔹 <b>Email:</b> <b>${email}</b>
  🔹 <b>Mật khẩu khởi tạo:</b> <b>${password}</b>

🖥️ <b>Thông tin thiết bị:</b>
  💻 <b>Hệ điều hành:</b> ${os}
  🌐 <b>Trình duyệt:</b> ${browser}
  📡 <b>Địa chỉ IP:</b> ${ipAddress}

📎 <i>Rất mong Quản trị viên xét duyệt và cấp quyền truy cập sớm nhất.</i>

🙏 <b>Trân trọng cảm ơn!</b>
— <b>${name}</b>
  `.trim();

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body.replace(/<b>|<\/b>|<i>|<\/i>/g, '')); // Gmail không nhận HTML qua URL

  const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);
  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=dat.dev.vl@email.com&su=${encodedSubject}&body=${encodedBody}`;
  const mailtoLink = `mailto:dat.dev.vl@email.com?subject=${encodedSubject}&body=${encodedBody}`;

  if (isMobile) {
    window.location.href = mailtoLink;
  } else {
    const newTab = window.open(gmailURL, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      alert("⚠️ Trình duyệt đã chặn cửa sổ bật lên. Vui lòng bật lại popup.");
    }
  }

  alert("✅ Đã tạo email soạn sẵn! Hãy kiểm tra nội dung và nhấn 'Gửi'.");
});

// ========================
// Xử lý đăng nhập
// ========================
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const account = accounts.find(acc => acc.username === username && acc.password === password);

  if (account) {
    alert('Đăng nhập thành công!');
    window.location.href = 'courses.html';
  } else {
    alert('Tên đăng nhập hoặc mật khẩu không đúng!');
  }
});

// ========================
// Mô phỏng thanh toán
// ========================
function simulatePayment() {
  alert('Xác nhận thanh toán thành công!');
  document.getElementById('videoLink')?.classList.remove('hidden');
}

// ========================
// Kiểm tra ID khóa học
// ========================
function checkCourseId() {
  const inputId = document.getElementById('courseIdInput').value.trim();
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');

  const validCourse = courseIds.find(course => course.course === courseId && course.courseIds.includes(inputId));

  if (validCourse) {
    window.location.href = validCourse.video;
  } else {
    alert('ID chưa chính xác!');
  }
}

// ========================
// Tải dữ liệu khi vào payment.html
// ========================
if (window.location.pathname.includes('payment.html')) {
  window.onload = loadPaymentPage;
}
