        // --- Dashboard Tilt Logic ---
        const mainAppCard = document.querySelector('.main-app-card');
        const trackingArea = document.getElementById('app-content');
        
        trackingArea.addEventListener('mousemove', (e) => {
            const rect = trackingArea.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            mainAppCard.style.transform = `rotateX(${-y * 1.5}deg) rotateY(${x * 1.5}deg) translateZ(10px)`;
            mainAppCard.style.boxShadow = `${-x * 10}px ${y * 10}px 30px rgba(0,0,0,0.3)`;
        });

        trackingArea.addEventListener('mouseleave', () => {
            mainAppCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
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