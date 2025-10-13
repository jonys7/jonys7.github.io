const bonuses = {
  armor: '🧥 <strong>Brnění (alternativní volba):</strong><br>💀 Silný proti nemrtvým 15%<br>🪨 Silný proti metinům 15%',
  weapon: '⚔️ <strong>Zbraň (nejlepší volba):</strong><br>👹 Silný proti yohara 15%<br>🪨 Silný proti nemrtvým 15%',
  mount: '🐎 <strong>Mount:</strong><br>💀 Silný proti nemrtvým (max)<br>🪨 Silný proti metinům (max)<br>🐉 Silný proti příšerám (max)',
  top: '⭐ <strong>TOP bonusy (nejvíc DMG):</strong><br><ol style="margin:6px 0 0 18px; padding:0; color:#fff;"><li style="margin-bottom:3px;"><span style="color:#3aff3a;">💀 Silný proti nemrtvým</span> — <strong>dává nejvíc</strong></li><li style="margin-bottom:3px;"><span style="color:#ffd93a;">👹 Silný proti yohara</span> — <em>druhý top bonus</em></li><li style="margin-bottom:3px;"><span style="color:#3a9fff;">🪨 Silný proti metinům</span> — <em>třetí top bonus</em></li><li><span style="color:#ff6f61;">👾 Silný proti příšerám</span> — <em>nejméně DMG</em></li></ol>'

};

const tooltip = document.getElementById('tooltip');
const slots = document.querySelectorAll('.item-slot');
slots.forEach(slot => {
  const item = slot.dataset.item;
  if (item === 'weapon') slot.classList.add('best');
  if (item === 'armor') slot.classList.add('alt');
  if (item === 'mount') slot.classList.add('mount');
});


// Tooltip zobrazení
slots.forEach(slot => {
  slot.addEventListener('mousemove', (e) => {
    const item = slot.dataset.item;
    const bonusText = bonuses[item] || 'Žádné bonusy';

    tooltip.innerHTML = bonusText;
    tooltip.style.left = `${e.clientX + 10}px`;
    tooltip.style.top = `${e.clientY + 10}px`;
    tooltip.style.display = 'block';
  });

  slot.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
});

const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');
const heartIcon = document.getElementById('heartIcon');
const lockedSections = document.querySelectorAll('.collapsible.locked'); 

function unlockSections() {
  lockedSections.forEach(btn => {
    btn.classList.remove('locked'); 
    btn.style.opacity = '1';  
    btn.style.pointerEvents = 'auto'; 
    btn.style.userSelect = 'auto'; 
  });
}

const LIKE_TIMESTAMP_KEY = 'likeWidgetTimestamp';
const LIKE_COUNT_KEY = 'likeWidgetCount';

let count = parseInt(localStorage.getItem(LIKE_COUNT_KEY)) || 0;
likeCount.textContent = count;

function canLikeAgain() {
  const last = parseInt(localStorage.getItem(LIKE_TIMESTAMP_KEY));
  if (!last) return true;
  return (Date.now() - last) > 24 * 60 * 60 * 1000; // 24 hodin
}

function disableLike() {
  likeBtn.disabled = true;
  heartIcon.classList.add('liked');
}

if (!canLikeAgain()) {
  disableLike();
  unlockSections(); 
}

likeBtn.addEventListener('click', () => {
  if (!canLikeAgain()) return;
  count++;
  localStorage.setItem(LIKE_COUNT_KEY, count);
  likeCount.textContent = count;
  heartIcon.classList.add('liked');
  localStorage.setItem(LIKE_TIMESTAMP_KEY, Date.now());
  disableLike();

  unlockSections(); 
});

document.querySelectorAll(".collapsible").forEach(button => {
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
  playerDiv.innerHTML = ''; 
  playerDiv.innerHTML = `
    <iframe width="720" height="405" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>`;
}

