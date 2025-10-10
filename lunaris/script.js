const bonuses = {
  armor: '💀 Silný proti nemrtvým 15%<br>🪨 Silný proti metinům 15%',
  weapon: '👹 Silný proti yohara 15%<br>🪨 Silný proti nemrtvým 15%',
  mount: '💀 Silný proti nemrtvým (max)<br>🪨 Silný proti metinům (max)',
  top: '💀 Silný proti nemrtvým (dává nejvíc)<br>👹 Silný proti yohara (druhý top bonus)<br>🪨Silný proti metinům (třetí top bonus)'
};

const tooltip = document.getElementById('tooltip');
const slots = document.querySelectorAll('.item-slot');

slots.forEach(slot => {
  slot.addEventListener('mousemove', (e) => {
    const item = slot.dataset.item;
    const bonusText = bonuses[item] || 'Žádné bonusy';

    tooltip.innerHTML = bonusText;
    tooltip.style.left = `${e.clientX + 10}px`;  // menší offset
    tooltip.style.top = `${e.clientY + 10}px`;
    tooltip.style.display = 'block';
  });

  slot.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
});

// LIKE widget script (doplněk)
const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');
const heartIcon = document.getElementById('heartIcon');
const lockedSections = document.querySelectorAll('.collapsible.locked');

function unlockSections() {
  lockedSections.forEach(btn => {
    btn.classList.remove('locked');
    btn.style.opacity = '';
    btn.style.pointerEvents = '';
    btn.style.userSelect = '';
  });
}

const LIKE_TIMESTAMP_KEY = 'likeWidgetTimestamp';
const LIKE_COUNT_KEY = 'likeWidgetCount';

let count = parseInt(localStorage.getItem(LIKE_COUNT_KEY)) || 0;
likeCount.textContent = count;

function canLikeAgain() {
  const last = parseInt(localStorage.getItem(LIKE_TIMESTAMP_KEY));
  if (!last) return true;
  return (Date.now() - last) > 24 * 60 * 60 * 1000;
}

function disableLike() {
  likeBtn.disabled = true;
  heartIcon.classList.add('liked');
}

if (!canLikeAgain()) {
  disableLike();
}

if (!canLikeAgain()) {
  disableLike();
  unlockSections(); // Odemkne sekce i při načtení, pokud už je like v localStorage
}

likeBtn.addEventListener('click', () => {
  if (!canLikeAgain()) return;
  count++;
  localStorage.setItem(LIKE_COUNT_KEY, count);
  likeCount.textContent = count;
  heartIcon.classList.add('liked');
  localStorage.setItem(LIKE_TIMESTAMP_KEY, Date.now());
  disableLike();

  unlockSections(); // Odemkne sekce po kliknutí na like
});


// Script pro rozbalení/sbalení collapsible sekce přidáním/odebráním třídy
document.querySelectorAll('.collapsible').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
  });
});

const coll = document.querySelectorAll(".collapsible");
coll.forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
    const content = button.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

function showVideo(videoId) {
  const playerDiv = document.getElementById('videoPlayer');
  playerDiv.innerHTML = `
    <iframe width="720" height="405" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>`;
}
