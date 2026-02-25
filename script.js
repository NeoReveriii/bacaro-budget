        // --- Dashboard Tilt Logic ---
        const mainAppCard = document.querySelector('.main-app-card');
        const trackingArea = document.getElementById('app-content');

        trackingArea.addEventListener('mouseleave', () => {
            mainAppCard.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        });
        
		function toggleAccountSidebar(forceState) {
			const sidebar = document.getElementById('account-sidebar');
			const overlay = document.getElementById('drawer-overlay');
			if (forceState === false) {
				sidebar.classList.remove('open');
				overlay.classList.remove('active');
			} else {
				sidebar.classList.toggle('open');
				overlay.classList.toggle('active');
			}
		}
		
		function closeAllModals() {
			document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
		}
		
		function openLoginModal() { closeAllModals(); toggleAccountSidebar(false); document.getElementById('login-modal').classList.add('active'); }
		function openSignupModal() { closeAllModals(); document.getElementById('signup-modal').classList.add('active'); }
		function openForgotModal() { closeAllModals(); document.getElementById('forgot-modal').classList.add('active'); }

		window.onclick = function(event) {
			if (event.target.classList.contains('modal-overlay')) closeAllModals();
			if (event.target.id === 'drawer-overlay') toggleAccountSidebar(false);
		}
		
		document.querySelectorAll('.modal-overlay').forEach(overlay => {
			const card = overlay.querySelector('.modal-card');
			overlay.addEventListener('mousemove', (e) => {
				if (!overlay.classList.contains('active')) return;
				const rect = card.getBoundingClientRect();
				const angleX = (rect.top + rect.height / 2 - e.clientY) / 140;
				const angleY = (e.clientX - (rect.left + rect.width / 2)) / 140;
				card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
			});
			overlay.addEventListener('mouseleave', () => {
				card.style.transform = `rotateX(0deg) rotateY(0deg)`;
			});
		});

		document.addEventListener('click', (e) => {
			if (e.target.classList.contains('password-toggle')) {
				const input = e.target.closest('.password-input-wrapper').querySelector('input');
				input.type = input.type === 'password' ? 'text' : 'password';
				e.target.style.color = input.type === 'text' ? 'white' : 'var(--primary-green)';
			}
		});
		
		function showView(viewId, element) {
			// 1. Hide all views
			const views = document.querySelectorAll('.main-view');
			views.forEach(view => view.style.display = 'none');

			// 2. Show the requested view
			const targetView = document.getElementById('view-' + viewId);
			if (targetView) {
				targetView.style.display = 'block';
			}

			// 3. Update the Active class in the sidebar
			const navItems = document.querySelectorAll('.nav-item');
			navItems.forEach(item => item.classList.remove('active'));
			element.classList.add('active');
		}
		
		// Function to "open" a wallet's details
		function openWalletDetails(name, type, status) {
			// Fill the data
			document.getElementById('detail-wallet-name').innerText = name;
			document.getElementById('detail-wallet-type').innerText = type;
			document.getElementById('detail-wallet-status').innerText = status;
			
			// Toggle status badge class
			const statusBadge = document.getElementById('detail-wallet-status');
			statusBadge.className = 'badge-status ' + (status === 'ACTIVE' ? 'status-active' : 'status-inactive');

			// Switch view
			showView('wallet-details', document.querySelector('[onclick*="wallets"]'));
		}
		
		function openAdminModal() {
			document.getElementById('admin-modal').style.display = 'flex';
		}

		function closeAdminModal() {
			document.getElementById('admin-modal').style.display = 'none';
		}

		function handleAdminLogin(event) {
			event.preventDefault();
			alert("Authenticating with server...");
		}

		function togglePasswordVisibility(element) {
			const input = element.closest('.password-input-wrapper').querySelector('input');
			input.type = input.type === 'password' ? 'text' : 'password';
			element.style.color = input.type === 'text' ? 'white' : 'var(--primary-green)';
		}

		function getToken() {
			return localStorage.getItem('bbm_token');
		}

		function setToken(token) {
			localStorage.setItem('bbm_token', token);
		}

		function removeToken() {
			localStorage.removeItem('bbm_token');
			localStorage.removeItem('bbm_user');
		}

		function getUserData() {
			const userStr = localStorage.getItem('bbm_user');
			return userStr ? JSON.parse(userStr) : null;
		}

		function setUserData(userData) {
			localStorage.setItem('bbm_user', JSON.stringify(userData));
		}

		function isAuthenticated() {
			return getToken() !== null && getUserData() !== null;
		}

		function checkAuthenticationForUserPage() {
			if (window.location.pathname.includes('BBMAI_USER')) {
				if (!isAuthenticated()) {
					window.location.href = 'BBMAI_GUEST.html';
				} else {
					loadUserProfileData();
				}
			}
		}

		function loadUserProfileData() {
			const userData = getUserData();
			if (!userData) return;

			const initials = userData.username.substring(0, 2).toUpperCase();
			document.getElementById('profile-initials').textContent = initials;
			document.getElementById('profile-username').textContent = userData.username;
			document.getElementById('profile-email').textContent = userData.email;
			document.getElementById('profile-phone').textContent = userData.pnumber || 'Not provided';
			const createdDate = new Date(userData.created_at);
			const formattedDate = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
			document.getElementById('profile-createdAt').textContent = formattedDate;
		}

		function handleLogout() {
			removeToken();
			window.location.href = 'BBMAI_GUEST.html';
		}

		document.addEventListener('DOMContentLoaded', function() {
			checkAuthenticationForUserPage();

			const loginForm = document.getElementById('login-form');
			if (loginForm) {
				loginForm.addEventListener('submit', async function(e) {
					e.preventDefault();

					const email = document.getElementById('login-email').value.trim();
					const password = document.getElementById('login-password').value;
					const messageDiv = document.getElementById('login-message');
					messageDiv.innerHTML = '';
					messageDiv.className = 'message';

					if (!email || !password) {
						messageDiv.innerHTML = 'Email and password are required';
						messageDiv.className = 'message error';
						return;
					}

					try {
						const response = await fetch('/api/accounts?action=login', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								email,
								password
							})
						});

						const data = await response.json();

						if (response.ok) {
							setToken(data.token);
							setUserData(data.data);

							messageDiv.innerHTML = '✓ Login successful! Redirecting...';
							messageDiv.className = 'message success';
							loginForm.reset();

							setTimeout(() => {
								window.location.href = 'BBMAI_USER.html';
							}, 1500);
						} else {
							messageDiv.innerHTML = data.error || 'An error occurred';
							messageDiv.className = 'message error';
						}
					} catch (error) {
						messageDiv.innerHTML = 'Connection error: ' + error.message;
						messageDiv.className = 'message error';
						console.error('Login error:', error);
					}
				});
			}

			const signupForm = document.getElementById('signup-form');
			if (signupForm) {
				signupForm.addEventListener('submit', async function(e) {
					e.preventDefault();

					const username = document.getElementById('signup-username').value.trim();
					const email = document.getElementById('signup-email').value.trim();
					const password = document.getElementById('signup-password').value;
					const confirmPassword = document.getElementById('signup-confirm').value;
					const pnumber = document.getElementById('signup-pnumber').value.trim();
					const messageDiv = document.getElementById('signup-message');
					messageDiv.innerHTML = '';
					messageDiv.className = 'message';
					if (!username || !email || !password) {
						messageDiv.innerHTML = 'All fields are required';
						messageDiv.className = 'message error';
						return;
					}

					if (password !== confirmPassword) {
						messageDiv.innerHTML = 'Passwords do not match';
						messageDiv.className = 'message error';
						return;
					}

					if (password.length < 6) {
						messageDiv.innerHTML = 'Password must be at least 6 characters';
						messageDiv.className = 'message error';
						return;
					}

					try {
						const response = await fetch('/api/accounts', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								username,
								email,
								password,
								pnumber: pnumber || null
							})
						});

						const data = await response.json();

						if (response.ok) {
							const createdDate = new Date(data.data.created_at);
							const formattedDate = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
							messageDiv.innerHTML = `✓ Account created on ${formattedDate}! Redirecting to login...`;
							messageDiv.className = 'message success';
							signupForm.reset();

							setTimeout(() => {
								closeAllModals();
								openLoginModal();
							}, 2000);
						} else {
							messageDiv.innerHTML = data.error || 'An error occurred';
							messageDiv.className = 'message error';
						}
					} catch (error) {
						messageDiv.innerHTML = 'Connection error: ' + error.message;
						messageDiv.className = 'message error';
						console.error('Signup error:', error);
					}
				});
			}
		});