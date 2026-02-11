document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    // Refresh stats every 30 seconds
    setInterval(fetchStats, 30000);
});

async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        animateValue(document.getElementById('server-count'), data.serverCount);
        animateValue(document.getElementById('user-count'), data.userCount);
        document.getElementById('ping').innerText = `${Math.round(data.ping)} ms`;
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

function animateValue(obj, end) {
    let startTimestamp = null;
    const duration = 1000;
    const start = parseInt(obj.innerText) || 0;

    // If explicitly --, force start to 0
    const startVal = isNaN(start) ? 0 : start;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - startVal) + startVal);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
