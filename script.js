import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5nPyvaMXhl2K02FDE1JDbm8ceJ_tRgSU",
  authDomain: "asientospolar.firebaseapp.com",
  databaseURL: "https://asientospolar-default-rtdb.firebaseio.com",
  projectId: "asientospolar",
  storageBucket: "asientospolar.appspot.com",
  messagingSenderId: "477885194157",
  appId: "1:477885194157:web:8d0e7324be551002024b24"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la base de datos (sin URL adicional)
const database = getDatabase(app);

// Resto de tu código para gestionar los asientos
const seatSections = { A: 51, B: 51, C: 49 };

function renderSeats() {
    for (const section in seatSections) {
        const seatsContainer = document.getElementById(`seats${section}`);
        seatsContainer.innerHTML = "";
        for (let i = 1; i <= seatSections[section]; i++) {
            const seatId = `${section}${i}`;
            const seatElement = document.createElement("div");
            seatElement.className = "seat";
            seatElement.textContent = seatId;
            seatElement.id = seatId;
            seatElement.addEventListener("click", () => selectSeat(seatId));
            seatsContainer.appendChild(seatElement);
            loadSeatStatus(seatId, seatElement);  // Cargar estado desde Firebase
        }
    }
}

function loadSeatStatus(seatId, seatElement) {
    const seatRef = ref(database, `seats/${seatId}`);
    onValue(seatRef, (snapshot) => {
        if (snapshot.exists() && snapshot.val().occupied) {
            seatElement.classList.add("occupied");
            seatElement.removeEventListener("click", () => selectSeat(seatId));
        } else {
            seatElement.classList.remove("occupied");
            seatElement.addEventListener("click", () => selectSeat(seatId));
        }
    });
}

renderSeats();
