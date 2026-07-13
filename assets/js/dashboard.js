const DASHBOARD_STATE_KEY = 'acaDashboardState';
const defaultDashboardState = {
  userName: 'Seabata Sechaba',
  metrics: {
    assignments: 12,
    projects: 5,
    streak: 26,
    attendance: 98,
    certificates: 8
  },
  continueLearning: {
    title: 'Advanced React',
    progress: 72,
    lesson: 'Lesson 8 of 11',
    estimate: '42 min',
    mentor: 'Mrs. A. Ndlovu',
    repository: 'aca-website'
  },
  charts: {
    weekly: [62, 70, 68, 74, 80, 76, 72],
    monthly: [45, 58, 62, 71, 88, 92, 98],
    hours: [2, 3, 4, 3.5, 5, 4.5, 6],
    commits: [1, 3, 2, 5, 4, 6, 7]
  },
  currentProject: {
    title: 'ACA Website',
    status: 'In Progress',
    branch: 'feature/dashboard',
    commit: '2 hours ago',
    issues: 12,
    pr: '#21'
  },
  tasks: [
    { title: 'Design dashboard UI', label: 'Due today' },
    { title: 'Build chart widgets', label: 'In progress' },
    { title: 'Review GitHub PR', label: 'Due tomorrow' }
  ],
  deadlines: [
    { title: 'Project submission', detail: 'E-commerce web app', date: 'Tomorrow' },
    { title: 'JS Quiz', detail: 'Advanced module 4', date: 'Fri' },
    { title: 'Mentor standup', detail: 'Career guidance', date: 'Today' }
  ],
  notifications: [
    { title: 'PR Approved', detail: 'Your branch was merged.' },
    { title: 'Assignment Due', detail: 'JavaScript quiz due tomorrow.' },
    { title: 'GitHub Mention', detail: 'You were mentioned in issue #9.' }
  ],
  messages: [
    { name: 'Neo', preview: 'Can we sync after standup?', unread: true },
    { name: 'Mrs. A. Ndlovu', preview: 'I reviewed your project plan.' },
    { name: 'Sarah', preview: 'Ready for the demo?' }
  ],
  leaderboard: [
    { place: '🥇', name: 'Sarah', value: '98%' },
    { place: '🥈', name: 'Seabata', value: '95%' },
    { place: '🥉', name: 'Neo', value: '93%' }
  ]
};
function loadDashboardState() {
  const raw = localStorage.getItem(DASHBOARD_STATE_KEY);
  if (!raw) return { ...defaultDashboardState };
  try {
    return { ...defaultDashboardState, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Invalid dashboard state', err);
    return { ...defaultDashboardState };
  }
}
function saveDashboardState(state) {
  localStorage.setItem(DASHBOARD_STATE_KEY, JSON.stringify(state));
}
function animateCount(element, target, suffix = '') {
  if (!element) return;
  let start = 0;
  const duration = 900;
  const stepTime = Math.max(Math.floor(duration / target), 10);
  const ticker = setInterval(() => {
    start += 1;
    element.textContent = `${start}${suffix}`;
    if (start >= target) {
      clearInterval(ticker);
    }
  }, stepTime);
}
function renderMetrics(state) {
  document.getElementById('assignmentsCount').textContent = state.metrics.assignments;
  document.getElementById('projectsCount').textContent = state.metrics.projects;
  document.getElementById('streakCount').textContent = state.metrics.streak;
  document.getElementById('attendanceCount').textContent = state.metrics.attendance;
  document.getElementById('certificatesCount').textContent = state.metrics.certificates;
  document.querySelectorAll('.stat-card[data-target]').forEach(card => {
    const target = Number(card.dataset.target || 0);
    const suffix = card.dataset.suffix || '';
    const valueNode = card.querySelector('strong');
    if (valueNode) animateCount(valueNode, target, suffix);
  });
}
function renderContinueLearning(state) {
  document.getElementById('continueTitle').textContent = state.continueLearning.title;
  document.getElementById('continueProgress').style.width = `${state.continueLearning.progress}%`;
}
function renderProject(state) {
  document.getElementById('projectTitle').textContent = state.currentProject.title;
  document.getElementById('projectStatus').textContent = state.currentProject.status;
  document.getElementById('projectBranch').textContent = state.currentProject.branch;
  document.getElementById('projectCommit').textContent = state.currentProject.commit;
  document.getElementById('projectIssues').textContent = state.currentProject.issues;
  document.getElementById('projectPr').textContent = state.currentProject.pr;
}
function renderList(containerId, items, template) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    const element = document.createElement('div');
    element.className = template.className;
    element.innerHTML = template.render(item);
    container.appendChild(element);
  });
}
function renderRightPanels(state) {
  renderList('rightTaskList', state.tasks, {
    className: 'task-item',
    render: task => `<strong>${task.title}</strong><span>${task.label}</span>`
  });
  renderList('rightDeadlineList', state.deadlines, {
    className: 'deadline-item',
    render: deadline => `<strong>${deadline.title}</strong><span>${deadline.detail}</span><small>${deadline.date}</small>`
  });
  renderList('rightNotificationList', state.notifications, {
    className: 'notification-item',
    render: note => `<strong>${note.title}</strong><span>${note.detail}</span>`
  });
  renderList('messageList', state.messages, {
    className: 'message-item',
    render: message => `<strong>${message.name}</strong><span>${message.preview}</span>${message.unread ? '<span class="message-badge">New</span>' : ''}`
  });
  renderList('rightLeaderboardList', state.leaderboard, {
    className: 'leaderboard-item',
    render: row => `<span>${row.place}</span><div><strong>${row.name}</strong><span>${row.value}</span></div>`
  });
}
function setupClock() {
  const clock = document.getElementById('dashboardClock');
  if (!clock) return;
  const updateTime = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    clock.textContent = formatted;
  };
  updateTime();
  setInterval(updateTime, 1000 * 60);
}
function setupCharts(state) {
  const createChart = (id, type, labels, data, color) => {
    const canvas = document.getElementById(id);
    if (!canvas || typeof Chart === 'undefined') return null;
    return new Chart(canvas.getContext('2d'), {
      type,
      data: {
        labels,
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: `${color}22`,
          borderWidth: 2,
          fill: type !== 'bar',
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#e2e8f0' } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(15, 23, 42, 0.08)' }, ticks: { color: '#64748b' }, beginAtZero: true }
        }
      }
    });
  };
  createChart('weeklyChart', 'line', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], state.charts.weekly, 'rgba(91, 95, 239, 1)');
  createChart('monthlyChart', 'line', ['Week 1', 'Week 2', 'Week 3', 'Week 4'], state.charts.monthly, 'rgba(124, 77, 255, 1)');
  createChart('hoursChart', 'bar', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], state.charts.hours, 'rgba(0, 194, 255, 1)');
  createChart('commitsChart', 'bar', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], state.charts.commits, 'rgba(91, 95, 239, 1)');
}
function initializeDashboard() {
  const state = loadDashboardState();
  renderMetrics(state);
  renderContinueLearning(state);
  renderProject(state);
  renderRightPanels(state);
  setupClock();
  setupCharts(state);
}
document.addEventListener('DOMContentLoaded', initializeDashboard);
