const accessToken = '5066b0fe1b779b524bb6af8908eee72f';
const videoId = '824804225';
const apiUrl = `https://api.vimeo.com/videos/${videoId}`;
const popup = new bootstrap.Modal('#popup-container', null);

fetchVimeoData(apiUrl);

function fetchVimeoData(url) {
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(handleResponse)
  .then(responseData => {
    const videoUrl = responseData.embed.html;
    buildSlides(responseData);
    buildModal(videoUrl);
    activateCarouselItem();
  })
  .catch(handleError);
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

function handleError(error) {
  console.error(error);
}

function activateCarouselItem() {
  const carouselElement = document.querySelector('#carouselExampleControls');
  carouselElement.querySelector('.carousel-item').classList.add('active');
}

function handleClickOutside() {
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-content')) {
      popup.hide();
    }
  });
}

function buildSlides(responseData) {
  const wrapper = document.querySelector('.carousel-inner');

  for (let j = 0; j < 2; j++) {
    const carouselItem = createCarouselItem(responseData);
    wrapper.append(carouselItem);
  }
}

function createCarouselItem(responseData) {
  const carouselItem = document.createElement('div');
  carouselItem.classList.add('video__wrapper', 'carousel-item');
  const row = document.createElement('div');
  row.classList.add('video__row', 'row', 'g-0');
  carouselItem.append(row);

  for (let i = 0; i < 4; i++) {
    const imgItem = document.createElement('div');
    imgItem.classList.add('video__col', 'col-md-3');
    imgItem.innerHTML = `<div class="video__item">
      <img src="${responseData.pictures.base_link}"></img>
    </div>`;
    carouselItem.querySelector('.row').append(imgItem);
  }

  return carouselItem;
}

function buildModal(videoUrl) {
  const videoItems = document.querySelectorAll('.video__item');

  videoItems.forEach((item, slideIndex) => {
    item.addEventListener('click', () => {
      const modalBody = document.querySelector('.modal-body');
      const carouselInner = modalBody.querySelector('.carousel-inner');
      const carouselIndicators = modalBody.querySelector('.carousel-indicators');

      const updatedVideoUrl = modifyVideoUrl(videoUrl);

      const carouselItemTemplate = createCarouselItemTemplate(updatedVideoUrl);
      const indicator = createCarouselIndicator();

      for (let i = 0; i < 8; i++) {
        carouselInner.appendChild(carouselItemTemplate.cloneNode(true));
        indicator.setAttribute('data-bs-slide-to', i);
        document.querySelector('.carousel-indicators').appendChild(indicator.cloneNode(true));
      }

      activateCarouselItemByIndex(carouselIndicators, carouselInner, slideIndex);

      handleModalHideEvent(carouselInner, carouselIndicators);

      popup.show();
    });
  });
}

function modifyVideoUrl(videoUrl) {
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = videoUrl;
  const iframeElement = tempContainer.querySelector('iframe');
  iframeElement.src =  iframeElement.src + '&autoplay=1';
  return tempContainer.innerHTML;
}

function createCarouselItemTemplate(videoUrl) {
  const carouselItemTemplate = document.createElement('div');
  carouselItemTemplate.classList.add('carousel-item');
  carouselItemTemplate.innerHTML = carouselItemTemplate.innerHTML + videoUrl;
  return carouselItemTemplate;
}

function createCarouselIndicator() {
  const indicator = document.createElement('button');
  indicator.setAttribute('data-bs-target', '#modalCarousel');
  indicator.classList.add('indicator');
  return indicator;
}

function activateCarouselItemByIndex(carouselIndicators, carouselInner, index) {
  carouselIndicators.childNodes[index].classList.add('active');
  carouselInner.childNodes[index].classList.add('active');
}

function handleModalHideEvent(carouselInner, carouselIndicators) {
  document.getElementById('popup-container').addEventListener('hide.bs.modal', () => {
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';
  });
}

handleClickOutside();
