// Clean Dental Training System - Fresh Start

  // Global variables
  let currentStep = 0;
  const totalSteps = 8;
  let videoCompletions = {
      intro: false,
      ring: false,
      greeting: false,
      audio: false,
      practice: false
  };

  // Ring exercise
  let ringCount = 0;
  let hasAnswered = false;
  let phoneRing = new Audio('assets/audio/phone-ring.mp3');

  // Greeting builder
  let draggedElement = null;
  let greetingOrder = [null, null, null, null];

  // Audio ratings
  let audioRatings = [0, 0, 0];

  // Recording
  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;

  // Initialize when page loads
  document.addEventListener('DOMContentLoaded', function() {
      console.log('🦷 Dental Training System Loading...');
      setupEventListeners();
      setupWistiaVideos();
      updateProgress();
      console.log('✅ System Ready!');
  });

  // Set up all event listeners
  function setupEventListeners() {
      // Navigation buttons
      document.getElementById('start-btn').addEventListener('click', () => goToSection('ring-intro-video', 1));
      document.getElementById('continue-to-ring').addEventListener('click', () => goToSection('ring-exercise', 2));
      document.getElementById('continue-to-greeting').addEventListener('click', () => {
          goToSection('greeting-builder', 4);
          setTimeout(initializeGreetingBuilder, 100);
      });
      document.getElementById('continue-to-audio').addEventListener('click', () => {
          goToSection('audio-comparison', 6);
          setTimeout(initializeAudioComparison, 100);
      });
      document.getElementById('continue-to-practice').addEventListener('click', () => {
          goToSection('practice-recorder', 8);
          setTimeout(initializePracticeRecorder, 100);
      });

      // Ring exercise
      document.getElementById('start-ringing').addEventListener('click', startPhoneRinging);
      document.getElementById('answer-btn').addEventListener('click', answerPhone);
  }

  // Wistia video setup using proven method
  function setupWistiaVideos() {
      window._wq = window._wq || [];

      // Video configurations
      const videos = [
          { id: '6vif2yc5c5', buttonId: 'start-btn', type: 'intro' },
          { id: 'ou03n83tjo', buttonId: 'continue-to-ring', type: 'ring' },
          { id: '7be6v4rh7b', buttonId: 'continue-to-greeting', type: 'greeting' },
          { id: '2yynxcpkld', buttonId: 'continue-to-audio', type: 'audio' },
          { id: 'mut2ffueih', buttonId: 'continue-to-practice', type: 'practice' }
      ];

      // Set up each video
      videos.forEach(({ id, buttonId, type }) => {
          window._wq.push({
              id: id,
              onReady: function(video) {
                  console.log(`${type} video ready`);
                  video.bind('end', function() {
                      console.log(`${type} video completed`);
                      enableButton(buttonId, type);
                  });
              }
          });
      });
  }

  // Enable button after video completion
  function enableButton(buttonId, videoType) {
      videoCompletions[videoType] = true;

      // Show completion indicator
      const indicator = document.getElementById(`${videoType}-video-completed`);
      if (indicator) indicator.style.display = 'block';

      // Enable button
      const button = document.getElementById(buttonId);
      if (button) {
          button.disabled = false;
          button.classList.add('video-completed');
      }
  }

  // Navigate to section
  function goToSection(sectionId, step) {
      // Hide all sections
      document.querySelectorAll('.section').forEach(section => {
          section.classList.remove('active');
      });

      // Show target section
      document.getElementById(sectionId).classList.add('active');

      // Update progress
      currentStep = step;
      updateProgress();

      // Stop phone ringing
      hasAnswered = true;
  }

  // Update progress bar
  function updateProgress() {
      const progressPercent = (currentStep / totalSteps) * 100;
      document.getElementById('progress').style.width = progressPercent + '%';
  }

  // === PHONE RINGING EXERCISE ===
  function startPhoneRinging() {
      ringCount = 0;
      hasAnswered = false;

      // Reset UI
      document.getElementById('ring-count').textContent = '0';
      document.getElementById('answer-btn').disabled = true;
      document.getElementById('feedback').innerHTML = '';
      document.getElementById('start-ringing').disabled = true;
      document.getElementById('start-ringing').textContent = 'Ringing...';

      // Start ringing
      setTimeout(playRing, 500);
  }

  function playRing() {
      if (ringCount >= 5 || hasAnswered) {
          if (ringCount >= 5) {
              showFeedback('Too many rings! Patients may hang up. Try again.', 'warning');
              resetRingExercise();
          }
          return;
      }

      ringCount++;

      // Play sound
      phoneRing.currentTime = 0;
      phoneRing.volume = 0.8;
      phoneRing.play().catch(() => console.log('Audio autoplay blocked'));

      // Update display
      document.getElementById('ring-count').textContent = ringCount;

      if (ringCount >= 1) {
          document.getElementById('answer-btn').disabled = false;
      }

      // Next ring
      setTimeout(playRing, 3500);
  }

  function answerPhone() {
      if (hasAnswered) return;
      hasAnswered = true;

      if (ringCount === 1) {
          showFeedback('Too fast! Use the first 2 rings to prepare. Try again.', 'warning');
          setTimeout(resetRingExercise, 4000);
      } else if (ringCount === 2) {
          showFeedback('Good timing! Professional and prepared.', 'success');
          setTimeout(resetRingExercise, 4000);
      } else if (ringCount === 3) {
          showFeedback('Perfect! The gold standard - professional and respectful.', 'success');
          currentStep = 3;
          updateProgress();
          setTimeout(() => {
              document.getElementById('start-ringing').disabled = false;
              document.getElementById('start-ringing').textContent = 'Continue to Greeting Video';
              document.getElementById('start-ringing').onclick = () => goToSection('greeting-intro-video', 3);
          }, 4000);
      } else {
          showFeedback('Good, but try to answer by the 3rd ring.', 'warning');
          setTimeout(resetRingExercise, 4000);
      }
  }

  function resetRingExercise() {
      document.getElementById('start-ringing').disabled = false;
      document.getElementById('start-ringing').textContent = 'Try Again';
      document.getElementById('answer-btn').disabled = true;
  }

  function showFeedback(message, type) {
      const feedback = document.getElementById('feedback');
      feedback.innerHTML = message;
      feedback.className = 'feedback ' + type;
  }

  // === GREETING BUILDER ===
  function initializeGreetingBuilder() {
      const components = document.querySelectorAll('.component');
      const dropSlots = document.querySelectorAll('.drop-slot');
      const checkButton = document.getElementById('check-greeting');

      if (!components.length || !checkButton) {
          setTimeout(initializeGreetingBuilder, 500);
          return;
      }

      // Drag events
      components.forEach(component => {
          component.addEventListener('dragstart', (e) => {
              draggedElement = e.target;
              e.target.classList.add('dragging');
          });
          component.addEventListener('dragend', (e) => {
              e.target.classList.remove('dragging');
              draggedElement = null;
          });
      });

      // Drop events
      dropSlots.forEach(slot => {
          slot.addEventListener('dragover', (e) => e.preventDefault());
          slot.addEventListener('dragenter', (e) => {
              if (e.target.classList.contains('drop-slot') && !e.target.classList.contains('filled')) {
                  e.target.classList.add('drag-over');
              }
          });
          slot.addEventListener('dragleave', (e) => e.target.classList.remove('drag-over'));
          slot.addEventListener('drop', handleDrop);
      });

      checkButton.addEventListener('click', checkGreeting);
  }

  function handleDrop(e) {
      e.preventDefault();
      e.target.classList.remove('drag-over');

      if (draggedElement && e.target.classList.contains('drop-slot') && !e.target.classList.contains('filled')) {
          const slotPosition = parseInt(e.target.dataset.position) - 1;
          const componentOrder = parseInt(draggedElement.dataset.order);

          e.target.innerHTML = draggedElement.outerHTML;
          e.target.classList.add('filled');
          draggedElement.style.display = 'none';
          greetingOrder[slotPosition] = componentOrder;

          if (greetingOrder.every(slot => slot !== null)) {
              document.getElementById('check-greeting').disabled = false;
          }
      }
  }

  function checkGreeting() {
      const correctOrder = [1, 2, 3, 4];
      const isCorrect = greetingOrder.every((order, index) => order === correctOrder[index]);

      const feedback = document.getElementById('greeting-feedback');
      if (isCorrect) {
          feedback.innerHTML = 'Perfect! You\'ve mastered the 4-part greeting structure.';
          feedback.className = 'feedback success';
          document.getElementById('next-section').style.display = 'inline-block';
          document.getElementById('next-section').onclick = () => goToSection('audio-intro-video', 5);
      } else {
          feedback.innerHTML = 'Not quite right. Remember: Time → Practice → Name → Question';
          feedback.className = 'feedback warning';
          resetGreetingBuilder();
      }
  }

  function resetGreetingBuilder() {
      document.querySelectorAll('.drop-slot').forEach((slot, index) => {
          slot.classList.remove('filled');
          const positions = ['first', 'second', 'third', 'fourth'];
          slot.innerHTML = `Drop ${positions[index]} part here`;
      });

      document.querySelectorAll('.component').forEach(c => c.style.display = 'block');
      greetingOrder = [null, null, null, null];
      document.getElementById('check-greeting').disabled = true;
  }

  // === AUDIO COMPARISON ===
  function initializeAudioComparison() {
      const stars = document.querySelectorAll('.star');
      if (!stars.length) {
          setTimeout(initializeAudioComparison, 500);
          return;
      }

      stars.forEach(star => star.addEventListener('click', handleStarClick));
  }

  function handleStarClick(e) {
      const rating = parseInt(e.target.dataset.value);
      const starContainer = e.target.parentElement;
      const exampleCard = starContainer.closest('.audio-card');
      const exampleNumber = parseInt(exampleCard.dataset.example);

      audioRatings[exampleNumber - 1] = rating;

      // Update stars
      const stars = starContainer.querySelectorAll('.star');
      stars.forEach((star, index) => {
          if (index < rating) {
              star.classList.add('active');
          } else {
              star.classList.remove('active');
          }
      });

      // Show feedback
      showAudioFeedback(exampleCard, exampleNumber, rating);

      // Check completion
      if (audioRatings.filter(r => r > 0).length === 3) {
          const continueBtn = document.getElementById('audio-continue');
          continueBtn.style.display = 'inline-block';
          continueBtn.onclick = () => goToSection('practice-intro-video', 7);
      }
  }

  function showAudioFeedback(exampleCard, exampleNumber, rating) {
      const feedbackDiv = exampleCard.querySelector('.feedback-text');
      let message = '';
      let className = '';

      if (exampleNumber === 1) {
          if (rating <= 2) {
              message = "Exactly! This rushed greeting sounds unprofessional.";
              className = "excellent";
          } else {
              message = "This greeting is too rushed for patient care.";
              className = "poor";
          }
      } else if (exampleNumber === 2) {
          if (rating <= 3) {
              message = "Good assessment! Technically correct but lacks warmth.";
              className = "excellent";
          } else {
              message = "This greeting lacks warmth patients need.";
              className = "good";
          }
      } else if (exampleNumber === 3) {
          if (rating >= 4) {
              message = "Perfect! Notice the warmth and professionalism.";
              className = "excellent";
          } else {
              message = "Listen again - this has ideal warmth!";
              className = "poor";
          }
      }

      feedbackDiv.innerHTML = message;
      feedbackDiv.className = `feedback-text ${className}`;
      feedbackDiv.style.display = 'block';
  }

  // === PRACTICE RECORDER ===
  function initializePracticeRecorder() {
      const startBtn = document.getElementById('start-recording');
      const stopBtn = document.getElementById('stop-recording');
      const tryAgainBtn = document.getElementById('try-again');
      const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');

      if (!startBtn || !stopBtn) {
          setTimeout(initializePracticeRecorder, 500);
          return;
      }

      startBtn.addEventListener('click', startRecording);
      stopBtn.addEventListener('click', stopRecording);
      tryAgainBtn.addEventListener('click', resetRecorder);
      checkboxes.forEach(cb => cb.addEventListener('change', updateAssessment));
  }

  async function startRecording() {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

          recordedChunks = [];
          mediaRecorder = new MediaRecorder(stream);

          mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) recordedChunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
              const blob = new Blob(recordedChunks, { type: 'audio/wav' });
              const audioURL = URL.createObjectURL(blob);

              document.getElementById('recorded-audio').src = audioURL;
              document.getElementById('playback-area').style.display = 'block';
              document.getElementById('self-assessment').style.display = 'block';

              stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          isRecording = true;

          document.getElementById('start-recording').disabled = true;
          document.getElementById('stop-recording').disabled = false;
          document.getElementById('start-recording').classList.add('recording');
          document.getElementById('recording-status').textContent = '🔴 Recording... Speak your greeting now!';

      } catch (error) {
          console.error('Microphone error:', error);
          alert('Unable to access microphone. Please check permissions.');
      }
  }

  function stopRecording() {
      if (mediaRecorder && isRecording) {
          mediaRecorder.stop();
          isRecording = false;

          document.getElementById('start-recording').disabled = false;
          document.getElementById('stop-recording').disabled = true;
          document.getElementById('start-recording').classList.remove('recording');
          document.getElementById('recording-status').textContent = '✅ Recording complete!';
      }
  }

  function resetRecorder() {
      document.getElementById('playback-area').style.display = 'none';
      document.getElementById('self-assessment').style.display = 'none';
      document.getElementById('start-recording').disabled = false;
      document.getElementById('stop-recording').disabled = true;
      document.getElementById('start-recording').classList.remove('recording');
      document.getElementById('recording-status').textContent = '';

      document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(cb => cb.checked = false);
      document.getElementById('complete-module').style.display = 'none';
      document.getElementById('assessment-feedback').innerHTML = '';
  }

  function updateAssessment() {
      const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
      const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
      const totalCount = checkboxes.length;

      const feedbackDiv = document.getElementById('assessment-feedback');
      const completeBtn = document.getElementById('complete-module');

      if (checkedCount === 0) {
          feedbackDiv.innerHTML = '';
          completeBtn.style.display = 'none';
      } else if (checkedCount === totalCount) {
          feedbackDiv.innerHTML = 'Excellent! You\'ve mastered all key elements!';
          feedbackDiv.className = 'feedback success';
          completeBtn.style.display = 'inline-block';
          completeBtn.onclick = () => goToSection('completion', 8);
      } else if (checkedCount >= 3) {
          feedbackDiv.innerHTML = `Great progress! ${checkedCount}/${totalCount} elements mastered.`;
          feedbackDiv.className = 'feedback good';
          completeBtn.style.display = 'none';
      } else {
          feedbackDiv.innerHTML = `Keep practicing! ${totalCount - checkedCount} areas need work.`;
          feedbackDiv.className = 'feedback warning';
          completeBtn.style.display = 'none';
      }
  }

  console.log('🚀 Dental Training System Ready!');
