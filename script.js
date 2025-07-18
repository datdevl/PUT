// Danh sách tài khoản
const accounts = [
  { username: 'levandat', password: '1032007aA@' },
  { username: 'put', password: 'put' }
  // EDIT HERE: Thêm tài khoản mới vào đây, ví dụ: { username: 'ten_nguoi_dung', password: 'mat_khau' }
];

// Danh sách ID khóa học
const courseIds = [
  { course: 'course1', courseIds: ['CC1003', 'CC0302'], video: './TAINGUYEN/vid1.mp4' }, // EDIT HERE: Thay đổi đường dẫn video
  { course: 'course2', courseIds: ['AE2007'], video: './TAINGUYEN/vid2.mp4' } // EDIT HERE: Thay đổi đường dẫn video
  // EDIT HERE: Thêm khóa học và ID mới vào đây, ví dụ: { course: 'courseX', courseIds: ['ID1', 'ID2'], video: 'videos/videoX.mp4' }
];

// Hàm tạo mật khẩu ngẫu nhiên
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

// Xử lý trang thanh toán
function loadPaymentPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  const courseData = {
    course1: { name: 'BÀI 1: CAPCUT', price: '900,000 VNĐ', video: './TAINGUYEN/vid1.mp4' },
    course2: { name: 'BÀI 1: AFTER EFFECT', price: '1,200,000 VNĐ', video: './TAINGUYEN/vid2.mp4' }
    // EDIT HERE: Thêm thông tin khóa học khác
  };
  if (courseId && courseData[courseId]) {
    document.getElementById('courseName').textContent = courseData[courseId].name;
    document.getElementById('coursePrice').textContent = courseData[courseId].price;
    document.getElementById('courseId').textContent = courseId;
  }
}

// Xử lý đăng ký
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Email không hợp lệ! Vui lòng nhập email đúng định dạng.');
    return;
  }

  // Tạo mật khẩu ngẫu nhiên
  const password = generateRandomPassword();

  // Nội dung email tùy chỉnh
  const emailSubject = encodeURIComponent('Đăng ký khóa học mới');
  const emailBody = encodeURIComponent(
    `Kính gửi Quản trị viên,\n\n` +
    `Thông tin đăng ký khóa học:\n` +
    `Họ và tên: ${name}\n` +
    `Email: ${email}\n` +
    `Mật khẩu được tạo: ${password}\n\n` +
    `Vui lòng xác nhận và cung cấp quyền truy cập khóa học.\n` +
    `Trân trọng,\n${name}`
  );
  // EDIT HERE: Thay đổi email nhận (dangnhthu.anhthudang@email.com) và nội dung email nếu cần
  const mailtoLink = `mailto:dat.dev.vl@email.com?subject=${emailSubject}&body=${emailBody}`;


  // Mở ứng dụng email và hiển thị thông báo
  window.open(mailtoLink, '_blank');
  alert(`Gửi Email để đăng kí! Thông tin sẽ được gửi đến ADMIN và phản hồi lại sau giây lát... Vui lòng kiểm tra email ${email} sau khi gửi để chấp thuận tài khoản.`);
});

// Xử lý đăng nhập
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Kiểm tra tài khoản
  const account = accounts.find(acc => acc.username === username && acc.password === password);
  
  if (account) {
    alert('Đăng nhập thành công!');
    window.location.href = 'courses.html';
  } else {
    alert('Tên đăng nhập hoặc mật khẩu không đúng!');
  }
});

// Mô phỏng thanh toán
function simulatePayment() {
  // EDIT HERE: Thay đổi logic xác nhận thanh toán (cần tích hợp API thanh toán thực tế)
  alert('Xác nhận thanh toán thành công!');
  document.getElementById('videoLink').classList.remove('hidden');
}

// Kiểm tra ID khóa học
function checkCourseId() {
  const inputId = document.getElementById('courseIdInput').value;
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  const validCourse = courseIds.find(course => course.course === courseId && course.courseIds.includes(inputId));
  
  if (validCourse) {
    window.location.href = validCourse.video; // Chuyển hướng đến link video
  } else {
    alert('ID chưa chính xác!');
  }
}

// Tải dữ liệu trang thanh toán khi trang được tải
if (window.location.pathname.includes('payment.html')) {
  window.onload = loadPaymentPage;
}