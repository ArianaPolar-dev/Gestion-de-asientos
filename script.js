import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA5nPyvaMXhl2K02FDE1JDbm8ceJ_tRgSU",
    authDomain: "asientospolar.firebaseapp.com",
    projectId: "asientospolar",
    storageBucket: "asientospolar.firebasestorage.app",
    messagingSenderId: "477885194157",
    appId: "1:477885194157:web:8d0e7324be551002024b24"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let selectedSeat = null;
let isVIPMode = false;

// Función para activar modo VIP
function enterVIPMode() {
    const password = prompt("Ingrese la contraseña VIP:");
    if (password === "piroxeno") {
        isVIPMode = true;
        alert("Modo VIP activado.");
    } else {
        alert("Contraseña incorrecta.");
    }
}

// Renderizar asientos y añadir eventos
async function renderSeats() {
    const sections = {
        A: 51,
        B: 51,
        C: 49
    };

    for (const section in sections) {
        const sectionElement = document.getElementById(`section${section}`);
        for (let i = 1; i <= sections[section]; i++) {
            const seatId = `${section}${i}`;
            const seatElement = document.createElement("div");
            seatElement.classList.add("seat");
            seatElement.textContent = seatId;

            // Verificar si el asiento está ocupado en Firebase y actualizar el estilo
            const seatDoc = doc(db, "seats", seatId);
            const seatSnapshot = await getDoc(seatDoc);
            if (seatSnapshot.exists() && seatSnapshot.data().occupied) {
                seatElement.classList.add("occupied");
            }

            // Agregar evento para seleccionar asiento
            seatElement.addEventListener("click", () => selectSeat(seatId, seatElement));

            // Solo en modo VIP se permite el intercambio de asientos
            if (isVIPMode) {
                seatElement.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    startDrag(seatElement);
                });
                seatElement.addEventListener("mouseup", () => endDrag(seatElement));
            }

            sectionElement.appendChild(seatElement);
        }
    }
}

// Seleccionar asiento
function selectSeat(seatId, seatElement) {
    selectedSeat = { id: seatId, element: seatElement };
    document.getElementById("selected-seat").textContent = `Asiento seleccionado: ${seatId}`;
}

// Confirmar reserva
async function confirmReservation() {
    if (selectedSeat) {
        const seatDoc = doc(db, "seats", selectedSeat.id);
        await setDoc(seatDoc, { occupied: true });
        selectedSeat.element.classList.add("occupied"); // Cambia el color a rojo
        selectedSeat = null;
        document.getElementById("selected-seat").textContent = "Asiento seleccionado: Ninguno";
        alert("Reserva confirmada");
    } else {
        alert("Por favor, seleccione un asiento primero.");
    }
}

// Funciones para arrastrar y soltar en modo VIP
function startDrag(seat) {
    if (!isVIPMode) return;
    seat.classList.add("dragging");
    seat.addEventListener("mousemove", handleDrag);
}

function handleDrag(e) {
    const seat = e.target;
    seat.style.position = "absolute";
    seat.style.left = `${e.pageX - seat.offsetWidth / 2}px`;
    seat.style.top = `${e.pageY - seat.offsetHeight / 2}px`;
}

function endDrag(seat) {
    if (!isVIPMode) return;
    seat.classList.remove("dragging");
    seat.removeEventListener("mousemove", handleDrag);
}

renderSeats();
