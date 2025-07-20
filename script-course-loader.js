      // ========================================
      // Hàm tạo HTML cho đánh giá sao
      // ========================================
      const generateStarHTML = (rating, courseIndex) => {
        const { average, count } = rating;
        const fullStars = Math.floor(average);
        const hasHalfStar = average % 1 >= 0.5;
        let starHTML = '';
        for (let j = 0; j < 5; j++) {
          const starValue = j + 1;
          if (j < fullStars) {
            starHTML += `<span class="star full" data-value="${starValue}" data-course="${courseIndex}">★</span>`;
          } else if (j === fullStars && hasHalfStar) {
            starHTML += `<span class="star half" data-value="${starValue}" data-course="${courseIndex}">★</span>`;
          } else {
            starHTML += `<span class="star empty" data-value="${starValue}" data-course="${courseIndex}">★</span>`;
          }
        }
        return { starHTML, average, count };
      };
    
    // ========================================
    // Hàm reset đánh giá sao về 0  [resetRating(n);]
    // ========================================
    const resetRating = (courseIndex) => {
      localStorage.removeItem(`course_${courseIndex}_ratings`);
      
      // Cập nhật lại giao diện sao
      const rating = { average: 0, count: 0 };
      const { starHTML, average, count } = generateStarHTML(rating, courseIndex);
      const ratingContainer = document.querySelector(`.rating[data-course="${courseIndex}"]`);
      if (ratingContainer) {
        ratingContainer.innerHTML = `${starHTML} <span>(${average} - ${count} đánh giá)</span>`;
      }
    };
// ========================================
// Tải và hiển thị danh sách khóa học khi trang được tải
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // Tải dữ liệu từ file QUANLI.txt
  // ========================================
  fetch('./QUANLI.txt')
    .then(response => response.text())
    .then(data => {
      const courseContainer = document.getElementById("courseContainer");
      if (!courseContainer) return;

      // ========================================
      // Hàm phân tích dữ liệu từ các khối trong file
      // ========================================
      const parseBlock = (label) => {
        const regex = new RegExp(`${label}\\[(.*?)\\]`, 's');
        const match = data.match(regex);
        if (!match) return [];
        return match[1]
            .split('\n')
            .map(e => e.trim())
            .filter(e => e.length > 0);
      };

      // ========================================
      // Lấy danh sách dữ liệu khóa học
      // ========================================
      const videos = parseBlock("ID_video");
      const images = parseBlock("ID_pic");
      const names = parseBlock("ID_name");
      const prices = parseBlock("ID_money");

      const courseCount = Math.min(videos.length, images.length, names.length, prices.length);

      // ========================================
      // Hàm tính trung bình và số lần đánh giá sao
      // ========================================
      const calculateAverageRating = (courseIndex) => {
        const ratings = JSON.parse(localStorage.getItem(`course_${courseIndex}_ratings`) || '[]');
        if (ratings.length === 0) return { average: 0, count: 0 };
        const sum = ratings.reduce((acc, val) => acc + val, 0);
        return { average: (sum / ratings.length).toFixed(1), count: ratings.length };
      };

      
      // ========================================
      // Tạo và hiển thị thẻ khóa học với đánh giá sao
      // ========================================
      for (let i = 0; i < courseCount; i++) {
        const rating = calculateAverageRating(i);
        const { starHTML, average, count } = generateStarHTML(rating, i);
        // Kiểm tra xem khóa học có miễn phí không
        const isFree = prices[i].toUpperCase() === "MIỄN PHÍ";
        // Nếu miễn phí thì link đến video, nếu không thì đến trang thanh toán
        const link = isFree ? `./TAINGUYEN/${videos[i]}` : `payment.html?course=course${i + 1}`;
        const courseHTML = `
          <div class="bg-white/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden course-card">
            <img src="./TAINGUYEN/${images[i]}" alt="${names[i]}" class="course-image">
            <div class="p-4 text-gray-800">
              <h3 class="text-xl font-bold">${names[i]}</h3>
              <p class="text-gray-700">Giá: ${prices[i]}</p>
              <div class="rating mt-2" data-course="${i}">${starHTML} <span>(${average} - ${count} đánh giá)</span></div>
              <a href="${link}" class="mt-4 w-full block bg-green-500 text-white p-2 rounded hover:bg-green-600 text-center buy-button">Học Ngay</a>
            </div>
          </div>`;
        courseContainer.insertAdjacentHTML('beforeend', courseHTML);
      }

      // ========================================
      // Gắn sự kiện click cho các nút mua
      // ========================================
      document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const href = button.getAttribute('href');
          button.classList.add('clicked');
          setTimeout(() => {
            button.classList.remove('clicked');
            window.location.href = href;
          }, 300);
        });
      });

      // ========================================
      // Gắn sự kiện click cho các sao để đánh giá
      // ========================================
      document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', (event) => {
          const courseIndex = event.target.dataset.course;
          const ratingValue = parseInt(event.target.dataset.value);
          let ratings = JSON.parse(localStorage.getItem(`course_${courseIndex}_ratings`) || '[]');
          ratings.push(ratingValue);
          localStorage.setItem(`course_${courseIndex}_ratings`, JSON.stringify(ratings));

          // Cập nhật lại giao diện sao
          const newRating = calculateAverageRating(courseIndex);
          const { starHTML, average, count } = generateStarHTML(newRating, courseIndex);
          const ratingContainer = event.target.parentElement;
          ratingContainer.innerHTML = `${starHTML} <span>(${average} - ${count} đánh giá)</span>`;
        });
      });
    })
    // ========================================
    // Xử lý lỗi khi tải file QUANLI.txt
    // ========================================
    .catch(error => console.error("Không thể tải QUANLI.txt:", error));
});