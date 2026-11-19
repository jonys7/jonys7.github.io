const copyButton = document.querySelector('#kopirovat');
const address = document.querySelector('#adresa');
const copyStatus = document.querySelector('#stav');

copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(address.textContent.trim());
    copyStatus.textContent = 'Adresa je zkopírovaná.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(address);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Adresa je označená. Zkopíruj ji ručně.';
  }
});

const preview = document.querySelector('#nahled');
const previewImage = preview.querySelector('img');
const caption = document.querySelector('#popisek');
const count = document.querySelector('#pocet');
const photos = [...document.querySelectorAll('.photo')];
let currentPhoto = 0;
let opener;

function photoTitle(photo) {
  const label = photo.closest('figure').querySelector('figcaption');
  const year = label.querySelector('time');
  return [label.querySelector('h3').textContent, year?.textContent].filter(Boolean).join(' ');
}

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  const thumbnail = photo.querySelector('img');
  previewImage.src = photo.href;
  previewImage.alt = thumbnail.alt;
  previewImage.className = thumbnail.className;
  caption.textContent = photoTitle(photo);
  count.textContent = `${currentPhoto + 1} / ${photos.length}`;
}

function setupThumbnails(gallery) {
  const [firstPhoto, ...otherPhotos] = photos;
  let featured = firstPhoto;
  const rails = ['left', 'right'].map((side) => {
    const rail = document.createElement('div');
    rail.className = 'thumbnail-rail thumbnail-rail-' + side;
    gallery.append(rail);
    return rail;
  });
  const slotsPerSide = Math.max(3, Math.ceil(otherPhotos.length / 2));

  otherPhotos.forEach((photo) => { photo.closest('figure').hidden = true; });

  for (let index = 0; index < slotsPerSide * rails.length; index += 1) {
    const rail = rails[Math.floor(index / slotsPerSide)];
    let selected = otherPhotos[index];

    if (!selected) {
      const emptySlot = document.createElement('div');
      emptySlot.className = 'thumbnail thumbnail-empty';
      emptySlot.setAttribute('aria-hidden', 'true');
      rail.append(emptySlot);
      continue;
    }

    const button = document.createElement('button');
    const image = document.createElement('img');
    button.type = 'button';
    button.className = 'thumbnail';
    image.alt = '';
    image.loading = 'lazy';
    button.append(image);
    rail.append(button);

    function updateThumbnail() {
      const source = selected.querySelector('img');
      image.src = source.src;
      image.className = source.className;
      const title = photoTitle(selected);
      button.setAttribute('aria-label', 'Zobrazit uprostřed: ' + title);
      button.title = title;
    }

    button.addEventListener('click', () => {
      featured.closest('figure').hidden = true;
      selected.closest('figure').hidden = false;
      [featured, selected] = [selected, featured];
      updateThumbnail();
      document.querySelector('#galerie-stav').textContent = 'Zobrazeno: ' + photoTitle(featured);
    });
    updateThumbnail();
  }

  gallery.classList.add('has-thumbnails');
}

const gallery = document.querySelector('.photos');
if (gallery && photos.length) setupThumbnails(gallery);

if (typeof preview.showModal === 'function') {
  photos.forEach((photo, index) => {
    photo.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = photo;
      showPhoto(index);
      preview.showModal();
    });
  });

  document.querySelector('#predchozi').addEventListener('click', () => showPhoto(currentPhoto - 1));
  document.querySelector('#dalsi').addEventListener('click', () => showPhoto(currentPhoto + 1));

  preview.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
  });
  preview.addEventListener('close', () => opener?.focus());
}
