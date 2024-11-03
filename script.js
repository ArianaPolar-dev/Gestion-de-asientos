import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA5nPyvaMXhl2K02FDE1JDbm8ceJ_tRgSU",
    authDomain: "asientospolar.firebaseapp.com",
    projectId: "asientospolar",
    storageBucket: "asientospolar.firebasestorage.app",
    messagingSenderId: "477885194157",
    appId: "1:477885194157:web:8d0e7324be551002024b24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let selectedSeat = null;
let isVIPMode = false;
let draggedSeat = null;

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
    const sections = ["A", "B", "C"];
    for (const section of sections) {
        const sectionElement = document.getElementById(`section${section}`);
        for (let i = 1; i <= 51; i++) {
            if (section === "C" && i > 49) break; // Sección C solo tiene 49 asientos

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
            
            // Eventos para arrastrar y soltar en modo VIP
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
        selectedSeat.element.classList.add("occupied");
        selectedSeat = null;
        document.getElementById("selected-seat").textContent = "Asiento seleccionado: Ninguno";
        alert("Reserva confirmada");
    } else {
        alert("Por favor, seleccione un asiento primero.");
    }
}

// Iniciar arrastre de asiento
function startDrag(seat) {
    draggedSeat = seat;
    seat.classList.add("dragging");
}

// Finalizar arrastre y cambiar asiento
function endDrag(targetSeat) {
    if (draggedSeat && draggedSeat !== targetSeat && isVIPMode) {
        // Intercambiar los textos de los asientos
        const tempText = draggedSeat.textContent;
        draggedSeat.textContent = targetSeat.textContent;
        targetSeat.textContent = tempText;
        
        // Quitar clase de arrastre
        draggedSeat.classList.remove("dragging");
        draggedSeat = null;
    }
}

renderSeats();
