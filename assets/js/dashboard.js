// Minimal dashboard script: initializes a Chart.js line chart and fetches recent commits
document.addEventListener('DOMContentLoaded', function () {
  // --- Chart.js setup ---
  const ctx = document.getElementById('weeklyChart');
  if (ctx) {
    // fallback if Chart.js not loaded yet
    try {
      const chart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
          datasets: [{
            label: 'Progress %',
            data: [25, 40, 60, 75, 65, 70, 72],
            borderColor: 'rgba(99,102,241,0.95)',
            backgroundColor: 'rgba(99,102,241,0.12)',
            fill: true,
            tension: 0.3,
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100 }
          },
          plugins: { legend: { display: false } }
        }
      });
    } catch (err) {
      // Chart.js might not be ready yet; ignore
      console.warn('Chart init failed', err);
    }
  }

  // --- Fetch recent commits from GitHub public API ---
  const commitsEl = document.getElementById('commits');
  if (commitsEl) {
    // Public repo: no auth required for simple demos, but rate-limited
    fetch('https://api.github.com/repos/hitman1c/Africa-Code-Academy-Builders/commits')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Unexpected commits response');
        commitsEl.innerHTML = '';
        data.slice(0,6).forEach(c => {
          const row = document.createElement('div');
          row.className = 'commit-item';
          const hash = document.createElement('span');
          hash.className = 'commit-hash';
          hash.textContent = c.sha.slice(0,7);
          const msg = document.createElement('span');
          msg.className = 'commit-msg';
          msg.textContent = c.commit.message.split('\n')[0];
          row.appendChild(hash);
          row.appendChild(msg);
          commitsEl.appendChild(row);
        });
      })
      .catch(err => {
        commitsEl.innerHTML = '<div style="color:var(--text-light);">Unable to load commits</div>';
        console.error('Fetch commits error', err);
      });
  }
});
