document.addEventListener("DOMContentLoaded", () => {
  fetch('./QUANLI.txt')
    .then(response => response.text())
    .then(data => {
      const courseContainer = document.getElementById("courseContainer");
      if (!courseContainer) return;

      const parseBlock = (label) => {
        const regex = new RegExp(`${label}\\[(.*?)\\]`, 's');
        const match = data.match(regex);
        if (!match) return [];
        return match[1]
            .split('\n')                    // tách từng dòng
            .map(e => e.trim())             // loại bỏ khoảng trắng thừa
            .filter(e => e.length > 0);     // loại bỏ dòng rỗng
        };

      const videos = parseBlock("ID_video");
      const images = parseBlock("ID_pic");
      const names = parseBlock("ID_name");
      const prices = parseBlock("ID_money");

      const courseCount = Math.min(videos.length, images.length, names.length, prices.length);

      for (let i = 0; i < courseCount; i++) {
        const courseHTML = `
        <div class="bg-white/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden course-card">
          <img src="./TAINGUYEN/${images[i]}" alt="${names[i]}" class="course-image">
          <div class="p-4 text-gray-800">
            <h3 class="text-xl font-bold">${names[i]}</h3>
            <p class="text-gray-700">Giá: ${prices[i]}</p>
            <a href="payment.html?course=course${i + 1}" class="mt-4 w-full block bg-green-500 text-white p-2 rounded hover:bg-green-600 text-center buy-button">Mua ngay</a>
          </div>
        </div>`;
        courseContainer.insertAdjacentHTML('beforeend', courseHTML);
      }

      // Re-bind buy-button event
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
    })
    .catch(error => console.error("Không thể tải QUANLI.txt:", error));
});
