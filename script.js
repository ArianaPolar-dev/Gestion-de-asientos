// Importación e inicialización de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// Función para generar asientos en cada sección con IDs específicos
function generateSeats(sectionId, seatPrefix, seatIds) {
    const section = document.getElementById(sectionId);
    seatIds.forEach(seatId => {
        const seatDiv = document.createElement("div");
        seatDiv.className = "seat";
        seatDiv.id = seatId;
        seatDiv.textContent = seatId;
        seatDiv.onclick = () => selectSeat(seatId);
        section.appendChild(seatDiv);
        updateSeatStatus(seatId);
    });
}

// Generación de asientos para cada sección en el orden específico
generateSeats("sectionA", "A", [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7",
    "A8", "A9", "A10", "A11", "A12", "A13", "A14",
    "A15", "A16", "A17", "A18", "A19", "A20", "A21",
    "A22", "A23", "A24", "A25", "A26", "A27", "A28",
    "A29", "A30", "A31", "A32", "A33", "A34", "A35",
    "A36", "A37", "A38", "A39", "A40", "A41", "A42",
    "A43", "A44", "A45", "A46", "A47", "A48", "A49", "A50", "A51"
]);

generateSeats("sectionB", "B", [
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8",
    "B9", "B10", "B11", "B12", "B13", "B14", "B15", "B16",
    "B17", "B18", "B19", "B20", "B21", "B22", "B23", "B24",
    "B25", "B26", "B27", "B28", "B29", "B30", "B31", "B32",
    "B33", "B34", "B35", "B36", "B37", "B38", "B39", "B40",
    "B41", "B42", "B43", "B44", "B45", "B46", "B47", "B48", "B49", "B50", "B51"
]);

generateSeats("sectionC", "C", [
    "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9",
    "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17",
    "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25",
    "C26", "C27", "C28", "C29", "C30", "C31", "C32", "C33",
    "C34", "C35", "C36", "C37", "C38", "C39", "C40", "C41",
    "C42", "C43", "C44", "C45", "C46", "C47", "C48", "C49"
]);


// Selección de asiento
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

// Actualizar el estado del asiento desde Firebase
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

// Alternar estado del asiento en modo VIP
function toggleSeat(seatId) {
    if (isVIP) {
        const seatDiv = document.getElementById(seatId);
        const isOccupied = seatDiv.classList.contains("occupied");
        set(ref(db, `seats/${seatId}`), { occupied: !isOccupied });
        seatDiv.classList.toggle("occupied");
    }
}
