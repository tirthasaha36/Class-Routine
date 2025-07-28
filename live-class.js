document.addEventListener('DOMContentLoaded', () => {
    // Time slots as in the table headers (24-hour format start and end times)
    const timeSlots = [
        { start: "09:30", end: "10:30" },
        { start: "10:30", end: "11:30" },
        { start: "11:30", end: "12:30" },
        { start: "13:30", end: "14:30" },
        { start: "14:30", end: "15:30" },
        { start: "15:30", end: "16:30" }
    ];

    // Map days to row index in the table (Monday = 1, Tuesday = 2, etc.)
    const dayMap = {
        1: 1, // Monday
        2: 2, // Tuesday
        3: 3, // Wednesday
        4: 4, // Thursday
        5: 5  // Friday
    };

    function parseTimeString(timeStr) {
        // timeStr format: "HH:MM"
        const [hours, minutes] = timeStr.split(':').map(Number);
        return { hours, minutes };
    }

    function isTimeInRange(current, start, end) {
        if (current.hours < start.hours || current.hours > end.hours) return false;
        if (current.hours === start.hours && current.minutes < start.minutes) return false;
        if (current.hours === end.hours && current.minutes >= end.minutes) return false;
        return true;
    }

    function highlightLiveClass() {
        const now = new Date();
        const currentDay = now.getDay(); // Sunday=0, Monday=1, ...
        if (!(currentDay in dayMap)) {
            // No classes on weekends
            return;
        }
        const currentTime = { hours: now.getHours(), minutes: now.getMinutes() };

        // Find the current time slot index
        let slotIndex = -1;
        for (let i = 0; i < timeSlots.length; i++) {
            const start = parseTimeString(timeSlots[i].start);
            const end = parseTimeString(timeSlots[i].end);
            if (isTimeInRange(currentTime, start, end)) {
                slotIndex = i + 1; // +1 because first column is day name
                break;
            }
        }
        if (slotIndex === -1) {
            // No class at this time
            return;
        }

        // Get the table
        const table = document.querySelector('.table-container table');
        if (!table) return;

        // Remove previous highlights
        table.querySelectorAll('td').forEach(td => {
            td.style.backgroundColor = '';
            td.style.color = '';
            td.style.fontWeight = '';
        });

        // Get the row for the current day
        const rowIndex = dayMap[currentDay];
        const row = table.rows[rowIndex];
        if (!row) return;

        // Get the cell for the current time slot
        const cell = row.cells[slotIndex];
        if (!cell) return;

        // Highlight the live class cell
        cell.style.backgroundColor = '#ff758c';
        cell.style.color = 'white';
        cell.style.fontWeight = 'bold';
    }

    highlightLiveClass();

    // Optional: Update highlight every minute
    setInterval(highlightLiveClass, 60000);
});
