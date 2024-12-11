import SlotManager from "./slots.js";
import ReservationManager from "./reservaciones.js";

document.addEventListener("DOMContentLoaded", () => {
    const slotManager = new SlotManager();
    const reservationManager = new ReservationManager(slotManager);

    const excludedTimes = ["10:00 - 11:00", "12:00 - 13:00"];
    slotManager.generateSlots(8, 20, excludedTimes);

    const slotsContainer = document.getElementById("available-slots");
    const reservationsList = document.getElementById("reservations-list");
    const reservationForm = document.getElementById("reservation-form");
    const selectSlot = document.getElementById("slot");
    const messageBox = document.getElementById("confirmation-message");

    const renderSlots = () => {
        slotsContainer.innerHTML = "";
        selectSlot.innerHTML = "<option value=\"\" disabled selected>Seleccione un turno</option>";

        slotManager.slots.forEach(({ id, time, reserved }) => {
            if (excludedTimes.includes(time)) return;

            const slotDiv = document.createElement("div");
            slotDiv.className = `slot ${reserved ? "reserved" : ""}`;
            slotDiv.textContent = time;
            slotDiv.dataset.id = id;

            if (!reserved) {
                const option = document.createElement("option");
                option.value = id;
                option.textContent = time;
                selectSlot.appendChild(option);
            }

            slotsContainer.appendChild(slotDiv);
        });
    };

    const renderReservations = () => {
        reservationsList.innerHTML = "";
        reservationManager.getReservations().forEach(({ name, slot }) => {
            const li = document.createElement("li");
            li.textContent = `${name} - ${slot.time}`;

            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Cancelar";
            cancelBtn.className = "btn btn-danger";
            cancelBtn.addEventListener("click", () => {
                reservationManager.cancelReservation(slot.id);
                renderSlots();
                renderReservations();
            });

            li.appendChild(cancelBtn);
            reservationsList.appendChild(li);
        });
    };

    reservationForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const slotId = parseInt(selectSlot.value);

        if (name && slotId) {
            const success = reservationManager.addReservation(name, slotId);
            messageBox.textContent = success
                ? "Reserva creada con éxito."
                : "No se pudo realizar la reserva. Verifique los datos.";

            if (success) {
                renderReservations();
                renderSlots();
                reservationForm.reset();
            }
        } else {
            messageBox.textContent = "Complete todos los campos.";
        }
    });

    renderSlots();
    renderReservations();
});


