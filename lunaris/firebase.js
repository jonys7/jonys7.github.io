import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyAReUl0xGwLnbbM6YvKMc5AqxWEUFPW__E",
    authDomain: "lunaris-ee6cd.firebaseapp.com",
    databaseURL: "https://lunaris-ee6cd-default-rtdb.firebaseio.com",
    projectId: "lunaris-ee6cd",
    storageBucket: "lunaris-ee6cd.appspot.com",  // opraveno
    messagingSenderId: "172076062083",
    appId: "1:172076062083:web:712f50b69ede49a660d2b6",
    measurementId: "G-46RVD4X4B0"
  };

  // Inicializace Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const likeRef = ref(db, "likes/count");

  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");
  const heartIcon = document.getElementById("heartIcon");

  // Načítání lajků v reálném čase
  onValue(likeRef, (snapshot) => {
    const val = snapshot.val() || 0;
    likeCount.textContent = val;
  });

  // Ochrana proti spamu – 1x za 24 hodin
  const lastLike = localStorage.getItem("lastLikeTime");
if (lastLike && Date.now() - parseInt(lastLike) < 86400000) {
  likeBtn.disabled = true;
  heartIcon.classList.add("liked");
  unlockSections();  
}


  // Kliknutí na tlačítko
  likeBtn.addEventListener("click", async () => {
  likeBtn.disabled = true;
  heartIcon.classList.add("liked");

  // Přičti like do databáze
  const snapshot = await get(likeRef);
  const currentLikes = snapshot.val() || 0;
  await set(likeRef, currentLikes + 1);

  // Ulož čas posledního lajku
  localStorage.setItem("lastLikeTime", Date.now());

  unlockSections(); // odemknout sekce po like
});


  // Collapsible sekce
  document.querySelectorAll('.collapsible').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
    });
  });