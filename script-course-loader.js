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
// Hàm tính trung bình và số lần đánh giá sao
// ========================================
const calculateAverageRating = (courseIndex) => {
  const ratings = JSON.parse(localStorage.getItem(`course_${courseIndex}_ratings`) || '[]');
  if (ratings.length === 0) return { average: 0, count: 0 };
  const sum = ratings.reduce((acc, val) => acc + val, 0);
  return { average: (sum / ratings.length).toFixed(1), count: ratings.length };
};

// ========================================
// Tải và hiển thị danh sách khóa học khi trang được tải
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  fetch('./QUANLI.txt')
    .then(response => response.text())
    .then(data => {
      const parseBlock = (label) => {
        const regex = new RegExp(`${label}\\[(.*?)\\]`, 's');
        const match = data.match(regex);
        if (!match) return [];
        return match[1].split('\n').map(e => e.trim()).filter(e => e.length > 0);
      };

      const videos = parseBlock("ID_video");
      const images = parseBlock("ID_pic");
      const names = parseBlock("ID_name");
      const prices = parseBlock("ID_money");
      const types = parseBlock("ID_type");

      const courseCount = Math.min(videos.length, images.length, names.length, prices.length);
      localStorage.setItem("courseCount", courseCount); // Ghi lại số khóa để reset sau

      const aeContainer = document.getElementById("aeCourses");
      const ccContainer = document.getElementById("capcutCourses");

      for (let i = 0; i < courseCount; i++) {
        const rating = calculateAverageRating(i);
        const { starHTML, average, count } = generateStarHTML(rating, i);
        const isFree = prices[i]?.toUpperCase() === "MIỄN PHÍ";
        const link = isFree ? `./TAINGUYEN/${videos[i]}` : `payment.html?course=course${i + 1}`;

        const courseHTML = `
          <div class="course-card">
            <img src="./TAINGUYEN/${images[i]}" alt="${names[i]}" class="course-image">
            <div class="p-4 text-gray-800">
              <h3 class="text-xl font-bold">${names[i]}</h3>
              <p class="text-gray-700">Giá: ${prices[i]}</p>
              <div class="rating mt-2" data-course="${i}">${starHTML} <span>(${average} - ${count} đánh giá)</span></div>
              <a href="${link}" class="mt-4 w-full block bg-green-500 text-white p-2 rounded hover:bg-green-600 text-center buy-button">Học Ngay</a>
            </div>
          </div>`;

        const type = types[i]?.toUpperCase();
        if (type === "AE") aeContainer?.insertAdjacentHTML("beforeend", courseHTML);
        else if (type === "CC") ccContainer?.insertAdjacentHTML("beforeend", courseHTML);
      }

      // Sự kiện nút mua
      document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const href = button.getAttribute('href');
          button.classList.add('clicked');
          setTimeout(() => {
            button.classList.remove('clicked');
            window.location.href = href;
          }, 300);
        });
      });

      // Sự kiện đánh giá sao
      document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', (e) => {
          const courseIndex = e.target.dataset.course;
          const value = parseInt(e.target.dataset.value);
          let ratings = JSON.parse(localStorage.getItem(`course_${courseIndex}_ratings`) || '[]');
          ratings.push(value);
          localStorage.setItem(`course_${courseIndex}_ratings`, JSON.stringify(ratings));

          const rating = calculateAverageRating(courseIndex);
          const { starHTML, average, count } = generateStarHTML(rating, courseIndex);
          const ratingContainer = e.target.parentElement;
          ratingContainer.innerHTML = `${starHTML} <span>(${average} - ${count} đánh giá)</span>`;
        });
      });
    })
    .catch(error => console.error("Không thể tải QUANLI.txt:", error));
});

// ========================================
// Hàm reset toàn bộ hoặc 1 khóa học theo yêu cầu
// Gọi trên Console: reset("all") hoặc reset(0), reset(1), ...
// ========================================
const reset = (target) => {
  const getMaxCourseIndex = () => {
    const count = localStorage.getItem("courseCount");
    return count ? parseInt(count) : 0;
  };

  const resetOne = (i) => {
    localStorage.removeItem(`course_${i}_ratings`);
    const rating = { average: 0, count: 0 };
    const { starHTML, average, count } = generateStarHTML(rating, i);
    const ratingContainer = document.querySelector(`.rating[data-course="${i}"]`);
    if (ratingContainer) {
      ratingContainer.innerHTML = `${starHTML} <span>(${average} - ${count} đánh giá)</span>`;
    }
  };

  if (target === "all") {
    const max = getMaxCourseIndex();
    for (let i = 0; i < max; i++) resetOne(i);
    alert("Đã reset toàn bộ đánh giá.");
  } else if (!isNaN(target)) {
    resetOne(parseInt(target));
    alert(`Đã reset khóa học số ${target}.`);
  } else {
    console.warn("reset(x) với x là số hoặc 'all'");
  }
};

// Cho phép gọi từ console
window.reset = reset;
