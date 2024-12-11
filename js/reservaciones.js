class ReservationManager {
    constructor(slotManager) {
        this.reservations = JSON.parse(localStorage.getItem("reservations")) || [];
        this.slotManager = slotManager;
    }

    addReservation(name, slotId) {
        const { slots } = this.slotManager;
        const slot = slots.find((s) => s.id === slotId && !s.reserved);
        if (slot) {
            this.reservations.push({ name, slot });
            this.slotManager.reserveSlot(slotId);
            localStorage.setItem("reservations", JSON.stringify(this.reservations));
            return true;
        }
        console.warn("No se pudo agregar la reserva. Turno no disponible.");
        return false;
    }

    getReservations() {
        return this.reservations;
    }

    cancelReservation(slotId) {
        const index = this.reservations.findIndex((res) => res.slot.id === slotId);
        if (index !== -1) {
            this.reservations.splice(index, 1);
            this.slotManager.slots.find((s) => s.id === slotId).reserved = false;
            localStorage.setItem("reservations", JSON.stringify(this.reservations));
            localStorage.setItem("slots", JSON.stringify(this.slotManager.slots));
            return true;
        }
        console.warn("Reserva no encontrada para cancelar.");
        return false;
    }
}

export default ReservationManager;


