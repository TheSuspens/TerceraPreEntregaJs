class SlotManager {
    constructor() {
        this.slots = JSON.parse(localStorage.getItem("slots")) || [];
    }

    generateSlots(startHour, endHour, excludedTimes = []) {

        this.slots = [];
        const newSlots = [];

        for (let hour = startHour; hour < endHour; hour++) {
            const time = `${hour}:00 - ${hour + 1}:00`;
            if (!excludedTimes.includes(time)) {
                newSlots.push({ id: newSlots.length + 1, time, reserved: false });
            }
        }

        this.slots = [...newSlots];
        localStorage.setItem("slots", JSON.stringify(this.slots));
    }

    getAvailableSlots() {
        return this.slots.filter((slot) => !slot.reserved);
    }

    reserveSlot(slotId) {
        const slot = this.slots.find((slot) => slot.id === slotId);
        if (slot && !slot.reserved) {
            slot.reserved = true;
            localStorage.setItem("slots", JSON.stringify(this.slots));
            return true;
        }
        return false;
    }
}

export default SlotManager;


