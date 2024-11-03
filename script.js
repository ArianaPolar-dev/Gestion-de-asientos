// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5nPyvaMXhl2K02FDE1JDbm8ceJ_tRgSU",
  authDomain: "asientospolar.firebaseapp.com",
  projectId: "asientospolar",
  storageBucket: "asientospolar.appspot.com",
  messagingSenderId: "477885194157",
  appId: "1:477885194157:web:8d0e7324be551002024b24"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const seatSections = {
    A: 51,
    B: 51,
    C: 49
};

let selectedSeat = null;
let isVIP = false;

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
            loadSeatStatus(seatId, seatElement);
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

function selectSeat(seatId) {
    selectedSeat = seatId;
    document.getElementById("seat-info").textContent = `Asiento Seleccionado: ${seatId}`;
    document.getElementById("confirmButton").style.display = "inline-block";
}

document.getElementById("confirmButton").addEventListener("click", () => {
    if (selectedSeat) {
        const seatRef = ref(database, `seats/${selectedSeat}`);
        set(seatRef, { occupied: true });
        document.getElementById(selectedSeat).classList.add("occupied");
        selectedSeat = null;
        document.getElementById("seat-info").textContent = "Seleccione un asiento";
        document.getElementById("confirmButton").style.display = "none";
    }
});

document.getElementById("vipButton").addEventListener("click", () => {
    const password = prompt("Ingrese la contraseña:");
    if (password === "piroxeno") {
        isVIP = true;
        alert("Modo administrador activado");
        enableVIPMode();
    } else {
        alert("Contraseña incorrecta");
    }
});

function enableVIPMode() {
    document.querySelectorAll(".seat.occupied").forEach((seatElement) => {
        seatElement.addEventListener("click", () => {
            const seatId = seatElement.id;
            if (isVIP) {
                const seatRef = ref(database, `seats/${seatId}`);
                set(seatRef, { occupied: false });
                seatElement.classList.remove("occupied");
            }
        });
    });
}

renderSeats();
