import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVXRhH34kfhTgL3JD0DXIsy6PxLqKZUPg",
  authDomain: "lunaris-a9430.firebaseapp.com",
  databaseURL: "https://lunaris-a9430-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lunaris-a9430",
  storageBucket: "lunaris-a9430.appspot.com",
  messagingSenderId: "189163517365",
  appId: "1:189163517365:web:dd2e1401a3baa6026015fc",
  measurementId: "G-EB4488LZJV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");
const heartIcon = document.getElementById("heartIcon");

let currentUser = null;

signInAnonymously(auth)
  .catch((error) => {
    console.error("Chyba při anonymním přihlášení:", error);
  });

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    console.log("Uživatel přihlášen:", user.uid);
    const liked = await checkUserLikeStatus(user.uid);
    subscribeToLikes();

    if (liked) {
      unlockSections();
    }
  } else {
    currentUser = null;
    console.log("Uživatel není přihlášen.");
  }
});

function subscribeToLikes() {
  const likeRef = ref(db, "likes/count");
  onValue(likeRef, (snapshot) => {
    const val = snapshot.val() || 0;
    likeCount.textContent = val;
    console.log("Aktuální počet lajků: ", val);
  });
}

async function checkUserLikeStatus(uid) {
  const userLikeRef = ref(db, `likes/users/${uid}`);
  const snapshot = await get(userLikeRef);
  if (snapshot.exists() && snapshot.val().value === true) {
    disableLike();
    return true;
  }
  return false;
}

function disableLike() {
  likeBtn.disabled = true;
  heartIcon.style.fill = "#e0245e"; // červená
}

function unlockSections() {
  const lockedSections = document.querySelectorAll(".locked");
  lockedSections.forEach(section => {
    section.classList.remove("locked");
  });
  console.log("Sekce byly odemčeny.");
}

likeBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("Není přihlášen uživatel!");
    return;
  }
  
  console.log("Zápis do like, uživatel:", currentUser.uid);

  likeBtn.disabled = true;
  heartIcon.style.fill = "#e0245e";

  const userLikeRef = ref(db, `likes/users/${currentUser.uid}`);
  const userSnapshot = await get(userLikeRef);
  if (userSnapshot.exists() && userSnapshot.val().value === true) {
    console.log("Uživatel již liknul.");
    return;
  }

  try {
    const likeCountRef = ref(db, "likes/count");
    const snapshot = await get(likeCountRef);
    const currentLikes = snapshot.val() || 0;

    console.log("Počet lajků před přičtením:", currentLikes);
    await set(likeCountRef, currentLikes + 1);
    console.log("Počet lajků byl úspěšně aktualizován na:", currentLikes + 1);
    
    await set(userLikeRef, { value: true, timestamp: Date.now() });
    console.log("Like byl úspěšně uložen.");
    disableLike();
    unlockSections(); // Odemkni sekce po like
  } catch (error) {
    console.error("Chyba při ukládání lajku do databáze:", error);
  }
});
