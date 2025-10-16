// E-Assessment Platform JavaScript
// Data Management (using JavaScript variables since localStorage is not available)

// Sample Data
const sampleUsers = {
  students: [
    {
      id: 1,
      name: "Ansh Kumar",
      email: "ansh.kumar@student.edu",
      class: "BTech CSE - 5th Semester",
      profile_pic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@student.edu",
      class: "BTech IT - 3rd Semester",
      profile_pic: "https://images.unsplash.com/photo-1494790108755-2616b612b794?w=150&h=150&fit=crop&crop=face"
    }
  ],
  teachers: [
    {
      id: 1,
      name: "Dr. Rajesh Gupta",
      email: "rajesh.gupta@teacher.edu",
      subjects: ["Data Structures", "Algorithms", "Programming"],
      profile_pic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Prof. Meena Patel",
      email: "meena.patel@teacher.edu",
      subjects: ["Database Systems", "Web Development"],
      profile_pic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ],
  admin: [
    {
      id: 1,
      name: "Admin User",
      email: "admin@system.edu",
      profile_pic: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
    }
  ]
};

const sampleTests = [
  {
    id: 1,
    name: "Data Structures Mid-Term",
    subject: "Data Structures",
    duration: 90,
    total_questions: 30,
    status: "Available",
    scheduled_date: "2025-01-15",
    scheduled_time: "10:00 AM",
    teacher: "Dr. Rajesh Gupta",
    pass_marks: 60
  },
  {
    id: 2,
    name: "Database Systems Quiz",
    subject: "Database Systems",
    duration: 45,
    total_questions: 20,
    status: "Completed",
    scheduled_date: "2025-01-10",
    scheduled_time: "2:00 PM",
    teacher: "Prof. Meena Patel",
    pass_marks: 50
  },
  {
    id: 3,
    name: "Web Development Final",
    subject: "Web Development",
    duration: 120,
    total_questions: 40,
    status: "Scheduled",
    scheduled_date: "2025-01-20",
    scheduled_time: "9:00 AM",
    teacher: "Prof. Meena Patel",
    pass_marks: 70
  }
];

const sampleQuestions = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    type: "MCQ",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct_answer: "O(log n)",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: 2,
    question: "Which SQL command is used to retrieve data from database?",
    type: "MCQ",
    options: ["INSERT", "SELECT", "UPDATE", "DELETE"],
    correct_answer: "SELECT",
    difficulty: "Easy",
    subject: "Database Systems"
  },
  {
    id: 3,
    question: "Explain the difference between let and var in JavaScript.",
    type: "Short Answer",
    difficulty: "Medium",
    subject: "Web Development"
  }
];

const sampleResults = [
  {
    id: 1,
    student_id: 1,
    test_id: 2,
    score: 85,
    total_marks: 100,
    percentage: 85,
    status: "Pass",
    date_taken: "2025-01-10",
    time_taken: "38 minutes"
  },
  {
    id: 2,
    student_id: 2,
    test_id: 2,
    score: 92,
    total_marks: 100,
    percentage: 92,
    status: "Pass",
    date_taken: "2025-01-10",
    time_taken: "42 minutes"
  }
];

const systemStats = {
  total_students: 1250,
  total_teachers: 85,
  active_tests: 12,
  completed_tests: 156,
  total_questions: 2840,
  average_score: 78.5,
  pass_rate: 82.3
};

// Application State
let currentUser = null;
let currentRole = null;
let testTimer = null;
let currentTestData = {
  questions: [],
  currentQuestion: 0,
  answers: {},
  flaggedQuestions: new Set(),
  timeRemaining: 0
};

// Utility Functions
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function showLoading() {
  document.getElementById('loading').classList.add('show');
}

function hideLoading() {
  document.getElementById('loading').classList.remove('show');
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Authentication Functions
function authenticateUser(email, password, role) {
  const users = sampleUsers[role + 's'] || sampleUsers[role];
  const user = users.find(u => u.email === email && password === 'password');
  
  if (user) {
    currentUser = user;
    currentRole = role;
    return true;
  }
  return false;
}

function logout() {
  currentUser = null;
  currentRole = null;
  showPage('login-page');
  showNotification('Logged out successfully', 'info');
}

// Login Page Functions
function initializeLogin() {
  const roleButtons = document.querySelectorAll('.role-btn');
  const loginForm = document.getElementById('login-form');
  let selectedRole = null;
  
  // Role selection
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.dataset.role;
    });
  });
  
  // Login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      showNotification('Please select a role first', 'error');
      return;
    }
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    showLoading();
    
    // Simulate login delay
    setTimeout(() => {
      hideLoading();
      
      if (authenticateUser(email, password, selectedRole)) {
        showNotification(`Welcome, ${currentUser.name}!`, 'success');
        
        // Redirect to appropriate dashboard
        switch (selectedRole) {
          case 'student':
            showPage('student-dashboard');
            initializeStudentDashboard();
            break;
          case 'teacher':
            showPage('teacher-dashboard');
            initializeTeacherDashboard();
            break;
          case 'admin':
            showPage('admin-dashboard');
            initializeAdminDashboard();
            break;
        }
      } else {
        showNotification('Invalid credentials', 'error');
      }
    }, 1000);
  });
}

// Navigation Functions
function initializeNavigation() {
  // Student logout
  const studentLogout = document.getElementById('student-logout');
  if (studentLogout) {
    studentLogout.addEventListener('click', logout);
  }
  
  // Teacher logout
  const teacherLogout = document.getElementById('teacher-logout');
  if (teacherLogout) {
    teacherLogout.addEventListener('click', logout);
  }
  
  // Admin logout
  const adminLogout = document.getElementById('admin-logout');
  if (adminLogout) {
    adminLogout.addEventListener('click', logout);
  }
  
  // Sidebar navigation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      e.preventDefault();
      
      // Remove active class from all nav links in the same sidebar
      const sidebar = e.target.closest('.sidebar');
      if (sidebar) {
        sidebar.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
      }
      
      // Add active class to clicked link
      e.target.classList.add('active');
      
      // Show corresponding content section
      const sectionId = e.target.dataset.section;
      if (sectionId) {
        showContentSection(sectionId);
      }
    }
  });
}

function showContentSection(sectionId) {
  // Hide all content sections in the current dashboard
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

// Student Dashboard Functions
function initializeStudentDashboard() {
  updateStudentProfile();
  updateStudentStats();
  loadAvailableTests();
  loadStudentResults();
  loadStudentSchedule();
  loadStudentProfile();
}

function updateStudentProfile() {
  if (currentUser) {
    const avatar = document.getElementById('student-avatar');
    const name = document.getElementById('student-name');
    const welcomeName = document.getElementById('welcome-name');
    
    if (avatar) avatar.src = currentUser.profile_pic;
    if (name) name.textContent = currentUser.name;
    if (welcomeName) welcomeName.textContent = currentUser.name;
  }
}

function updateStudentStats() {
  const studentResults = sampleResults.filter(r => r.student_id === currentUser.id);
  const completedCount = studentResults.length;
  const pendingCount = sampleTests.filter(t => t.status === 'Available' || t.status === 'Scheduled').length;
  const averageScore = studentResults.length > 0 ? 
    Math.round(studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length) : 0;
  const passCount = studentResults.filter(r => r.status === 'Pass').length;
  const passRate = studentResults.length > 0 ? Math.round((passCount / studentResults.length) * 100) : 0;
  
  document.getElementById('completed-tests').textContent = completedCount;
  document.getElementById('pending-tests').textContent = pendingCount;
  document.getElementById('average-score').textContent = `${averageScore}%`;
  document.getElementById('pass-rate').textContent = `${passRate}%`;
}

function loadAvailableTests() {
  const testsList = document.getElementById('tests-list');
  const availableTests = sampleTests.filter(t => t.status === 'Available' || t.status === 'Scheduled');
  
  testsList.innerHTML = availableTests.map(test => `
    <div class="test-card">
      <div class="test-card-header">
        <div>
          <h3>${test.name}</h3>
          <p>${test.subject}</p>
        </div>
        <span class="status status--${test.status === 'Available' ? 'success' : 'info'}">
          ${test.status}
        </span>
      </div>
      
      <div class="test-meta">
        <div><strong>Duration:</strong> ${test.duration} mins</div>
        <div><strong>Questions:</strong> ${test.total_questions}</div>
        <div><strong>Date:</strong> ${formatDate(test.scheduled_date)}</div>
        <div><strong>Time:</strong> ${test.scheduled_time}</div>
      </div>
      
      <div class="test-actions">
        ${test.status === 'Available' ? 
          `<button class="btn btn--primary" onclick="startTest(${test.id})">
            <i class="fas fa-play"></i> Start Test
          </button>` : 
          `<button class="btn btn--secondary" disabled>
            <i class="fas fa-clock"></i> Scheduled
          </button>`
        }
        <button class="btn btn--outline" onclick="viewTestDetails(${test.id})">
          <i class="fas fa-info-circle"></i> Details
        </button>
      </div>
    </div>
  `).join('');
}

function loadStudentResults() {
  const resultsList = document.getElementById('results-list');
  const recentResults = document.getElementById('recent-results');
  const studentResults = sampleResults.filter(r => r.student_id === currentUser.id);
  
  const resultsHTML = studentResults.map(result => {
    const test = sampleTests.find(t => t.id === result.test_id);
    return `
      <tr>
        <td>${test ? test.name : 'Unknown Test'}</td>
        <td>${test ? test.subject : 'Unknown'}</td>
        <td>${result.score}/${result.total_marks}</td>
        <td>${result.percentage}%</td>
        <td><span class="status status--${result.status === 'Pass' ? 'success' : 'error'}">${result.status}</span></td>
        <td>${formatDate(result.date_taken)}</td>
        <td>${result.time_taken}</td>
      </tr>
    `;
  }).join('');
  
  resultsList.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Subject</th>
          <th>Score</th>
          <th>Percentage</th>
          <th>Status</th>
          <th>Date</th>
          <th>Time Taken</th>
        </tr>
      </thead>
      <tbody>
        ${resultsHTML}
      </tbody>
    </table>
  `;
  
  // Recent results for dashboard
  const recentResultsHTML = studentResults.slice(0, 3).map(result => {
    const test = sampleTests.find(t => t.id === result.test_id);
    return `
      <div class="result-item">
        <div class="result-info">
          <h4>${test ? test.name : 'Unknown Test'}</h4>
          <p>${test ? test.subject : 'Unknown'} • ${formatDate(result.date_taken)}</p>
        </div>
        <div class="result-score">
          <span class="score">${result.percentage}%</span>
          <span class="status status--${result.status === 'Pass' ? 'success' : 'error'}">${result.status}</span>
        </div>
      </div>
    `;
  }).join('');
  
  recentResults.innerHTML = recentResultsHTML || '<p>No test results yet.</p>';
}

function loadStudentSchedule() {
  const scheduleList = document.getElementById('schedule-list');
  const scheduledTests = sampleTests.filter(t => t.status === 'Scheduled' || t.status === 'Available');
  
  scheduleList.innerHTML = scheduledTests.map(test => `
    <div class="schedule-card card">
      <div class="card__body">
        <h3>${test.name}</h3>
        <p><strong>Subject:</strong> ${test.subject}</p>
        <p><strong>Date:</strong> ${formatDate(test.scheduled_date)}</p>
        <p><strong>Time:</strong> ${test.scheduled_time}</p>
        <p><strong>Duration:</strong> ${test.duration} minutes</p>
        <p><strong>Teacher:</strong> ${test.teacher}</p>
      </div>
    </div>
  `).join('');
}

function loadStudentProfile() {
  const profileInfo = document.getElementById('profile-info');
  
  if (currentUser) {
    profileInfo.innerHTML = `
      <div class="profile-details">
        <div class="profile-avatar">
          <img src="${currentUser.profile_pic}" alt="${currentUser.name}" class="avatar" style="width: 100px; height: 100px;">
        </div>
        <div class="profile-data">
          <h3>${currentUser.name}</h3>
          <p><strong>Email:</strong> ${currentUser.email}</p>
          <p><strong>Class:</strong> ${currentUser.class}</p>
          <p><strong>Student ID:</strong> STU${String(currentUser.id).padStart(6, '0')}</p>
        </div>
      </div>
      
      <div class="profile-stats">
        <h4>Academic Performance</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">${sampleResults.filter(r => r.student_id === currentUser.id).length}</span>
            <span class="stat-label">Tests Completed</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${sampleResults.filter(r => r.student_id === currentUser.id && r.status === 'Pass').length}</span>
            <span class="stat-label">Tests Passed</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Test Taking Functions
function startTest(testId) {
  const test = sampleTests.find(t => t.id === testId);
  if (!test) {
    showNotification('Test not found', 'error');
    return;
  }
  
  // Initialize test data
  currentTestData = {
    test: test,
    questions: generateTestQuestions(test),
    currentQuestion: 0,
    answers: {},
    flaggedQuestions: new Set(),
    timeRemaining: test.duration * 60 // Convert to seconds
  };
  
  showPage('test-interface');
  initializeTestInterface();
  startTestTimer();
}

function generateTestQuestions(test) {
  // Filter questions by subject
  const subjectQuestions = sampleQuestions.filter(q => q.subject === test.subject);
  
  // For demo, repeat questions to match test.total_questions
  const questions = [];
  for (let i = 0; i < test.total_questions; i++) {
    const baseQuestion = subjectQuestions[i % subjectQuestions.length];
    questions.push({
      ...baseQuestion,
      id: i + 1,
      question: `${baseQuestion.question} (Question ${i + 1})`
    });
  }
  
  return questions;
}

function initializeTestInterface() {
  const { test, questions } = currentTestData;
  
  // Update test header
  document.getElementById('test-title').textContent = test.name;
  document.getElementById('test-subject').textContent = test.subject;
  
  // Generate question navigation
  generateQuestionNavigation();
  
  // Show first question
  showQuestion(0);
  
  // Initialize event listeners
  document.getElementById('prev-question').addEventListener('click', () => {
    if (currentTestData.currentQuestion > 0) {
      showQuestion(currentTestData.currentQuestion - 1);
    }
  });
  
  document.getElementById('next-question').addEventListener('click', () => {
    if (currentTestData.currentQuestion < currentTestData.questions.length - 1) {
      showQuestion(currentTestData.currentQuestion + 1);
    }
  });
  
  document.getElementById('flag-question').addEventListener('click', toggleQuestionFlag);
  document.getElementById('submit-test').addEventListener('click', submitTest);
}

function generateQuestionNavigation() {
  const questionGrid = document.getElementById('question-grid');
  const { questions } = currentTestData;
  
  questionGrid.innerHTML = questions.map((_, index) => `
    <button class="question-btn" data-question="${index}" onclick="showQuestion(${index})">
      ${index + 1}
    </button>
  `).join('');
}

function showQuestion(index) {
  const { questions, answers, flaggedQuestions } = currentTestData;
  const question = questions[index];
  
  if (!question) return;
  
  currentTestData.currentQuestion = index;
  
  // Update question content
  document.querySelector('.question-number').textContent = `Question ${index + 1} of ${questions.length}`;
  document.getElementById('question-text').textContent = question.question;
  
  // Update navigation buttons
  document.getElementById('prev-question').style.display = index === 0 ? 'none' : 'inline-flex';
  document.getElementById('next-question').style.display = index === questions.length - 1 ? 'none' : 'inline-flex';
  document.getElementById('submit-test').style.display = index === questions.length - 1 ? 'inline-flex' : 'none';
  
  // Update flag button
  const flagBtn = document.getElementById('flag-question');
  flagBtn.classList.toggle('flagged', flaggedQuestions.has(index));
  
  // Show question options
  const optionsContainer = document.getElementById('question-options');
  
  if (question.type === 'MCQ') {
    optionsContainer.innerHTML = question.options.map((option, optIndex) => `
      <div class="option" onclick="selectAnswer(${index}, '${option}')">
        <input type="radio" name="question-${index}" value="${option}" 
               ${answers[index] === option ? 'checked' : ''}>
        <label>${option}</label>
      </div>
    `).join('');
  } else if (question.type === 'True/False') {
    optionsContainer.innerHTML = `
      <div class="option" onclick="selectAnswer(${index}, 'True')">
        <input type="radio" name="question-${index}" value="True" 
               ${answers[index] === 'True' ? 'checked' : ''}>
        <label>True</label>
      </div>
      <div class="option" onclick="selectAnswer(${index}, 'False')">
        <input type="radio" name="question-${index}" value="False" 
               ${answers[index] === 'False' ? 'checked' : ''}>
        <label>False</label>
      </div>
    `;
  } else {
    optionsContainer.innerHTML = `
      <textarea class="form-control" rows="5" placeholder="Type your answer here..." 
                onchange="selectAnswer(${index}, this.value)">${answers[index] || ''}</textarea>
    `;
  }
  
  // Update question navigation
  updateQuestionNavigation();
}

function selectAnswer(questionIndex, answer) {
  currentTestData.answers[questionIndex] = answer;
  updateQuestionNavigation();
  
  // Auto-save indication
  showNotification('Answer saved automatically', 'success');
}

function toggleQuestionFlag() {
  const { currentQuestion, flaggedQuestions } = currentTestData;
  
  if (flaggedQuestions.has(currentQuestion)) {
    flaggedQuestions.delete(currentQuestion);
  } else {
    flaggedQuestions.add(currentQuestion);
  }
  
  // Update flag button
  const flagBtn = document.getElementById('flag-question');
  flagBtn.classList.toggle('flagged', flaggedQuestions.has(currentQuestion));
  
  updateQuestionNavigation();
}

function updateQuestionNavigation() {
  const { answers, flaggedQuestions } = currentTestData;
  
  document.querySelectorAll('.question-btn').forEach((btn, index) => {
    btn.classList.remove('active', 'answered', 'flagged');
    
    if (index === currentTestData.currentQuestion) {
      btn.classList.add('active');
    }
    
    if (answers.hasOwnProperty(index) && answers[index] !== '') {
      btn.classList.add('answered');
    }
    
    if (flaggedQuestions.has(index)) {
      btn.classList.add('flagged');
    }
  });
}

function startTestTimer() {
  updateTimerDisplay();
  
  testTimer = setInterval(() => {
    currentTestData.timeRemaining--;
    updateTimerDisplay();
    
    if (currentTestData.timeRemaining <= 0) {
      clearInterval(testTimer);
      showNotification('Time is up! Submitting test automatically.', 'warning');
      setTimeout(submitTest, 2000);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timer = document.getElementById('timer');
  const timeRemaining = currentTestData.timeRemaining;
  
  timer.textContent = formatTime(timeRemaining);
  
  // Change color when time is running low
  if (timeRemaining <= 300) { // 5 minutes
    timer.style.color = 'var(--color-error)';
  } else if (timeRemaining <= 600) { // 10 minutes
    timer.style.color = 'var(--color-warning)';
  }
}

function submitTest() {
  if (testTimer) {
    clearInterval(testTimer);
  }
  
  const { test, answers, questions } = currentTestData;
  
  // Calculate score
  let correctAnswers = 0;
  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    if (question.correct_answer && userAnswer === question.correct_answer) {
      correctAnswers++;
    }
  });
  
  const score = Math.round((correctAnswers / questions.length) * 100);
  const status = score >= test.pass_marks ? 'Pass' : 'Fail';
  
  // Create result record
  const newResult = {
    id: sampleResults.length + 1,
    student_id: currentUser.id,
    test_id: test.id,
    score: score,
    total_marks: 100,
    percentage: score,
    status: status,
    date_taken: new Date().toISOString().split('T')[0],
    time_taken: `${Math.floor((test.duration * 60 - currentTestData.timeRemaining) / 60)} minutes`
  };
  
  sampleResults.push(newResult);
  
  // Show results
  showNotification(`Test submitted! You scored ${score}% (${status})`, status === 'Pass' ? 'success' : 'error');
  
  // Return to student dashboard
  setTimeout(() => {
    showPage('student-dashboard');
    initializeStudentDashboard();
  }, 3000);
}

// Teacher Dashboard Functions
function initializeTeacherDashboard() {
  updateTeacherProfile();
  updateTeacherStats();
  loadTeacherResults();
  loadQuestionBank();
  initializeTeacherForms();
}

function updateTeacherProfile() {
  if (currentUser) {
    const avatar = document.getElementById('teacher-avatar');
    const name = document.getElementById('teacher-name');
    const welcomeName = document.getElementById('teacher-welcome-name');
    
    if (avatar) avatar.src = currentUser.profile_pic;
    if (name) name.textContent = currentUser.name;
    if (welcomeName) welcomeName.textContent = currentUser.name;
  }
}

function updateTeacherStats() {
  // Calculate teacher-specific stats
  const teacherTests = sampleTests.filter(t => t.teacher === currentUser.name);
  const teacherSubjects = currentUser.subjects || [];
  const subjectQuestions = sampleQuestions.filter(q => teacherSubjects.includes(q.subject));
  
  document.getElementById('total-students').textContent = systemStats.total_students;
  document.getElementById('active-tests').textContent = teacherTests.filter(t => t.status === 'Available').length;
  document.getElementById('class-average').textContent = `${systemStats.average_score}%`;
  document.getElementById('question-count').textContent = subjectQuestions.length;
}

function loadTeacherResults() {
  const teacherResults = document.getElementById('teacher-recent-results');
  const teacherTests = sampleTests.filter(t => t.teacher === currentUser.name);
  const teacherTestIds = teacherTests.map(t => t.id);
  const relevantResults = sampleResults.filter(r => teacherTestIds.includes(r.test_id));
  
  const resultsHTML = relevantResults.slice(0, 5).map(result => {
    const test = sampleTests.find(t => t.id === result.test_id);
    const student = sampleUsers.students.find(s => s.id === result.student_id);
    return `
      <tr>
        <td>${student ? student.name : 'Unknown Student'}</td>
        <td>${test ? test.name : 'Unknown Test'}</td>
        <td>${result.percentage}%</td>
        <td><span class="status status--${result.status === 'Pass' ? 'success' : 'error'}">${result.status}</span></td>
        <td>${formatDate(result.date_taken)}</td>
      </tr>
    `;
  }).join('');
  
  teacherResults.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Test</th>
          <th>Score</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${resultsHTML || '<tr><td colspan="5">No results available</td></tr>'}
      </tbody>
    </table>
  `;
}

function loadQuestionBank() {
  const questionBankList = document.getElementById('question-bank-list');
  const teacherSubjects = currentUser.subjects || [];
  const questions = sampleQuestions.filter(q => teacherSubjects.includes(q.subject));
  
  questionBankList.innerHTML = questions.map(question => `
    <div class="question-item card">
      <div class="card__body">
        <div class="question-header">
          <span class="question-type status status--info">${question.type}</span>
          <span class="question-difficulty status status--${question.difficulty === 'Easy' ? 'success' : question.difficulty === 'Medium' ? 'warning' : 'error'}">
            ${question.difficulty}
          </span>
        </div>
        <h4>${question.question}</h4>
        <p><strong>Subject:</strong> ${question.subject}</p>
        ${question.options ? `<p><strong>Options:</strong> ${question.options.join(', ')}</p>` : ''}
        ${question.correct_answer ? `<p><strong>Answer:</strong> ${question.correct_answer}</p>` : ''}
        <div class="question-actions">
          <button class="btn btn--sm btn--outline" onclick="editQuestion(${question.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn--sm btn--outline" onclick="deleteQuestion(${question.id})">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function initializeTeacherForms() {
  // Question form
  const questionForm = document.getElementById('question-form');
  const questionType = document.getElementById('question-type');
  const mcqOptions = document.getElementById('mcq-options');
  const tfOptions = document.getElementById('tf-options');
  
  questionType.addEventListener('change', () => {
    mcqOptions.style.display = questionType.value === 'MCQ' ? 'block' : 'none';
    tfOptions.style.display = questionType.value === 'True/False' ? 'block' : 'none';
  });
  
  questionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveQuestion();
  });
  
  // Test form
  const testForm = document.getElementById('test-form');
  testForm.addEventListener('submit', (e) => {
    e.preventDefault();
    createTest();
  });
  
  // Schedule form
  const scheduleForm = document.getElementById('schedule-form');
  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    scheduleTest();
  });
  
  // Load test options for scheduling
  loadTestsForScheduling();
}

function saveQuestion() {
  const formData = {
    subject: document.getElementById('question-subject').value,
    type: document.getElementById('question-type').value,
    question: document.getElementById('question-text').value,
    difficulty: document.getElementById('question-difficulty').value
  };
  
  if (formData.type === 'MCQ') {
    const options = Array.from(document.querySelectorAll('#mcq-options input[type="text"]'))
      .map(input => input.value)
      .filter(value => value.trim() !== '');
    
    const correctIndex = document.querySelector('#mcq-options input[type="radio"]:checked')?.value;
    
    if (options.length < 2) {
      showNotification('Please provide at least 2 options', 'error');
      return;
    }
    
    if (correctIndex === undefined) {
      showNotification('Please select the correct answer', 'error');
      return;
    }
    
    formData.options = options;
    formData.correct_answer = options[parseInt(correctIndex)];
  } else if (formData.type === 'True/False') {
    const correctAnswer = document.querySelector('input[name="tf-answer"]:checked')?.value;
    
    if (!correctAnswer) {
      showNotification('Please select the correct answer', 'error');
      return;
    }
    
    formData.correct_answer = correctAnswer === 'true';
  }
  
  // Add question to bank
  const newQuestion = {
    id: sampleQuestions.length + 1,
    ...formData
  };
  
  sampleQuestions.push(newQuestion);
  
  showNotification('Question saved successfully!', 'success');
  document.getElementById('question-form').reset();
  document.getElementById('mcq-options').style.display = 'none';
  document.getElementById('tf-options').style.display = 'none';
  
  // Reload question bank
  loadQuestionBank();
}

function createTest() {
  const formData = {
    name: document.getElementById('test-name').value,
    subject: document.getElementById('test-subject').value,
    duration: parseInt(document.getElementById('test-duration').value),
    pass_marks: parseInt(document.getElementById('test-pass-marks').value),
    description: document.getElementById('test-description').value
  };
  
  // Create new test
  const newTest = {
    id: sampleTests.length + 1,
    ...formData,
    total_questions: 20, // Default
    status: 'Draft',
    teacher: currentUser.name,
    scheduled_date: '',
    scheduled_time: ''
  };
  
  sampleTests.push(newTest);
  
  showNotification('Test created successfully!', 'success');
  document.getElementById('test-form').reset();
  
  // Reload tests for scheduling
  loadTestsForScheduling();
}

function loadTestsForScheduling() {
  const scheduleTestSelect = document.getElementById('schedule-test-select');
  const teacherTests = sampleTests.filter(t => t.teacher === currentUser.name);
  
  scheduleTestSelect.innerHTML = '<option value="">Select Test</option>' +
    teacherTests.map(test => `<option value="${test.id}">${test.name}</option>`).join('');
}

function scheduleTest() {
  const testId = document.getElementById('schedule-test-select').value;
  const date = document.getElementById('schedule-date').value;
  const time = document.getElementById('schedule-time').value;
  const className = document.getElementById('schedule-class').value;
  
  if (!testId || !date || !time || !className) {
    showNotification('Please fill all fields', 'error');
    return;
  }
  
  // Update test
  const test = sampleTests.find(t => t.id === parseInt(testId));
  if (test) {
    test.scheduled_date = date;
    test.scheduled_time = time;
    test.status = 'Scheduled';
    test.class = className;
  }
  
  showNotification('Test scheduled successfully!', 'success');
  document.getElementById('schedule-form').reset();
}

// Admin Dashboard Functions
function initializeAdminDashboard() {
  updateAdminProfile();
  updateAdminStats();
  loadUsersTable();
  loadAdminTestsTable();
  loadAdminStudentsTable();
  loadAdminTeachersTable();
  initializeAdminCharts();
  initializeAdminFilters();
}

function updateAdminProfile() {
  if (currentUser) {
    const avatar = document.getElementById('admin-avatar');
    const name = document.getElementById('admin-name');
    
    if (avatar) avatar.src = currentUser.profile_pic;
    if (name) name.textContent = currentUser.name;
  }
}

function updateAdminStats() {
  // Update all system statistics
  document.getElementById('admin-total-students').textContent = systemStats.total_students;
  document.getElementById('admin-total-teachers').textContent = systemStats.total_teachers;
  document.getElementById('admin-active-tests').textContent = systemStats.active_tests;
  document.getElementById('admin-completed-tests').textContent = systemStats.completed_tests;
  document.getElementById('admin-total-questions').textContent = systemStats.total_questions;
  document.getElementById('admin-average-score').textContent = `${systemStats.average_score}%`;
  document.getElementById('admin-pass-rate').textContent = `${systemStats.pass_rate}%`;
  document.getElementById('admin-growth').textContent = '+12%';
}

function loadUsersTable() {
  const usersTable = document.getElementById('users-table');
  const allUsers = [
    ...sampleUsers.students.map(u => ({...u, role: 'Student'})),
    ...sampleUsers.teachers.map(u => ({...u, role: 'Teacher'})),
    ...sampleUsers.admin.map(u => ({...u, role: 'Admin'}))
  ];
  
  const usersHTML = allUsers.map(user => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${user.profile_pic}" alt="${user.name}" class="avatar" style="width: 32px; height: 32px;">
          ${user.name}
        </div>
      </td>
      <td>${user.email}</td>
      <td><span class="status status--info">${user.role}</span></td>
      <td>${user.class || user.subjects?.join(', ') || 'N/A'}</td>
      <td>
        <button class="btn btn--sm btn--outline" onclick="editUser(${user.id}, '${user.role.toLowerCase()}')">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn--sm btn--outline" onclick="deleteUser(${user.id}, '${user.role.toLowerCase()}')">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
  
  usersTable.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Details</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${usersHTML}
      </tbody>
    </table>
  `;
}

function loadAdminTestsTable() {
  const testsTable = document.getElementById('admin-tests-table');
  
  const testsHTML = sampleTests.map(test => `
    <tr>
      <td>${test.name}</td>
      <td>${test.subject}</td>
      <td>${test.teacher}</td>
      <td>${test.duration} mins</td>
      <td><span class="status status--${test.status === 'Available' ? 'success' : test.status === 'Scheduled' ? 'info' : 'warning'}">${test.status}</span></td>
      <td>${test.scheduled_date ? formatDate(test.scheduled_date) : 'Not scheduled'}</td>
      <td>
        <button class="btn btn--sm btn--outline" onclick="viewTestDetails(${test.id})">
          <i class="fas fa-eye"></i> View
        </button>
        <button class="btn btn--sm btn--outline" onclick="editTest(${test.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
      </td>
    </tr>
  `).join('');
  
  testsTable.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Subject</th>
          <th>Teacher</th>
          <th>Duration</th>
          <th>Status</th>
          <th>Scheduled Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${testsHTML}
      </tbody>
    </table>
  `;
}

function loadAdminStudentsTable() {
  const studentsTable = document.getElementById('admin-students-table');
  
  const studentsHTML = sampleUsers.students.map(student => {
    const studentResults = sampleResults.filter(r => r.student_id === student.id);
    const avgScore = studentResults.length > 0 ? 
      Math.round(studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length) : 0;
    
    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${student.profile_pic}" alt="${student.name}" class="avatar" style="width: 32px; height: 32px;">
            ${student.name}
          </div>
        </td>
        <td>${student.email}</td>
        <td>${student.class}</td>
        <td>${studentResults.length}</td>
        <td>${avgScore}%</td>
        <td>
          <button class="btn btn--sm btn--outline" onclick="viewStudentDetails(${student.id})">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn btn--sm btn--outline" onclick="editStudent(${student.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  studentsTable.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Class</th>
          <th>Tests Taken</th>
          <th>Average Score</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${studentsHTML}
      </tbody>
    </table>
  `;
}

function loadAdminTeachersTable() {
  const teachersTable = document.getElementById('admin-teachers-table');
  
  const teachersHTML = sampleUsers.teachers.map(teacher => {
    const teacherTests = sampleTests.filter(t => t.teacher === teacher.name);
    
    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${teacher.profile_pic}" alt="${teacher.name}" class="avatar" style="width: 32px; height: 32px;">
            ${teacher.name}
          </div>
        </td>
        <td>${teacher.email}</td>
        <td>${teacher.subjects ? teacher.subjects.join(', ') : 'N/A'}</td>
        <td>${teacherTests.length}</td>
        <td>
          <button class="btn btn--sm btn--outline" onclick="viewTeacherDetails(${teacher.id})">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn btn--sm btn--outline" onclick="editTeacher(${teacher.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  teachersTable.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Subjects</th>
          <th>Tests Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${teachersHTML}
      </tbody>
    </table>
  `;
}

function initializeAdminCharts() {
  // Performance Chart
  const performanceCtx = document.getElementById('performance-chart');
  if (performanceCtx) {
    new Chart(performanceCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Average Score',
          data: [75, 78, 82, 79, 83, 85],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  
  // Activity Chart
  const activityCtx = document.getElementById('activity-chart');
  if (activityCtx) {
    new Chart(activityCtx, {
      type: 'doughnut',
      data: {
        labels: ['Students', 'Teachers', 'Active Tests'],
        datasets: [{
          data: [1250, 85, 12],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // Monthly Tests Chart
  const monthlyTestsCtx = document.getElementById('monthly-tests-chart');
  if (monthlyTestsCtx) {
    new Chart(monthlyTestsCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Tests Conducted',
          data: [24, 28, 32, 26, 35, 30],
          backgroundColor: '#1FB8CD'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  // Subject Performance Chart
  const subjectPerformanceCtx = document.getElementById('subject-performance-chart');
  if (subjectPerformanceCtx) {
    new Chart(subjectPerformanceCtx, {
      type: 'radar',
      data: {
        labels: ['Data Structures', 'Database Systems', 'Web Development', 'Algorithms', 'Programming'],
        datasets: [{
          label: 'Average Performance',
          data: [85, 78, 82, 79, 88],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.2)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  
  // Registration Chart
  const registrationCtx = document.getElementById('registration-chart');
  if (registrationCtx) {
    new Chart(registrationCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Students',
            data: [1150, 1180, 1200, 1220, 1235, 1250],
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)'
          },
          {
            label: 'Teachers',
            data: [78, 80, 82, 83, 84, 85],
            borderColor: '#FFC185',
            backgroundColor: 'rgba(255, 193, 133, 0.1)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // Usage Chart
  const usageCtx = document.getElementById('usage-chart');
  if (usageCtx) {
    new Chart(usageCtx, {
      type: 'pie',
      data: {
        labels: ['Tests Taken', 'Questions Answered', 'Active Sessions'],
        datasets: [{
          data: [156, 2840, 45],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}

function initializeAdminFilters() {
  // User search and filter
  const userSearch = document.getElementById('user-search');
  const userRoleFilter = document.getElementById('user-role-filter');
  
  if (userSearch) {
    userSearch.addEventListener('input', filterUsers);
  }
  
  if (userRoleFilter) {
    userRoleFilter.addEventListener('change', filterUsers);
  }
  
  // Test search and filter
  const testSearch = document.getElementById('test-search');
  const testStatusFilter = document.getElementById('test-status-filter');
  
  if (testSearch) {
    testSearch.addEventListener('input', filterTests);
  }
  
  if (testStatusFilter) {
    testStatusFilter.addEventListener('change', filterTests);
  }
}

function filterUsers() {
  // Implementation for user filtering
  console.log('Filtering users...');
}

function filterTests() {
  // Implementation for test filtering
  console.log('Filtering tests...');
}

// Placeholder functions for various actions
function viewTestDetails(testId) {
  const test = sampleTests.find(t => t.id === testId);
  if (test) {
    showNotification(`Viewing details for: ${test.name}`, 'info');
  }
}

function editQuestion(questionId) {
  showNotification('Edit question functionality coming soon', 'info');
}

function deleteQuestion(questionId) {
  if (confirm('Are you sure you want to delete this question?')) {
    const index = sampleQuestions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      sampleQuestions.splice(index, 1);
      loadQuestionBank();
      showNotification('Question deleted successfully', 'success');
    }
  }
}

function editUser(userId, role) {
  showNotification(`Edit ${role} functionality coming soon`, 'info');
}

function deleteUser(userId, role) {
  if (confirm(`Are you sure you want to delete this ${role}?`)) {
    showNotification(`Delete ${role} functionality coming soon`, 'info');
  }
}

function editTest(testId) {
  showNotification('Edit test functionality coming soon', 'info');
}

function viewStudentDetails(studentId) {
  const student = sampleUsers.students.find(s => s.id === studentId);
  if (student) {
    showNotification(`Viewing details for: ${student.name}`, 'info');
  }
}

function editStudent(studentId) {
  showNotification('Edit student functionality coming soon', 'info');
}

function viewTeacherDetails(teacherId) {
  const teacher = sampleUsers.teachers.find(t => t.id === teacherId);
  if (teacher) {
    showNotification(`Viewing details for: ${teacher.name}`, 'info');
  }
}

function editTeacher(teacherId) {
  showNotification('Edit teacher functionality coming soon', 'info');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeLogin();
  initializeNavigation();
  
  // Show login page by default
  showPage('login-page');
});