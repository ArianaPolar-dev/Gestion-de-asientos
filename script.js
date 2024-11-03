// Importación e inicialización de Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA5nPyvaMXhl2K02FDE1JDbm8ceJ_tRgSU",
    authDomain: "asientospolar.firebaseapp.com",
    projectId: "asientospolar",
    storageBucket: "asientospolar.firebasestorage.app",
    messagingSenderId: "477885194157",
    appId: "1:477885194157:web:8d0e7324be551002024b24"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Variables de estado
let selectedSeat = null;
let isVIP = false;

// Generar secciones de asientos
function generateSeats(sectionId, seatCount) {
    const section = document.getElementById(sectionId);
    for (let i = 1; i <= seatCount; i++) {
        const seatId = `${sectionId.charAt(sectionId.length - 1)}${i}`;
        const seatDiv = document.createElement("div");
        seatDiv.className = "seat";
        seatDiv.id = seatId;
        seatDiv.textContent = seatId;
        seatDiv.onclick = () => selectSeat(seatId);
        section.appendChild(seatDiv);
        updateSeatStatus(seatId); // Actualiza el estado desde Firebase
    }
}

generateSeats("sectionA", 51);
generateSeats("sectionB", 51);
generateSeats("sectionC", 49);

// Función para seleccionar asiento
function selectSeat(seatId) {
    if (selectedSeat) {
        document.getElementById(selectedSeat).classList.remove("selected");
    }
    selectedSeat = seatId;
    document.getElementById("selected-seat").textContent = `Asiento seleccionado: ${seatId}`;
    document.getElementById("confirm-reserve").style.display = "block";
}

// Confirmar reserva
function confirmReservation() {
    if (selectedSeat) {
        const seatDiv = document.getElementById(selectedSeat);
        if (!seatDiv.classList.contains("occupied")) {
            set(ref(db, `seats/${selectedSeat}`), { occupied: true });
            seatDiv.classList.add("occupied");
        } else {
            alert("Este asiento ya está ocupado.");
        }
    }
}

// Modo VIP
function enterVIPMode() {
    const password = prompt("Ingrese la contraseña para el modo VIP:");
    if (password === "piroxeno") {
        isVIP = true;
        alert("Modo VIP activado.");
    } else {
        alert("Contraseña incorrecta.");
    }
}

// Actualizar el estado del asiento
function updateSeatStatus(seatId) {
    const seatRef = ref(db, `seats/${seatId}`);
    onValue(seatRef, (snapshot) => {
        const seatDiv = document.getElementById(seatId);
        if (snapshot.exists() && snapshot.val().occupied) {
            seatDiv.classList.add("occupied");
            if (isVIP) {
                seatDiv.onclick = () => toggleSeat(seatId);
            }
        } else {
            seatDiv.classList.remove("occupied");
        }
    });
}

// Cambiar estado del asiento en modo VIP
function toggleSeat(seatId) {
    if (isVIP) {
        const seatDiv = document.getElementById(seatId);
        const isOccupied = seatDiv.classList.contains("occupied");
        set(ref(db, `seats/${seatId}`), { occupied: !isOccupied });
        seatDiv.classList.toggle("occupied");
    }
}
