		// --- Dashboard Tilt Logic ---
		const mainAppCard = document.querySelector('.main-app-card');
		const trackingArea = document.getElementById('app-content');

		// Only run this if the elements actually exist on the current page
		if (trackingArea && mainAppCard) {
				trackingArea.addEventListener('mouseleave', () => {
						mainAppCard.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
				});
		}
						
		function toggleAccountSidebar(forceState) {
			const accountSidebar = document.getElementById('account-sidebar');
			const overlay = document.getElementById('drawer-overlay');
			
			if (accountSidebar) {
			    if (forceState === false) {
				    accountSidebar.classList.remove('open');
				    if (!document.getElementById('main-sidebar')?.classList.contains('open')) {
				        overlay.classList.remove('active');
				    }
			    } else {
				    const isOpen = accountSidebar.classList.toggle('open');
                    if (isOpen) {
                        overlay.classList.add('active');
						if (typeof lucide !== 'undefined') lucide.createIcons();
                    } else if (!document.getElementById('main-sidebar')?.classList.contains('open')) {
                        overlay.classList.remove('active');
                    }
			    }
			}
		}

		function toggleMainSidebar(forceState) {
			const mainSidebar = document.getElementById('main-sidebar');
			const overlay = document.getElementById('drawer-overlay');
			
			if (mainSidebar) {
			    if (forceState === false) {
				    mainSidebar.classList.remove('open');
				    if (!document.getElementById('account-sidebar')?.classList.contains('open')) {
				        overlay.classList.remove('active');
				    }
			    } else {
				    const isOpen = mainSidebar.classList.toggle('open');
                    if (isOpen) {
                        overlay.classList.add('active');
                    } else if (!document.getElementById('account-sidebar')?.classList.contains('open')) {
                        overlay.classList.remove('active');
                    }
			    }
			}
		}
		
		function closeAllModals(options = { resetForms: true }) {
			document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
			if (options.resetForms !== false) {
				resetAddWalletForm();
				resetTransferForm();
				resetTransactionForm();
				resetGoalForm();
			}
		}
		
		function openLoginModal() { 
            closeAllModals(); 
            toggleAccountSidebar(false); 
            toggleMainSidebar(false);
            document.getElementById('login-modal').classList.add('active'); 
        }
		function openSignupModal() { closeAllModals(); toggleAccountSidebar(false); toggleMainSidebar(false); document.getElementById('signup-modal').classList.add('active'); }
		function openForgotModal() { closeAllModals(); toggleAccountSidebar(false); toggleMainSidebar(false); document.getElementById('forgot-modal').classList.add('active'); }
		function openAddWalletModal() { closeAllModals(); document.getElementById('add-wallet-modal').classList.add('active'); }
		function openTransferModal() { closeAllModals(); document.getElementById('transfer-modal').classList.add('active'); }
		let goalDatePicker = null;

		function openAddGoalModal() { 
			closeAllModals(); 
			document.getElementById('add-goal-modal').classList.add('active');
			
			// Initialize or reset Flatpickr
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			const tomorrowStr = tomorrow.toISOString().split('T')[0];

			if (!goalDatePicker) {
				goalDatePicker = flatpickr("#goal-deadline", {
					minDate: "today",
					defaultDate: tomorrowStr,
					dateFormat: "Y-m-d",
					disableMobile: "true",
					animate: true,
					position: "auto",
					onChange: function(selectedDates, dateStr, instance) {
						// Ensure label stays floated if date is selected
						const group = document.getElementById('goal-deadline').closest('.input-group');
						if (group) group.classList.add('has-value');
						validateGoalDeadline();
					}
				});
			} else {
				goalDatePicker.setDate(tomorrowStr);
				goalDatePicker.set("minDate", "today");
			}
			
			// Ensure label is correct for default date
			const deadlineInput = document.getElementById('goal-deadline');
			const group = deadlineInput ? deadlineInput.closest('.input-group') : null;
			if (group) group.classList.add('has-value');

			// Clear any previous error messages
			const messageDiv = document.getElementById('add-goal-message');
			if (messageDiv) {
				messageDiv.innerHTML = '';
				messageDiv.className = 'message';
			}
		}

		function resetGoalForm() {
			const form = document.getElementById('add-goal-form');
			if (!form) return;
			form.reset();
			
			// Reset Flatpickr to tomorrow
			if (goalDatePicker) {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				goalDatePicker.setDate(tomorrow.toISOString().split('T')[0]);
			}

			// Clear messages
			const messageDiv = document.getElementById('add-goal-message');
			if (messageDiv) {
				messageDiv.innerHTML = '';
				messageDiv.className = 'message';
			}

			// Reset Input Groups
			form.querySelectorAll('.input-group').forEach(group => {
				group.classList.remove('has-value');
				// Special check for the date input since we reset it to tomorrow
				const input = group.querySelector('#goal-deadline');
				if (input && input.value) {
					group.classList.add('has-value');
				}
			});
		}

		function validateGoalDeadline() {
			const deadlineInput = document.getElementById('goal-deadline');
			const messageDiv = document.getElementById('add-goal-message');
			
			if (!deadlineInput || !messageDiv) return;
			
			const selectedDate = new Date(deadlineInput.value);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			
			if (selectedDate < today) {
				messageDiv.innerHTML = 'Please select a valid future date.';
				messageDiv.className = 'message error';
				deadlineInput.setCustomValidity('Please select a future date');
			} else {
				messageDiv.innerHTML = '';
				messageDiv.className = 'message';
				deadlineInput.setCustomValidity('');
			}
		}
		window.openAddFundsModal = function(id) { 
			closeAllModals(); 
			document.getElementById('fund-goal-id').value = id;
			document.getElementById('add-funds-modal').classList.add('active'); 
		}
		function openSettingsPanel(event) {
			if (event) event.preventDefault();
			toggleAccountSidebar(false);
			toggleMainSidebar(false);
			showView('settings', document.querySelector('.sidebar-section.bottom-section .nav-item[onclick*="settings"]'));
		}
		function closeSettingsPanel() {
			// Settings is now a dedicated full view, not a modal.
		}

		window.onclick = function(event) {
			if (event.target.classList.contains('modal-overlay')) closeAllModals();
			if (event.target.id === 'drawer-overlay') {
                toggleAccountSidebar(false);
                toggleMainSidebar(false);
            }
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
			let toggle = e.target.classList.contains('password-toggle') ? e.target : e.target.closest('.password-toggle');
			if (toggle) {
				const input = toggle.closest('.password-input-wrapper').querySelector('input');
				const isPassword = input.type === 'password';
				
				// Toggle input type
				input.type = isPassword ? 'text' : 'password';
				
				// SVG icons with primary green color (#598539)
				const openEyeSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#598539" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
				const closedEyeSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#598539" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
				
				// Update icon: closed eye (encrypted) ↔ open eye (visible)
				toggle.innerHTML = isPassword ? openEyeSVG : closedEyeSVG;
				
				// Update visual state with class for styling
				if (isPassword) {
					// Password is now visible - add visible class
					toggle.classList.add('password-visible');
				} else {
					// Password is now hidden - remove visible class
					toggle.classList.remove('password-visible');
				}
				
				// Add animation feedback
				toggle.style.transform = 'translateY(-50%) scale(1.15)';
				setTimeout(() => {
					toggle.style.transform = 'translateY(-50%) scale(1)';
				}, 150);
			}
		});
		
		function showView(viewId, element) {
			// Close mobile sidebar if open
			toggleMainSidebar(false);

			// 1. Hide all views
			const views = document.querySelectorAll('.main-view');
			views.forEach(view => view.style.display = 'none');

			// 2. Show the requested view
			const targetView = document.getElementById('view-' + viewId);
			if (targetView) {
				targetView.style.display = 'flex';
			}

			// 3. Update the Active class in the sidebar
			const navItems = document.querySelectorAll('.nav-item');
			navItems.forEach(item => {
				item.classList.remove('active');
				if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(`showView('${viewId}'`)) {
					item.classList.add('active');
				}
			});
			if (element) {
				// Also add to the clicked element just in case it's not in the main nav
				element.classList.add('active');
			}

            // 4. Update Tab Title
            const titles = {
                'dashboard': 'Dashboard',
                'transactions': 'Transactions',
                'wallets': 'Wallets',
                'ai': 'Kwarta AI',
				'settings': 'Settings',
				'goals': 'Savings Goals'
            };
            if (titles[viewId]) {
                document.title = `${titles[viewId]} | Bacaro Budget Manager`;
            }

			// 5. Update URL Hash
			window.location.hash = viewId;
		}
		
		window.wallets = [];

		async function loadWallets() {
			if (!isAuthenticated()) return;
            const skeleton = document.getElementById('wallet-skeleton-grid');
            const container = document.getElementById('wallet-grid-container');
            if (skeleton) skeleton.style.display = 'grid';
            if (container) container.style.display = 'none';

			try {
				const res = await fetch('/api/wallets', {
					headers: { Authorization: `Bearer ${getToken()}` }
				});
				if (!res.ok) throw new Error('Failed to load wallets');
				const data = await res.json();
				window.wallets = data.wallets || [];
				renderWallets();
				renderWalletDropdowns();

                if (skeleton) skeleton.style.display = 'none';
                if (container) container.style.display = 'grid';
			} catch (e) {
				console.error('Load wallets error:', e);
				// Shimmer Fix: Update UI even on error to clear skeleton
				renderWallets();
                if (skeleton) skeleton.style.display = 'none';
                if (container) container.style.display = 'grid';
			}
		}

		function renderWallets() {
			if (typeof updateSidebarStats === 'function') updateSidebarStats();
			// Shimmer Fix: Always update total balance card first, even if no wallets
			const totalBalance = (window.wallets || []).reduce((sum, w) => sum + Number(w.calculated_balance || 0), 0);
			const totalEl = document.querySelector('.wallet-card .stat-value');
			if (totalEl) {
				totalEl.innerHTML = formatCurrency(totalBalance);
				totalEl.classList.add('loading-transition');
			}

			const container = document.getElementById('wallet-grid-container');
			if (!container) return;
			
			if (!window.wallets || window.wallets.length === 0) {
				container.innerHTML = '<p style="grid-column: 1 / -1; color: #666; text-align: center;">No wallets found. Add one to get started.</p>';
				return;
			}

			container.innerHTML = window.wallets.map(w => {
				const typeLower = String(w.type || 'other').toLowerCase();
				let colorClass = 'wallet-other';
				if (typeLower.includes('cash')) colorClass = 'wallet-cash';
				else if (typeLower.includes('bank')) colorClass = 'wallet-bank';
				else if (typeLower.includes('money') || typeLower.includes('e-')) colorClass = 'wallet-emoney';
				else if (typeLower.includes('credit')) colorClass = 'wallet-credit';

				const balance = formatCurrency(w.calculated_balance);
				return `
					<div class="card-item ${colorClass}" onclick="openWalletDetails('${escapeHtml(w.name)}', '${escapeHtml(w.type)}', '${escapeHtml(w.status)}', ${Number(w.calculated_balance)})">
						<button class="card-delete-btn" onclick="event.stopPropagation(); handleDeleteWallet(${w.wallet_id}, '${escapeHtml(w.name)}')">×</button>
						<div class="card-chip"></div>
						<div class="card-status-badge">${escapeHtml(w.status)}</div>
						<div class="card-content">
							<h3 class="card-name">${escapeHtml(w.name)}</h3>
							<p class="card-type">${escapeHtml(w.type)}</p>
							<p class="card-balance" style="font-weight: bold; font-size: 1.4em;">${balance}</p>
						</div>
					</div>
				`;
			}).join('');
		}

		window.handleDeleteWallet = async function(walletId, name) {
            const btn = event?.currentTarget;
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }

			showConfirm('Delete Wallet', `Are you sure you want to delete "${name}"? You can only delete wallets with no transaction history.`, async () => {
				showCoinLoader('DELETING WALLET...');
				try {
					const res = await fetch('/api/wallets', {
						method: 'DELETE',
						headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
						body: JSON.stringify({ wallet_id: walletId })
					});
					const payload = await readResponsePayload(res);
					if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to delete wallet'));
					
					showToast('Wallet deleted successfully');
					await loadWallets();
					
					// If we are currently viewing the details of the wallet we just deleted, go back
					const detailsView = document.getElementById('view-wallet-details');
					if (detailsView && detailsView.style.display !== 'none') {
						const currentDetailName = document.getElementById('detail-wallet-name').innerText;
						if (currentDetailName === name) {
							showView('wallets', document.querySelector('[onclick*="wallets"]'));
						}
					}
				} catch (err) {
					showToast(err.message, 'error');
                    if (btn) {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                    }
				} finally {
					hideCoinLoader();
				}
			}, () => {
                if (btn) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
            });
		};

		function renderWalletDropdowns() {
			const options = window.wallets.map(w => `<option value="${w.wallet_id}" data-name="${escapeHtml(w.name)}">${escapeHtml(w.name)}</option>`).join('');
			
			const transWallet = document.getElementById('trans-wallet-type');
			if (transWallet) {
				transWallet.innerHTML = `<option value="" selected disabled hidden></option>${options}<option value="Other">Other</option>`;
			}

			const transferFrom = document.getElementById('transfer-from');
			const transferTo = document.getElementById('transfer-to');
			if (transferFrom) transferFrom.innerHTML = `<option value="" selected disabled hidden></option>${options}`;
			if (transferTo) transferTo.innerHTML = `<option value="" selected disabled hidden></option>${options}`;
			
			// Custom selects have to be updated. Since initializeCustomSelects wraps them,
			// we need to remove the wrappers and re-initialize.
			document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
				const select = wrapper.querySelector('select');
				if (select && ['trans-wallet-type', 'transfer-from', 'transfer-to'].includes(select.id)) {
					wrapper.parentNode.insertBefore(select, wrapper);
					select.style.display = '';
					wrapper.remove();
				}
			});
			initializeCustomSelects();
		}

		// Function to "open" a wallet's details
		function openWalletDetails(name, type, status, balance = 0) {
			document.getElementById('detail-wallet-name').innerText = name;
			document.getElementById('detail-wallet-type').innerText = type;
			document.getElementById('detail-wallet-status').innerText = status;
			const balanceEl = document.querySelector('.wallet-balance-card .balance-amount');
			if (balanceEl) balanceEl.innerText = formatCurrency(balance);
			
			const statusBadge = document.getElementById('detail-wallet-status');
			statusBadge.className = 'badge-status ' + (status === 'ACTIVE' ? 'status-active' : 'status-inactive');

			// Filter transactions for this specific wallet
			const walletTransactions = (window.currentTransactions || []).filter(t => t.wallet_type === name);
			
			// Calculate Stats
			const totalIncome = walletTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + Number(t.amount), 0);
			const totalExpense = walletTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + Number(t.amount), 0);
			
			// Transfers direction check
			const transfersIn = walletTransactions.filter(t => t.type === 'Transfer' && (t.description || '').toLowerCase().includes('in from')).reduce((sum, t) => sum + Number(t.amount), 0);
			const transfersOut = walletTransactions.filter(t => t.type === 'Transfer' && (t.description || '').toLowerCase().includes('out to')).reduce((sum, t) => sum + Number(t.amount), 0);
			const netTransfers = transfersIn - transfersOut;

			// Update Stats UI
			const incEl = document.getElementById('wallet-total-income');
			const expEl = document.getElementById('wallet-total-expense');
			const trfEl = document.getElementById('wallet-total-transfers');
			
			if (incEl) incEl.innerHTML = formatCurrency(totalIncome);
			if (expEl) expEl.innerHTML = formatCurrency(totalExpense);
			if (trfEl) trfEl.innerHTML = formatCurrency(netTransfers);

			// Insights
			const insightsContent = document.getElementById('wallet-insights-content');
			if (insightsContent) {
				let insightText = '';
				if (walletTransactions.length === 0) {
					insightText = "No activity yet. Start by adding a transaction or transfer to see insights!";
				} else {
					const netChange = totalIncome - totalExpense + netTransfers;
					const healthStatus = netChange >= 0 ? 'growing' : 'decreasing';
					insightText = `This wallet's balance is currently <strong>${healthStatus}</strong>. `;
					insightText += `You've recorded ${formatCurrency(totalIncome + transfersIn)} in total inflows and ${formatCurrency(totalExpense + transfersOut)} in total outflows.`;
				}
				insightsContent.innerHTML = `<p>${insightText}</p>`;
			}

			// Render Transaction List
			const listEl = document.querySelector('#main-wallet-details .transaction-list');
			// Handle delete button visibility in details
			const walletObj = (window.wallets || []).find(w => w.name === name);
			const btnDel = document.getElementById('btn-delete-wallet-detail');
			if (btnDel && walletObj) {
				btnDel.style.display = (walletTransactions.length === 0) ? 'inline-block' : 'none';
				btnDel.onclick = () => handleDeleteWallet(walletObj.wallet_id, name);
			}

			if (walletTransactions.length === 0) {
				listEl.innerHTML = `
					<div class="transaction-row header-row">
						<span>#</span><span>TITLE</span><span>AMOUNT</span><span>TYPE</span><span>DATE</span><span></span> 
					</div>
					<div class="empty-history"><p>No transactions found for this wallet.</p></div>
				`;
			} else {
				listEl.innerHTML = `
					<div class="transaction-row header-row">
						<span>#</span><span>TITLE</span><span>AMOUNT</span><span>TYPE</span><span>DATE</span><span></span> 
					</div>
				` + walletTransactions.map((row, idx) => renderTransactionItem(row, idx + 1)).join('');
				
				if (typeof lucide !== 'undefined') lucide.createIcons();
			}
			showView('wallet-details', document.querySelector('[onclick*="wallets"]'));
		}
		
		function openAdminModal() {
			toggleMainSidebar(false);
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
			// Deprecated - handled by global click listener
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
			try {
				const userStr = localStorage.getItem('bbm_user');
				if (!userStr || userStr === 'undefined') return null;
				return JSON.parse(userStr);
			} catch (e) {
				console.error('Error parsing user data:', e);
				localStorage.removeItem('bbm_user');
				return null;
			}
		}

		function setUserData(userData) {
			if (!userData) {
				localStorage.removeItem('bbm_user');
				return;
			}
			localStorage.setItem('bbm_user', JSON.stringify(userData));
		}

		function isAuthenticated() {
			return getToken() !== null && getUserData() !== null;
		}

		function checkAuthenticationForUserPage() {
			const path = window.location.pathname;
			const isUserPage = (path.includes('dashboard') || path.includes('views')) 
												&& !path.includes('guest.html');
												
			if (isUserPage) {
				if (!isAuthenticated()) {
					window.location.href = '/'; 
				} else {
					loadUserProfileData();
				}
			}
		}

		function loadUserProfileData() {
			const userData = getUserData();
			if (!userData) return;

			// Handle Avatar Display
			const pfpEl = document.getElementById('profile-initials');
			const headerPfpEl = document.getElementById('header-pfp');
			const headerInitials = document.getElementById('header-initials');
			
			const initials = (userData.username || '??').substring(0, 2).toUpperCase();
			if (headerInitials) headerInitials.textContent = initials;

			function updateAvatarElement(el, data) {
				if (!el) return;
				el.innerHTML = '';
				if (data.avatar_url) {
					el.style.backgroundImage = `url(${data.avatar_url})`;
					el.style.backgroundSize = 'cover';
					el.textContent = '';
				} else if (data.avatar_seed) {
					const svgUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(data.avatar_seed)}`;
					el.style.backgroundImage = `url(${svgUrl})`;
					el.style.backgroundSize = 'cover';
					el.textContent = '';
				} else {
					el.style.backgroundImage = 'none';
					el.textContent = initials;
				}
			}

			updateAvatarElement(pfpEl, userData);
			updateAvatarElement(headerPfpEl, userData);

			document.getElementById('profile-username').textContent = userData.username;
			document.getElementById('profile-email').textContent = userData.email;
			document.getElementById('profile-phone').textContent = userData.pnumber || 'Not provided';
			
			const bioEl = document.getElementById('profile-bio');
			if (bioEl) bioEl.textContent = userData.bio || 'Not provided';
			
			const createdDate = new Date(userData.createdat || userData.created_at);
			const formattedDate = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
			
			const createdEl = document.getElementById('profile-createdat') || document.getElementById('profile-createdAt');
			if (createdEl) createdEl.textContent = formattedDate;

			// Update Financial Badge and Wallet Count
			updateSidebarStats();
			
			// Sync edit inputs
			const editNickname = document.getElementById('edit-nickname');
			const editPhone = document.getElementById('edit-phone');
			const editBio = document.getElementById('edit-bio');
			
			if (editNickname) editNickname.value = userData.username;
			if (editPhone) editPhone.value = userData.pnumber || '';
			if (editBio) editBio.value = userData.bio || '';
			
			// If in edit mode, ensure inputs have "has-value" class
			[editNickname, editPhone, editBio].forEach(input => {
				if (input && input.value) {
					const group = input.closest('.input-group');
					if (group) group.classList.add('has-value');
				}
			});
		}

		function updateSidebarStats() {
			const badgeContainer = document.getElementById('financial-badge-container');
			const walletCountEl = document.getElementById('active-wallet-count');
			if (!badgeContainer || !walletCountEl) return;

			// Get Wallet Count
			const wallets = window.wallets || [];
			walletCountEl.textContent = wallets.length;

			// Get Goals Total
			const goals = window.goals || [];
			const totalGoals = goals.reduce((sum, g) => sum + Number(g.target_amount || 0), 0);

			let badgeHtml = '';
			if (totalGoals >= 20000) {
				badgeHtml = `<div class="badge-pill badge-master"><i data-lucide="crown"></i> Master Budgeter</div>`;
			} else if (totalGoals >= 5000) {
				badgeHtml = `<div class="badge-pill badge-saver"><i data-lucide="coins"></i> Saver</div>`;
			} else {
				badgeHtml = `<div class="badge-pill badge-starter"><i data-lucide="leaf"></i> Starter</div>`;
			}

			badgeContainer.innerHTML = badgeHtml;
			if (typeof lucide !== 'undefined') lucide.createIcons();
		}

		window.toggleEditMode = function(state) {
			const sidebar = document.getElementById('account-sidebar');
			if (!sidebar) return;

			if (state) {
				sidebar.classList.add('edit-mode');
				document.querySelectorAll('.view-mode-only').forEach(el => el.style.display = 'none');
				document.querySelectorAll('.edit-mode-only').forEach(el => el.style.display = 'block');
				renderDiceBearGrid();
			} else {
				sidebar.classList.remove('edit-mode');
				document.querySelectorAll('.view-mode-only').forEach(el => el.style.display = 'flex');
				document.querySelectorAll('.edit-mode-only').forEach(el => el.style.display = 'none');
				// Reset form to latest user data
				loadUserProfileData();
				// Clear errors
				document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
			}
			
			if (typeof lucide !== 'undefined') lucide.createIcons();
		};

		let currentAvatarSeed = null;
		let currentAvatarUrl = null;

		function renderDiceBearGrid() {
			const grid = document.getElementById('dicebear-grid');
			if (!grid) return;

			const userData = getUserData();
			const selectedSeed = currentAvatarSeed || userData?.avatar_seed;
			
			// Define some base seeds or generate random ones
			const baseSeeds = ['Jhun1', 'Budgeter', 'Saver', 'Aventurer', 'Explorer', 'Minter', 'Grinder', 'Hustler'];
			
			grid.innerHTML = baseSeeds.map(seed => {
				const isSelected = seed === selectedSeed;
				return `
					<div class="avatar-item ${isSelected ? 'selected' : ''}" onclick="selectAvatarSeed('${seed}')">
						<img src="https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}" alt="${seed}" loading="lazy">
					</div>
				`;
			}).join('');
		}

		window.randomizeAvatarGrid = function() {
			const grid = document.getElementById('dicebear-grid');
			if (!grid) return;

			const randomSeeds = Array.from({ length: 8 }, () => Math.random().toString(36).substring(7));
			
			grid.innerHTML = randomSeeds.map(seed => {
				return `
					<div class="avatar-item" onclick="selectAvatarSeed('${seed}')">
						<img src="https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}" alt="${seed}" loading="lazy">
					</div>
				`;
			}).join('');
		};

		window.selectAvatarSeed = function(seed) {
			currentAvatarSeed = seed;
			currentAvatarUrl = null; // Clear uploaded URL if seed is selected
			
			// Update UI preview
			const pfpEl = document.getElementById('profile-initials');
			if (pfpEl) {
				const svgUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}`;
				pfpEl.style.backgroundImage = `url(${svgUrl})`;
				pfpEl.style.backgroundSize = 'cover';
				pfpEl.textContent = '';
			}

			// Update grid selection
			document.querySelectorAll('.avatar-item').forEach(item => {
				const img = item.querySelector('img');
				if (img && img.alt === seed) {
					item.classList.add('selected');
				} else {
					item.classList.remove('selected');
				}
			});
		};

		window.triggerAvatarUpload = function() {
			const input = document.getElementById('avatar-upload-input');
			if (input) input.click();
		};

		window.handleAvatarUpload = function(event) {
			const file = event.target.files[0];
			if (!file) return;

			if (!file.type.startsWith('image/')) {
				showToast('Please select an image file', 'error');
				return;
			}

			const reader = new FileReader();
			reader.onload = function(e) {
				currentAvatarUrl = e.target.result;
				currentAvatarSeed = null; // Clear seed if image is uploaded
				
				// Update UI preview
				const pfpEl = document.getElementById('profile-initials');
				if (pfpEl) {
					pfpEl.style.backgroundImage = `url(${currentAvatarUrl})`;
					pfpEl.style.backgroundSize = 'cover';
					pfpEl.textContent = '';
				}
				
				// Deselect grid
				document.querySelectorAll('.avatar-item').forEach(item => item.classList.remove('selected'));
				
				showToast('Image uploaded and cropped!');
			};
			reader.readAsDataURL(file);
		};

		window.saveProfileChanges = async function() {
			const userData = getUserData();
			if (!userData) return;

			const nickname = document.getElementById('edit-nickname').value.trim();
			const phone = document.getElementById('edit-phone').value.trim();
			const bio = document.getElementById('edit-bio').value.trim();

			// Validation
			let hasError = false;
			const nickError = document.getElementById('nickname-error');
			const phoneError = document.getElementById('phone-error');
			
			if (!nickname) {
				if (nickError) nickError.textContent = 'Nickname is required';
				hasError = true;
			} else {
				if (nickError) nickError.textContent = '';
			}

			if (phone && !/^\d+$/.test(phone)) {
				if (phoneError) phoneError.textContent = 'Phone must contain only numbers';
				hasError = true;
			} else {
				if (phoneError) phoneError.textContent = '';
			}

			if (hasError) return;

			showCoinLoader('SAVING PROFILE...');
			try {
				const body = {
					id: userData.acc_id,
					username: nickname,
					pnumber: phone,
					bio: bio,
					avatar_seed: currentAvatarSeed,
					avatar_url: currentAvatarUrl
				};

				const res = await fetch('/api/accounts', {
					method: 'PUT',
					headers: { 
						'Content-Type': 'application/json',
						Authorization: `Bearer ${getToken()}` 
					},
					body: JSON.stringify(body)
				});

				const payload = await readResponsePayload(res);
				if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to update profile'));

				const updatedData = payload.json?.data;
				if (!updatedData) throw new Error('Update successful but no data returned');

				// Update Local Storage
				setUserData(updatedData);
				
				// Apply changes to UI
				loadUserProfileData();
				toggleEditMode(false);
				
				showToast('Profile Updated successfully');
			} catch (err) {
				console.error('Save Profile Error:', err);
				showToast(err.message, 'error');
			} finally {
				hideCoinLoader();
			}
		};

		function handleLogout() {
			removeToken();
			window.location.href = '/';
		}

		function applyThemeSettings() {
			const darkMode = localStorage.getItem('bbm_dark_mode') === 'true';
			const legacyHighContrast = localStorage.getItem('bbm_high_contrast') === 'true';
			const savedContrast = Number(localStorage.getItem('bbm_contrast_level'));
			const contrast = Number.isFinite(savedContrast)
				? Math.min(140, Math.max(80, savedContrast))
				: (legacyHighContrast ? 120 : 100);
			document.body.classList.toggle('dark-mode', darkMode);
			document.body.style.setProperty('--bbm-contrast', `${contrast}%`);

			// Re-render charts and lists to reflect theme changes
			if (window.currentTransactions && Array.isArray(window.currentTransactions)) {
				updateDashboardStats(window.currentTransactions);
			}
		}

		function initializeSettingsPanel() {
			const darkModeToggle = document.getElementById('settings-dark-mode-toggle');
			const contrastToggle = document.getElementById('settings-contrast-toggle');
			if (!darkModeToggle || !contrastToggle) return;

			const darkModeEnabled = localStorage.getItem('bbm_dark_mode') === 'true';
			const legacyHighContrast = localStorage.getItem('bbm_high_contrast') === 'true';
			const savedContrast = Number(localStorage.getItem('bbm_contrast_level'));
			const contrastLevel = Number.isFinite(savedContrast)
				? Math.min(140, Math.max(80, savedContrast))
				: (legacyHighContrast ? 120 : 100);

			darkModeToggle.checked = darkModeEnabled;
			const isHighContrast = contrastLevel > 100;
			contrastToggle.textContent = isHighContrast ? 'High Contrast' : 'Normal Contrast';
			contrastToggle.dataset.highContrast = isHighContrast ? 'true' : 'false';

			darkModeToggle.addEventListener('change', () => {
				localStorage.setItem('bbm_dark_mode', darkModeToggle.checked ? 'true' : 'false');
				applyThemeSettings();
				showSavedToast();
			});

			contrastToggle.addEventListener('click', () => {
				const currentlyHighContrast = contrastToggle.dataset.highContrast === 'true';
				const newContrastLevel = currentlyHighContrast ? 100 : 120;
				const newIsHighContrast = newContrastLevel > 100;
				
				localStorage.setItem('bbm_contrast_level', String(newContrastLevel));
				localStorage.setItem('bbm_high_contrast', newIsHighContrast ? 'true' : 'false');
				contrastToggle.textContent = newIsHighContrast ? 'High Contrast' : 'Normal Contrast';
				contrastToggle.dataset.highContrast = newIsHighContrast ? 'true' : 'false';
				applyThemeSettings();
				showSavedToast();
			});

			const languageSelect = document.getElementById('settings-language');
			if (languageSelect) {
				const savedLang = localStorage.getItem('bbm_language') || 'en';
				languageSelect.value = savedLang;
				languageSelect.addEventListener('change', () => {
					localStorage.setItem('bbm_language', languageSelect.value);
					showSavedToast();
				});
			}

			const currencyToggle = document.getElementById('settings-currency-toggle');
			if (currencyToggle) {
				const currencyEnabled = localStorage.getItem('bbm_show_currency') !== 'false';
				currencyToggle.checked = currencyEnabled;
				currencyToggle.addEventListener('change', () => {
					localStorage.setItem('bbm_show_currency', currencyToggle.checked ? 'true' : 'false');
					showSavedToast();
					
					// Refresh all UI components to reflect currency toggle
					if (window.currentTransactions) {
						updateDashboardStats(window.currentTransactions);
						renderTransactions(window.currentTransactions);
					}
					if (typeof renderWallets === 'function') renderWallets();
					if (typeof renderGoals === 'function') renderGoals();
				});
			}
		}

		function showSavedToast() {
			const existing = document.getElementById('saved-toast');
			if (existing) existing.remove();

			const toast = document.createElement('div');
			toast.id = 'saved-toast';
			toast.style.cssText = `
				position: fixed;
				bottom: 30px;
				left: 50%;
				transform: translateX(-50%) translateY(20px);
				background: #598539;
				color: white;
				padding: 10px 25px;
				border-radius: 30px;
				font-weight: 600;
				font-size: 0.9em;
				box-shadow: 0 4px 15px rgba(0,0,0,0.2);
				z-index: 9999;
				opacity: 0;
				transition: all 0.3s ease;
				display: flex;
				align-items: center;
				gap: 8px;
			`;
			toast.innerHTML = '<i data-lucide="check-circle" style="width: 16px; height: 16px;"></i> Saved';
			document.body.appendChild(toast);
			
			if (typeof lucide !== 'undefined') lucide.createIcons();

			// Animate in
			requestAnimationFrame(() => {
				toast.style.opacity = '1';
				toast.style.transform = 'translateX(-50%) translateY(0)';
			});

			// Remove after 1 second
			setTimeout(() => {
				toast.style.opacity = '0';
				toast.style.transform = 'translateX(-50%) translateY(-10px)';
				setTimeout(() => toast.remove(), 300);
			}, 1000);
		}

		window.handleExportData = function() {
			if (!window.currentTransactions || window.currentTransactions.length === 0) {
				showToast('No transactions to export', 'error');
				return;
			}

			const headers = ['Date', 'Description', 'Type', 'Amount', 'Wallet'];
			const csvRows = [headers.join(',')];

			window.currentTransactions.forEach(t => {
				const row = [
					formatDate(t.dateoftrans || t.date),
					`"${(t.description || '').replace(/"/g, '""')}"`,
					t.type,
					t.amount,
					t.wallet_type || ''
				];
				csvRows.push(row.join(','));
			});

			const csvContent = csvRows.join('\n');
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.setAttribute('href', url);
			link.setAttribute('download', 'bacaro_budget_export.csv');
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			
			showToast('Export successful!');
		};

		async function handleDeleteAccount() {
			if (!isAuthenticated()) {
				showToast('Sign in to delete your account', 'error');
				closeSettingsPanel();
				openLoginModal();
				return;
			}

			const user = getUserData();
			if (!user?.acc_id) {
				showToast('Unable to identify account', 'error');
				return;
			}

			showConfirm('Delete Account', 'This action is permanent and cannot be undone. Do you want to continue?', async () => {
				showCoinLoader('DELETING ACCOUNT...');
				try {
					const res = await fetch('/api/accounts', {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${getToken()}`
						},
						body: JSON.stringify({ id: user.acc_id })
					});
					const payload = await readResponsePayload(res);
					if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to delete account'));
					removeToken();
					localStorage.removeItem('bbm_dark_mode');
					localStorage.removeItem('bbm_high_contrast');
					window.location.href = '/';
				} catch (err) {
					showToast(err.message || 'Unable to delete account', 'error');
				} finally {
					hideCoinLoader();
				}
			});
		}

		function handleNewTransactionClick() {
			toggleMainSidebar(false);
			if (!isAuthenticated()) {
				openLoginModal();
				return;
			}

			openTransactionModal();
		}

		function openTransactionModal(isEdit = false) {
			closeAllModals({ resetForms: !isEdit });
			const modal = document.getElementById('transaction-modal');
			const header = modal ? modal.querySelector('.login-header') : null;
			if (header) {
				header.textContent = isEdit ? 'Edit Transaction' : 'New Transaction';
			}
			if (!isEdit) {
				resetTransactionForm();
			}
			if (modal) modal.classList.add('active');
		}

		function closeTransactionModal() {
			const modal = document.getElementById('transaction-modal');
			if (modal) modal.classList.remove('active');
		}

		function escapeHtml(value) {
			return String(value)
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;')
				.replaceAll('"', '&quot;')
				.replaceAll("'", '&#039;');
		}

		function formatCurrency(amount) {
			const n = Number(amount);
			const showCurrency = localStorage.getItem('bbm_show_currency') !== 'false';
			const symbol = showCurrency ? '₱ ' : '';
			if (!Number.isFinite(n)) return `${symbol}0.00`;
			return `${symbol}${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
		}

		function formatDate(value) {
			const d = value ? new Date(value) : null;
			if (!d || Number.isNaN(d.getTime())) return '';
			return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
		}

		async function readResponsePayload(res) {
			const contentType = res.headers.get('content-type') || '';
			try {
				if (contentType.includes('application/json')) {
					const json = await res.json();
					return { json, text: null };
				}
			} catch (e) {
				// fall through to text read
			}

			try {
				const text = await res.text();
				// Try to parse JSON anyway (some backends forget headers)
				try {
					return { json: JSON.parse(text), text };
				} catch {
					return { json: null, text };
				}
			} catch {
				return { json: null, text: null };
			}
		}

		function getErrorMessage(payload, fallback) {
			const msg =
				payload?.json?.error ||
				payload?.json?.message ||
				(typeof payload?.text === 'string' ? payload.text : '') ||
				fallback;
			return String(msg || fallback || 'Request failed').trim();
		}

		function showToast(message, type = 'success') {
			const existing = document.getElementById('bbm-toast');
			if (existing) existing.remove();
			const el = document.createElement('div');
			el.id = 'bbm-toast';
			el.className = `bbm-toast ${type}`;
			el.textContent = message;
			document.body.appendChild(el);
			setTimeout(() => el.classList.add('show'), 10);
			setTimeout(() => {
				el.classList.remove('show');
				setTimeout(() => el.remove(), 250);
			}, 2200);
		}

		function showConfirm(title, message, onConfirm, onCancel) {
			document.getElementById('confirm-title').textContent = title;
			document.getElementById('confirm-message').textContent = message;
			const modal = document.getElementById('confirm-modal');
			if (modal) modal.classList.add('active');
			
			const btnOk = document.getElementById('btn-confirm-ok');
			const btnCancel = document.getElementById('btn-confirm-cancel');
			const btnClose = modal.querySelector('.modal-close');
			
			const newOk = btnOk.cloneNode(true);
			btnOk.parentNode.replaceChild(newOk, btnOk);
			const newCancel = btnCancel.cloneNode(true);
			btnCancel.parentNode.replaceChild(newCancel, btnCancel);
			
			const handleCancel = () => {
				if (modal) modal.classList.remove('active');
				if (typeof onCancel === 'function') onCancel();
			};

			newOk.addEventListener('click', () => {
				if (modal) modal.classList.remove('active');
				if (typeof onConfirm === 'function') onConfirm();
			});

			newCancel.addEventListener('click', handleCancel);
			if (btnClose) {
				const newClose = btnClose.cloneNode(true);
				btnClose.parentNode.replaceChild(newClose, btnClose);
				newClose.addEventListener('click', handleCancel);
			}
		}

		window.handleDeleteTransaction = async function(id) {
            // Find the button and add loading state
            const btn = event?.currentTarget;
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }

			showConfirm('Delete Transaction', 'Are you sure you want to delete this transaction?', async () => {
                // Optimistic Update: 
                // 1. Save original state
                const originalTransactions = [...(window.currentTransactions || [])];
                const originalWallets = JSON.parse(JSON.stringify(window.wallets || []));
                const deletedTx = originalTransactions.find(t => t.trans_id === id);
                
                if (!deletedTx) {
                    if (btn) {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                    }
                    return;
                }

                // 2. Remove immediately from UI state
                window.currentTransactions = originalTransactions.filter(t => t.trans_id !== id);
                
                // 3. Update local wallet balance optimistically
                const walletId = deletedTx.wallet_id;
                const walletName = deletedTx.wallet_type;
                let balanceChange = 0;
                const amount = Number(deletedTx.amount);
                const type = String(deletedTx.type).toLowerCase();

                if (type === 'income' || (type === 'transfer' && deletedTx.description.toLowerCase().includes('from'))) {
                    balanceChange = -amount;
                } else if (type === 'expense' || (type === 'transfer' && deletedTx.description.toLowerCase().includes('to'))) {
                    balanceChange = +amount;
                }

                if (walletId && window.wallets) {
                    const walletIndex = window.wallets.findIndex(w => w.wallet_id === walletId);
                    if (walletIndex !== -1) {
                        window.wallets[walletIndex].calculated_balance = Number(window.wallets[walletIndex].calculated_balance) + balanceChange;
                    }
                }

                // 4. Re-render ALL relevant UI components immediately
                renderTransactions(window.currentTransactions);
                updateDashboardStats(window.currentTransactions);
                renderWallets(); 

                // SPECIAL: Check if Wallet Details view is open for this specific wallet
                const detailsView = document.getElementById('view-wallet-details');
                const detailName = document.getElementById('detail-wallet-name')?.innerText;
                if (detailsView && detailsView.style.display !== 'none' && detailName === walletName) {
                    // Update balance at the top of wallet details
                    const balanceEl = document.querySelector('.wallet-balance-card .balance-amount');
                    if (balanceEl) {
                        const currentVal = Number(balanceEl.innerText.replace(/[^0-9.-]+/g,""));
                        balanceEl.innerText = formatCurrency(currentVal + balanceChange);
                    }
                    
                    // Update the list inside wallet details
                    const listEl = document.querySelector('#main-wallet-details .transaction-list');
                    const filtered = window.currentTransactions.filter(t => t.wallet_type === walletName);
                    if (filtered.length === 0) {
                        listEl.innerHTML = `
                            <div class="transaction-row header-row">
                                <span>#</span><span>TITLE</span><span>AMOUNT</span><span>TYPE</span><span>DATE</span><span></span> 
                            </div>
                            <div class="empty-history"><p>No transactions found for this wallet.</p></div>
                        `;
                    } else {
                        listEl.innerHTML = `
                            <div class="transaction-row header-row">
                                <span>#</span><span>TITLE</span><span>AMOUNT</span><span>TYPE</span><span>DATE</span><span></span> 
                            </div>
                        ` + filtered.map((row, idx) => renderTransactionItem(row, idx + 1)).join('');
                        
                        // Re-initialize icons for the new elements
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                }
                
                showToast('Transaction deleted', 'success');

				try {
					const res = await fetch('/api/transactions', {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${getToken()}`
						},
						body: JSON.stringify({ id })
					});
					if (!res.ok) throw new Error('Delete failed');
				} catch (err) {
                    // 5. Rollback on failure
					showToast('Error deleting transaction. Rolling back...', 'error');
                    window.currentTransactions = originalTransactions;
                    window.wallets = originalWallets;
                    renderTransactions(window.currentTransactions);
                    updateDashboardStats(window.currentTransactions);
                    renderWallets();
                    
                    // Rollback wallet details if open
                    if (detailsView && detailsView.style.display !== 'none' && detailName === walletName) {
                        openWalletDetails(walletName, 
                            document.getElementById('detail-wallet-type').innerText, 
                            document.getElementById('detail-wallet-status').innerText,
                            originalWallets.find(w => w.name === walletName)?.calculated_balance || 0
                        );
                    }
				}
			}, () => {
                // On Cancel: re-enable button
                if (btn) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }
            });
		};

		window.handleEditTransaction = function(id) {
			const row = (window.currentTransactions || []).find(t => t.trans_id === id);
			if (!row) return;

			document.getElementById('trans-id').value = id;
			const typeSelect = document.getElementById('trans-type');
			typeSelect.value = row.type;
			typeSelect.dispatchEvent(new Event('change'));

			document.getElementById('trans-description').value = row.description;

			const walletTypeSelect = document.getElementById('trans-wallet-type');
			const customWallets = ['Cash', 'Bank Account', 'E-Money', 'Credit Card'];
			if (customWallets.includes(row.wallet_type)) {
				walletTypeSelect.value = row.wallet_type;
				document.getElementById('trans-wallet-other-group').style.display = 'none';
			} else {
				walletTypeSelect.value = 'Other';
				document.getElementById('trans-wallet-other').value = row.wallet_type;
				document.getElementById('trans-wallet-other-group').style.display = '';
			}
			walletTypeSelect.dispatchEvent(new Event('change'));
			document.getElementById('trans-amount').value = row.amount;
			
			// Manually add has-value to all input groups to float labels
			['trans-description', 'trans-amount', 'trans-wallet-other'].forEach(id => {
				const el = document.getElementById(id);
				if (el && el.value) {
					el.closest('.input-group')?.classList.add('has-value');
				}
			});

			openTransactionModal(true);
		};
		async function loadTransactions() {
			if (!isAuthenticated()) return;
			const listEl = document.getElementById('transaction-list-items');
            const skeleton = document.getElementById('transaction-skeleton-list');
			if (!listEl) return;

            if (skeleton) skeleton.style.display = 'block';
            listEl.style.display = 'none';

			try {
				const res = await fetch('/api/transactions', {
					headers: {
						Authorization: `Bearer ${getToken()}`
					}
				});
				const payload = await readResponsePayload(res);
				if (!res.ok) {
					console.error('Load transactions failed:', {
						status: res.status,
						payload: payload?.json ?? payload?.text
					});
					throw new Error(getErrorMessage(payload, 'Failed to load transactions'));
				}

				const data = payload?.json;
				const transactions = Array.isArray(data) ? data : data?.data || [];
				renderTransactions(transactions);
                updateDashboardStats(transactions);

                if (skeleton) skeleton.style.display = 'none';
                listEl.style.display = 'block';
                } catch (e) {
                console.error('Load transactions error:', e);
                listEl.innerHTML = `<div class="empty-history"><p>${escapeHtml(e.message)}</p></div>`;
                // Shimmer Fix: Update stats to 0 even on error to clear skeleton
                updateDashboardStats([]);
                if (skeleton) skeleton.style.display = 'none';
                listEl.style.display = 'block';
                }
                }

                function resetTransactionForm() {
                const form = document.getElementById('transaction-form');
                if (!form) return;

                form.reset();
                const idInput = document.getElementById('trans-id');
                if (idInput) idInput.value = '';

                const otherGrp = document.getElementById('trans-wallet-other-group');
                if (otherGrp) otherGrp.style.display = 'none';
                
                const messageDiv = document.getElementById('transaction-message');
                if (messageDiv) {
                    messageDiv.innerHTML = '';
                    messageDiv.className = 'message';
                }

                // Reset Custom Selects UI
                form.querySelectorAll('.input-group').forEach(group => group.classList.remove('has-value'));
                form.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
                    wrapper.classList.remove('has-value');
                    wrapper.classList.remove('open');
                    const triggerSpan = wrapper.querySelector('.custom-select-trigger span');
                    if (triggerSpan) triggerSpan.innerText = '';
                    wrapper.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                });
                }

                function resetAddWalletForm() {
                    const form = document.getElementById('add-wallet-form');
                    if (!form) return;
                    form.reset();
                    const messageDiv = document.getElementById('add-wallet-message');
                    if (messageDiv) {
                        messageDiv.innerHTML = '';
                        messageDiv.className = 'message';
                    }
                    form.querySelectorAll('.input-group').forEach(group => group.classList.remove('has-value'));
                    form.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
                        wrapper.classList.remove('has-value');
                        wrapper.classList.remove('open');
                        const triggerSpan = wrapper.querySelector('.custom-select-trigger span');
                        if (triggerSpan) triggerSpan.innerText = '';
                        wrapper.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                    });
                }

                function resetTransferForm() {
                    const form = document.getElementById('transfer-form');
                    if (!form) return;
                    form.reset();
                    const messageDiv = document.getElementById('transfer-message');
                    if (messageDiv) {
                        messageDiv.innerHTML = '';
                        messageDiv.className = 'message';
                    }
                    form.querySelectorAll('.input-group').forEach(group => group.classList.remove('has-value'));
                    form.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
                        wrapper.classList.remove('has-value');
                        wrapper.classList.remove('open');
                        const triggerSpan = wrapper.querySelector('.custom-select-trigger span');
                        if (triggerSpan) triggerSpan.innerText = '';
                        wrapper.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                    });
                }

                function renderTransactions(rows) {			const listEl = document.getElementById('transaction-list-items');
			if (!listEl) return;

			if (!rows || rows.length === 0) {
				listEl.innerHTML = `<div class="empty-history"><p>No transactions found.</p></div>`;
				return;
			}
			
			window.currentTransactions = rows;

			listEl.innerHTML = rows
				.map((row, idx) => renderTransactionItem(row, idx + 1))
				.join('');

			// Re-initialize icons for the new elements
			if (typeof lucide !== 'undefined') {
				lucide.createIcons();
			}
		}

		function renderTransactionItem(row, recNumber) {
			const title = escapeHtml(row.description ?? row.title ?? '');
			const type = String(row.type ?? '').toLowerCase();
			const isIncome = type === 'income';
			const isExpense = type === 'expense';
			const isTransfer = type === 'transfer';
			
			const amountValue = Number(row.amount ?? 0);
			let amountClass = isIncome ? 'income' : (isExpense ? 'expense' : '');
			if (isTransfer) {
				const lowerDesc = (row.description || '').toLowerCase();
				if (lowerDesc.includes('out to ')) amountClass = 'expense';
				else if (lowerDesc.includes('in from ')) amountClass = 'income';
				else amountClass = 'transfer';
			}

			const badgeClass = isIncome ? 'badge-income' : (isExpense ? 'badge-expense' : (isTransfer ? 'badge-transfer' : ''));
			
			const wallet = escapeHtml(row.wallet_type ?? row.wallet ?? '');
			const date = formatDate(row.dateoftrans ?? row.date);

			return `
				<div class="transaction-item">
					<div class="transaction-row" onclick="this.parentElement.classList.toggle('expanded')">
						<span class="rec-number">${recNumber}</span>
						<span class="rec-title">${title}</span>
						<span class="rec-stats ${amountClass}">${formatCurrency(amountValue)}</span>
						<span class="rec-type"><span class="badge ${badgeClass}">${escapeHtml(row.type ?? '')}</span></span>
						<span class="rec-date">${escapeHtml(date)}</span>
						<span class="rec-wallet">${wallet}</span>
						<span class="rec-actions">
							<button class="icon-btn edit-btn" type="button" onclick="handleEditTransaction(${row.trans_id})" title="Edit Transaction"><i data-lucide="pencil"></i></button>
							<button class="icon-btn delete-btn" type="button" onclick="handleDeleteTransaction(${row.trans_id})" title="Delete Transaction"><i data-lucide="trash-2"></i></button>
							<span class="expand-arrow"><i data-lucide="chevron-down"></i></span>
						</span>
					</div>
					<div class="transaction-details">
						<p><strong>Wallet:</strong> ${wallet || '—'}</p>
					</div>
				</div>
			`;
		}

window.goals = [];

async function loadGoals() {
    if (!isAuthenticated()) return;
    const skeleton = document.getElementById('goal-skeleton-grid');
    const container = document.getElementById('goal-grid-container');
    if (skeleton) skeleton.style.display = 'grid';
    if (container) container.style.display = 'none';

    try {
        const res = await fetch('/api/goals', {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (!res.ok) throw new Error('Failed to load goals');
        const data = await res.json();
        window.goals = data.goals || [];
        renderGoals();

        if (skeleton) skeleton.style.display = 'none';
        if (container) container.style.display = 'grid';
    } catch (e) {
        console.error('Load goals error:', e);
        renderGoals();
        if (skeleton) skeleton.style.display = 'none';
        if (container) container.style.display = 'grid';
    }
}

function renderGoals() {
    if (typeof updateSidebarStats === 'function') updateSidebarStats();
    const container = document.getElementById('goal-grid-container');
    if (!container) return;

    if (!window.goals || window.goals.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; color: #666; text-align: center;">No savings goals found. Add one to start tracking your progress.</p>';
        return;
    }

    container.innerHTML = window.goals.map(g => {
        const target = Number(g.target_amount || 0);
        const current = Number(g.current_amount || 0);
        let percentage = target > 0 ? (current / target) * 100 : 0;
        if (percentage > 100) percentage = 100;

        let deadlineStr = '';
        if (g.deadline) {
            const d = new Date(g.deadline);
            deadlineStr = `Target Date: ${d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
        }

        return `
            <div class="goal-card">
                <button class="card-delete-btn" onclick="event.stopPropagation(); handleDeleteGoal(${g.goal_id}, '${escapeHtml(g.title)}')">×</button>
                <h3>${escapeHtml(g.title)}</h3>
                <div class="goal-deadline">${escapeHtml(deadlineStr)}</div>
                
                <div class="goal-amounts">
                    <span class="goal-current">${formatCurrency(current)}</span>
                    <span class="goal-target">${formatCurrency(target)}</span>
                </div>
                
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${percentage}%;"></div>
                </div>

                <div class="goal-actions">
                    <button class="btn-add-funds" onclick="openAddFundsModal(${g.goal_id})">Add Funds</button>
                </div>
            </div>
        `;
    }).join('');
}

window.handleDeleteGoal = async function(goalId, title) {
    showConfirm('Delete Goal', `Are you sure you want to delete the goal "${title}"?`, async () => {
        showCoinLoader('DELETING GOAL...');
        try {
            const res = await fetch('/api/goals', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ goal_id: goalId })
            });
            const payload = await readResponsePayload(res);
            if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to delete goal'));
            
            showToast('Goal deleted successfully');
            await loadGoals();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            hideCoinLoader();
        }
    });
};

		document.addEventListener('DOMContentLoaded', function() {
			applyThemeSettings();
			initializeSettingsPanel();
			checkAuthenticationForUserPage();
			loadTransactions();
			loadWallets();
			loadGoals();

			// Initialize Lucide Icons
			if (typeof lucide !== 'undefined') {
				lucide.createIcons();
			}

			// Handle URL Hash for Routing
			const hash = window.location.hash.substring(1); // remove the '#'
			if (hash && document.getElementById('view-' + hash)) {
				showView(hash, document.querySelector(`.nav-item[onclick*="showView('${hash}'"]`));
			}

			// Add observer for settings icons
			const viewSettings = document.getElementById('view-settings');
			if (viewSettings) {
				const observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						if (mutation.attributeName === 'style' && viewSettings.style.display === 'block') {
							if (typeof lucide !== 'undefined') lucide.createIcons();
						}
					});
				});
				observer.observe(viewSettings, { attributes: true });
			}

			const addGoalForm = document.getElementById('add-goal-form');
			if (addGoalForm) {
				// Set up date input validation
				const deadlineInput = document.getElementById('goal-deadline');
				if (deadlineInput) {
					// Set minimum date to tomorrow
					const tomorrow = new Date();
					tomorrow.setDate(tomorrow.getDate() + 1);
					const minDate = tomorrow.toISOString().split('T')[0];
					deadlineInput.min = minDate;
					deadlineInput.value = minDate; // Default to tomorrow
				}

				addGoalForm.addEventListener('submit', async function(e) {
					e.preventDefault();
					const title = document.getElementById('goal-title').value.trim();
					const target_amount = parseFloat(document.getElementById('goal-target-amount').value);
					const deadline = document.getElementById('goal-deadline').value;
					
					const messageDiv = document.getElementById('add-goal-message');
					messageDiv.innerHTML = '';
					messageDiv.className = 'message';

					// Validate deadline is not in the past
					if (deadline) {
						const selectedDate = new Date(deadline);
						const today = new Date();
						today.setHours(0, 0, 0, 0); // Reset time to start of day
						
						if (selectedDate < today) {
							messageDiv.innerHTML = 'Please select a valid future date.';
							messageDiv.className = 'message error';
							return;
						}
					}

					// Validate required fields
					if (!title || isNaN(target_amount) || target_amount <= 0) {
						messageDiv.innerHTML = 'Please fill in all required fields with valid values.';
						messageDiv.className = 'message error';
						return;
					}

					showCoinLoader('SAVING GOAL...');
					try {
						const res = await fetch('/api/goals', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
							body: JSON.stringify({ title, target_amount, deadline })
						});
						
						const payload = await readResponsePayload(res);
						if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to create goal'));
						
						addGoalForm.reset();
						// Reset deadline to tomorrow after form reset
						const deadlineInput = document.getElementById('goal-deadline');
						if (deadlineInput) {
							const tomorrow = new Date();
							tomorrow.setDate(tomorrow.getDate() + 1);
							deadlineInput.value = tomorrow.toISOString().split('T')[0];
						}
						closeAllModals();
						showToast('Goal created successfully');
						await loadGoals();
					} catch (err) {
						messageDiv.innerHTML = escapeHtml(err.message);
						messageDiv.className = 'message error';
					} finally {
						hideCoinLoader();
					}
				});
			}

			const addFundsForm = document.getElementById('add-funds-form');
			if (addFundsForm) {
				addFundsForm.addEventListener('submit', async function(e) {
					e.preventDefault();
					const goal_id = document.getElementById('fund-goal-id').value;
					const add_amount = parseFloat(document.getElementById('fund-amount').value);
					
					const messageDiv = document.getElementById('add-funds-message');
					messageDiv.innerHTML = '';
					messageDiv.className = 'message';

					showCoinLoader('ADDING FUNDS...');
					try {
						const res = await fetch('/api/goals', {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
							body: JSON.stringify({ goal_id, add_amount })
						});
						
						const payload = await readResponsePayload(res);
						if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to update goal'));
						
						addFundsForm.reset();
						closeAllModals();
						showToast('Funds added successfully');
						await loadGoals();
					} catch (err) {
						messageDiv.innerHTML = escapeHtml(err.message);
						messageDiv.className = 'message error';
					} finally {
						hideCoinLoader();
					}
				});
			}

			const addWalletForm = document.getElementById('add-wallet-form');
			if (addWalletForm) {
				addWalletForm.addEventListener('submit', async function(e) {
					e.preventDefault();
					const name = document.getElementById('wallet-name').value.trim();
					const type = document.getElementById('wallet-type').value;
					const initial_balance = document.getElementById('wallet-initial-balance').value;
					
					const messageDiv = document.getElementById('add-wallet-message');
					messageDiv.innerHTML = '';
					messageDiv.className = 'message';

					showCoinLoader('SAVING WALLET...');
					try {
						const res = await fetch('/api/wallets', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
							body: JSON.stringify({ name, type, initial_balance })
						});
						
						const payload = await readResponsePayload(res);
						if (!res.ok) {
							throw new Error(getErrorMessage(payload, 'Failed to create wallet'));
						}
						
						resetAddWalletForm();
						closeAllModals();
						showToast('Wallet created successfully');
						await loadWallets();
					} catch (err) {
						messageDiv.innerHTML = escapeHtml(err.message);
						messageDiv.className = 'message error';
						console.error('Add wallet error:', err);
					} finally {
						hideCoinLoader();
					}
				});
			}

			const transferForm = document.getElementById('transfer-form');
			if (transferForm) {
				transferForm.addEventListener('submit', async function(e) {
					e.preventDefault();
					const from = document.getElementById('transfer-from').value;
					const to = document.getElementById('transfer-to').value;
					const amount = parseFloat(document.getElementById('transfer-amount').value);
					
					const messageDiv = document.getElementById('transfer-message');
					messageDiv.className = 'message';
					messageDiv.innerHTML = '';

					if (!from || !to) return (messageDiv.innerHTML = 'Please select both wallets', messageDiv.className = 'message error');
					if (from === to) return (messageDiv.innerHTML = 'Cannot transfer to the same wallet', messageDiv.className = 'message error');
					if (!amount || amount <= 0) return (messageDiv.innerHTML = 'Amount must be greater than 0', messageDiv.className = 'message error');

					// Check for sufficient funds
					const sourceWallet = window.wallets.find(w => w.name === from);
					if (sourceWallet && Number(sourceWallet.calculated_balance) < amount) {
						return (messageDiv.innerHTML = `Insufficient funds in "${from}" (Balance: ${formatCurrency(sourceWallet.calculated_balance)})`, messageDiv.className = 'message error');
					}

					showCoinLoader('TRANSFERRING FUNDS...');
					try {
						// Create Transfer Out from From Wallet
						const res1 = await fetch('/api/transactions', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
							body: JSON.stringify({ 
                                description: `Transfer Out to ${document.querySelector('#transfer-to option[value="'+to+'"]').dataset.name}`, 
                                type: 'Transfer', 
                                wallet_type: document.querySelector('#transfer-from option[value="'+from+'"]').dataset.name, 
                                wallet_id: from,
                                amount 
                            })
						});
						if (!res1.ok) throw new Error('Failed to process transfer (Step 1)');

						// Create Transfer In to To Wallet
						const res2 = await fetch('/api/transactions', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
							body: JSON.stringify({ 
                                description: `Transfer In from ${document.querySelector('#transfer-from option[value="'+from+'"]').dataset.name}`, 
                                type: 'Transfer', 
                                wallet_type: document.querySelector('#transfer-to option[value="'+to+'"]').dataset.name, 
                                wallet_id: to,
                                amount 
                            })
						});
						if (!res2.ok) throw new Error('Failed to process transfer (Step 2)');

						resetTransferForm();
						hideCoinLoader();
						closeAllModals();
						showToast('Transfer completed successfully');
						await loadTransactions();
						await loadWallets();
					} catch (err) {
						messageDiv.innerHTML = escapeHtml(err.message);
						messageDiv.className = 'message error';
					} finally {
						hideCoinLoader();
					}
				});
			}

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

					showCoinLoader('VERIFYING CREDENTIALS...');

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
								window.location.href = '/dashboard'; // If using your vercel.json rewrite
								// OR 
								window.location.href = '/views/dashboard.html'; // Direct path
							}, 1500);
						} else {
							messageDiv.innerHTML = data.error || 'An error occurred';
							messageDiv.className = 'message error';
							hideCoinLoader();
						}
					} catch (error) {
						messageDiv.innerHTML = 'Connection error: ' + error.message;
						messageDiv.className = 'message error';
						console.error('Login error:', error);
						hideCoinLoader();
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

					showCoinLoader('CREATING ACCOUNT...');

					try {
						const response = await fetch('/api/accounts.js', {
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
							// Change this line to be more defensive:
							const rawDate = data.data.createdat || data.data.createdAt || new Date();
							const createdDate = new Date(rawDate);
							
							const formattedDate = createdDate.toLocaleDateString('en-US', { 
									year: 'numeric', month: 'short', day: 'numeric' 
							});
							
							messageDiv.innerHTML = `✓ Account created! Redirecting...`;
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
					} finally {
						hideCoinLoader();
					}
				});
			}

			const forgotForm = document.getElementById('forgot-form');
			if (forgotForm) {
				forgotForm.addEventListener('submit', async function(e) {
					e.preventDefault();

					const email = document.getElementById('forgot-email')?.value?.trim();
					const messageDiv = document.getElementById('forgot-message');
					const submitBtn = forgotForm.querySelector('button[type="submit"]');
					const originalText = submitBtn ? submitBtn.textContent : 'Send Reset Link';

					if (messageDiv) {
						messageDiv.innerHTML = '';
						messageDiv.className = 'message';
					}

					if (!email) {
						if (messageDiv) {
							messageDiv.innerHTML = 'Email is required';
							messageDiv.className = 'message error';
						}
						return;
					}

					if (submitBtn) {
						submitBtn.disabled = true;
						submitBtn.textContent = 'Sending...';
					}

					try {
						const response = await fetch('/api/reset?action=forgot', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ email })
						});

						const payload = await readResponsePayload(response);
						const message = payload?.json?.message || payload?.json?.error || getErrorMessage(payload, 'Unable to send reset link');

						if (!response.ok) {
							throw new Error(message);
						}

						if (messageDiv) {
							messageDiv.innerHTML = message;
							messageDiv.className = 'message success';
						}

						forgotForm.reset();
					} catch (error) {
						if (messageDiv) {
							messageDiv.innerHTML = error.message || 'Unable to send reset link';
							messageDiv.className = 'message error';
						}
						console.error('Forgot password error:', error);
					} finally {
						if (submitBtn) {
							submitBtn.disabled = false;
							submitBtn.textContent = originalText;
						}
					}
				});
			}

			const transactionForm = document.getElementById('transaction-form');
			if (transactionForm) {
				const walletTypeSelect = document.getElementById('trans-wallet-type');
				const walletOtherGroup = document.getElementById('trans-wallet-other-group');
				const walletOtherInput = document.getElementById('trans-wallet-other');
				if (walletTypeSelect) {
					walletTypeSelect.addEventListener('change', () => {
						const v = String(walletTypeSelect.value || '').trim();
						const isOther = v.toLowerCase() === 'other';
						if (walletOtherGroup) walletOtherGroup.style.display = isOther ? '' : 'none';
						if (walletOtherInput) {
							walletOtherInput.value = isOther ? walletOtherInput.value : '';
							walletOtherInput.required = isOther;
						}
					});
				}

				transactionForm.addEventListener('submit', async function (e) {
					e.preventDefault();
					
					const submitBtn = transactionForm.querySelector('button[type="submit"]');
					const originalBtnText = submitBtn ? submitBtn.textContent : 'SAVE';
					const isEdit = !!document.getElementById('trans-id')?.value;
					if (submitBtn) submitBtn.disabled = true;
					showCoinLoader(isEdit ? 'UPDATING RECORD...' : 'SAVING TRANSACTION...');

					const transId = document.getElementById('trans-id')?.value;
					const description = document.getElementById('trans-description')?.value?.trim() || '';
					const type = document.getElementById('trans-type')?.value?.trim() || '';
					const walletIdRaw = document.getElementById('trans-wallet-type')?.value?.trim() || '';
					const walletOther = document.getElementById('trans-wallet-other')?.value?.trim() || '';
					
                    let walletType = "";
                    let walletId = null;

                    if (walletIdRaw.toLowerCase() === 'other') {
                        walletType = walletOther;
                        walletId = null;
                    } else {
                        const selectedOption = document.querySelector(`#trans-wallet-type option[value="${walletIdRaw}"]`);
                        walletType = selectedOption ? selectedOption.dataset.name : "";
                        walletId = walletIdRaw;
                    }

					const amountStr = document.getElementById('trans-amount')?.value?.trim() || '';
					const messageDiv = document.getElementById('transaction-message');
					if (messageDiv) {
						messageDiv.innerHTML = '';
						messageDiv.className = 'message';
					}

					const errors = [];
					if (!description) errors.push('Description is required');
					if (!type) errors.push('Type is required');
					if (!walletIdRaw) errors.push('Wallet Type is required');
					else if (walletIdRaw.toLowerCase() === 'other' && !walletOther) errors.push('Please enter your wallet type');
					const amount = Number(amountStr);
					if (!amountStr) errors.push('Amount is required');
					else if (!Number.isFinite(amount)) errors.push('Amount must be a number');

					// Check for sufficient funds if it's an Expense
					if (type === 'Expense') {
						const selectedWallet = window.wallets.find(w => w.name === walletType);
						if (selectedWallet && Number(selectedWallet.calculated_balance) < amount) {
							errors.push(`Insufficient funds in "${walletType}" (Available: ${formatCurrency(selectedWallet.calculated_balance)})`);
						}
					}

					if (errors.length > 0) {
						if (messageDiv) {
							messageDiv.innerHTML = escapeHtml(errors[0]);
							messageDiv.className = 'message error';
						}
						if (submitBtn) {
							submitBtn.disabled = false;
						}
						hideCoinLoader();
						return;
					}

					if (!isAuthenticated()) {
						hideCoinLoader();
						closeTransactionModal();
						openLoginModal();
						return;
					}

					try {
						const res = await fetch('/api/transactions', {
							method: transId ? 'PUT' : 'POST',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${getToken()}`
							},
							body: JSON.stringify({
								...(transId ? { trans_id: transId } : {}),
								description,
								type,
								wallet_type: walletType,
                                wallet_id: walletId,
								amount
							})
						});

						const payload = await readResponsePayload(res);
						if (!res.ok) {
							console.error('Save transaction failed:', {
								status: res.status,
								payload: payload?.json ?? payload?.text,
								request: { id: transId, description, type, wallet_type: walletType, amount }
							});
							throw new Error(getErrorMessage(payload, 'Failed to save transaction'));
						}

						resetTransactionForm();
						hideCoinLoader();
						closeTransactionModal();
						await loadTransactions();
						await loadWallets(); // Refresh wallet balances
						showToast(transId ? 'Transaction updated' : 'Transaction saved', 'success');
					} catch (err) {
						hideCoinLoader();
						if (messageDiv) {
							messageDiv.innerHTML = escapeHtml(err.message);
							messageDiv.className = 'message error';
						}
						console.error('Save transaction error:', err);
					} finally {
						try { hideCoinLoader(); } catch(e) {}
						if (submitBtn) {
							submitBtn.disabled = false;
							resetTransactionForm();
							closeAllModals();
							
							submitBtn.style.backgroundColor = '';
						}
					}
				});
			}
			
			// Initialize Custom Selects
			initializeCustomSelects();
		});

// --- Coin Loader UI ---
function showCoinLoader(text = 'PROCESSING...') {
	let loader = document.getElementById('coin-loader');
	if (!loader) {
		loader = document.createElement('div');
		loader.id = 'coin-loader';
		loader.className = 'coin-loader-overlay';
		loader.innerHTML = `
			<div class="spinning-coin">₱</div>
			<div class="coin-loader-text" id="coin-loader-text"></div>
		`;
		document.body.appendChild(loader);
	}
	document.getElementById('coin-loader-text').innerText = text;
	loader.classList.add('active');
}

function hideCoinLoader() {
	const loader = document.getElementById('coin-loader');
	if (loader) loader.classList.remove('active');
}

// --- Custom Select Dropdowns ---
function initializeCustomSelects() {
	const selects = document.querySelectorAll('select.floating-input, select.settings-select');
	selects.forEach(select => {
		if (select.closest('.custom-select-wrapper')) return;

		const wrapper = document.createElement('div');
		wrapper.className = 'custom-select-wrapper';
		wrapper.setAttribute('tabindex', '0');

		// Insert the wrapper as a sibling of the select and label
		select.parentNode.insertBefore(wrapper, select);
		wrapper.appendChild(select);
		select.style.display = 'none';
		const isSettings = select.classList.contains('settings-select');
		
		const trigger = document.createElement('div');
		trigger.className = isSettings ? 'custom-select-trigger settings-trigger' : 'custom-select-trigger floating-input';
		
		const textSpan = document.createElement('span');
		if (select.value) {
			const opt = select.options[select.selectedIndex];
			textSpan.innerText = opt ? opt.text : '';
			wrapper.classList.add('has-value');
			if (!isSettings) {
				const group = select.closest('.input-group');
				if (group) group.classList.add('has-value');
			}
		} else {
			textSpan.innerText = '';
		}
		trigger.appendChild(textSpan);
		
		const optionsList = document.createElement('div');
		optionsList.className = 'custom-select-options';
		
		Array.from(select.options).forEach(opt => {
			if (opt.hidden || opt.disabled || opt.value === "") return;
			
			const optionDiv = document.createElement('div');
			optionDiv.className = 'custom-option';
			if (opt.selected) optionDiv.classList.add('selected');
			optionDiv.innerText = opt.text;
			
			optionDiv.addEventListener('click', (e) => {
				e.stopPropagation();
				select.value = opt.value;
				textSpan.innerText = opt.text;
				wrapper.classList.add('has-value');
				if (!isSettings) {
					const group = select.closest('.input-group');
					if (group) group.classList.add('has-value');
				}
				optionsList.classList.remove('open');
				wrapper.classList.remove('open');
				
				select.dispatchEvent(new Event('change'));
				
				Array.from(optionsList.children).forEach(c => c.classList.remove('selected'));
				optionDiv.classList.add('selected');
			});
			optionsList.appendChild(optionDiv);
		});
		
		wrapper.appendChild(trigger);
		wrapper.appendChild(optionsList);
		
		trigger.addEventListener('click', (e) => {
			e.stopPropagation();
			document.querySelectorAll('.custom-select-wrapper').forEach(w => {
				if (w !== wrapper) {
					w.classList.remove('open');
					w.querySelector('.custom-select-options')?.classList.remove('open');
					// NEW: Also reset has-value if not selected
					const s = w.querySelector('select');
					if (s && !s.value) {
						w.classList.remove('has-value');
						const g = s.closest('.input-group');
						if (g) g.classList.remove('has-value');
					}
				}
			});
			wrapper.classList.toggle('open');
			if (wrapper.classList.contains('open')) {
				const group = select.closest('.input-group');
				if (group) group.classList.add('has-value');
			} else if (!select.value) {
				const group = select.closest('.input-group');
				if (group) group.classList.remove('has-value');
			}
		});
		
		select.addEventListener('change', () => {
			if (select.value) {
				const opt = select.options[select.selectedIndex];
				textSpan.innerText = opt ? opt.text : '';
				wrapper.classList.add('has-value');
				const group = select.closest('.input-group');
				if (group) group.classList.add('has-value');
			} else {
				textSpan.innerText = '';
				wrapper.classList.remove('has-value');
				const group = select.closest('.input-group');
				if (group) group.classList.remove('has-value');
			}
		});
	});

	document.addEventListener('click', () => {
		document.querySelectorAll('.custom-select-wrapper').forEach(w => {
			w.classList.remove('open');
			const s = w.querySelector('select');
			if (s && !s.value) {
				w.classList.remove('has-value');
				const g = s.closest('.input-group');
				if (g) g.classList.remove('has-value');
			}
		});
	});
}

function updateDashboardStats(transactions) {
    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const transfer = transactions
        .filter(t => t.type === 'Transfer' && (t.description || '').toLowerCase().includes('out to '))
        .reduce((sum, t) => sum + Number(t.amount), 0);


    const incomeEl = document.querySelector('.income-card .stat-value');
    const expenseEl = document.querySelector('.expense-card .stat-value');
    const transferEl = document.querySelector('.transfer-card .stat-value');

    if (incomeEl) {
        incomeEl.innerHTML = formatCurrency(income);
        incomeEl.classList.add('loading-transition');
    }
    if (expenseEl) {
        expenseEl.innerHTML = formatCurrency(expense);
        expenseEl.classList.add('loading-transition');
    }
    if (transferEl) {
        transferEl.innerHTML = formatCurrency(transfer);
        transferEl.classList.add('loading-transition');
    }

    renderIncomeSummary(transactions);
    renderDashboardChart(transactions);
    renderCashFlowChart(transactions);
}

function renderIncomeSummary(transactions) {
    const container = document.getElementById('income-summary-container');
    const listEl = document.getElementById('income-summary-list');
    if (!container || !listEl) return;

    const incomeTransactions = transactions.filter(t => t.type === 'Income').slice(0, 5);
    
    if (incomeTransactions.length === 0) {
        listEl.innerHTML = '<p style="color: #999; font-style: italic; padding: 10px;">No income records found.</p>';
    } else {
        listEl.innerHTML = incomeTransactions.map(t => `
            <div class="income-summary-item">
                <span class="income-summary-desc">${escapeHtml(t.description)}</span>
                <span class="income-summary-amount">+ ${formatCurrency(t.amount)}</span>
            </div>
        `).join('');
    }

    // Transition from skeleton to content
    const skeleton = container.querySelector('.income-summary-skeleton');
    if (skeleton) skeleton.style.display = 'none';
    listEl.style.display = 'block';
}

let dashboardChartInstance = null;
function renderDashboardChart(transactions) {
    const container = document.getElementById('chart-summary-container');
    const wrapper = document.getElementById('dashboard-chart-wrapper');
    const canvas = document.getElementById('dashboard-doughnut-chart');
    if (!container || !wrapper || !canvas) return;

    const expenseData = transactions.filter(t => t.type === 'Expense');
    const categories = {};
    expenseData.forEach(t => {
        const label = t.wallet_type || 'Other';
        categories[label] = (categories[label] || 0) + Number(t.amount);
    });

    const labels = Object.keys(categories);
    const amounts = Object.values(categories);

    if (dashboardChartInstance) dashboardChartInstance.destroy();

    if (amounts.length > 0) {
        dashboardChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fab1a0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom', 
                        labels: { 
                            boxWidth: 12, 
                            font: { size: 11 },
                            color: document.body.classList.contains('dark-mode') ? '#edf1ee' : '#1a241b'
                        } 
                    }
                }
            }
        });
    } else {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Inter';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.fillText('No expense data to display', canvas.width / 2, canvas.height / 2);
    }

    // Transition from skeleton to content
    const skeleton = container.querySelector('.chart-skeleton-container');
    if (skeleton) skeleton.style.display = 'none';
    wrapper.style.display = 'block';
}

let cashFlowChartInstance = null;
function renderCashFlowChart(transactions) {
    const container = document.querySelector('.cash-flow-chart-container');
    const wrapper = document.getElementById('cash-flow-chart-wrapper');
    const canvas = document.getElementById('cash-flow-line-chart');
    if (!container || !wrapper || !canvas) return;

    // Group transactions by date
    const dateMap = {};
    transactions.forEach(t => {
        if (t.type === 'Transfer') return; // Skip transfers for cash flow
        const dateStr = t.dateoftrans ?? t.date;
        if (!dateStr) return;
        const rawDate = new Date(dateStr);
        const dateLabel = rawDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        
        if (!dateMap[dateLabel]) dateMap[dateLabel] = { income: 0, expense: 0, rawDate: rawDate };
        
        if (t.type === 'Income') dateMap[dateLabel].income += Number(t.amount);
        if (t.type === 'Expense') dateMap[dateLabel].expense += Number(t.amount);
    });

    // Sort dates
    const sortedDates = Object.keys(dateMap).sort((a, b) => dateMap[a].rawDate - dateMap[b].rawDate);
    const incomeData = sortedDates.map(d => dateMap[d].income);
    const expenseData = sortedDates.map(d => dateMap[d].expense);

    if (cashFlowChartInstance) cashFlowChartInstance.destroy();

    if (sortedDates.length > 0) {
        cashFlowChartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: sortedDates,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Expense',
                        data: expenseData,
                        borderColor: '#ff7675',
                        backgroundColor: 'rgba(255, 118, 117, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
                options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { 
                        position: 'top', 
                        labels: { 
                            boxWidth: 12, 
                            font: { size: 12, weight: '700' }, 
                            color: document.body.classList.contains('dark-mode') ? '#edf1ee' : '#1a241b' 
                        } 
                    },
                    tooltip: {
                        backgroundColor: document.body.classList.contains('dark-mode') ? '#2a302c' : '#fff',
                        titleColor: document.body.classList.contains('dark-mode') ? '#edf1ee' : '#374738',
                        bodyColor: document.body.classList.contains('dark-mode') ? '#edf1ee' : '#374738',
                        borderColor: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 8,
                        titleFont: { weight: 'bold' }
                    }
                },
                scales: {
                    x: {
                        grid: { 
                            display: false, 
                            color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' 
                        },
                        ticks: { 
                            color: document.body.classList.contains('dark-mode') ? '#edf1ee' : '#1a241b',
                            font: { weight: '700', size: 12 }
                        }
                    },
                    y: {
                        grid: { 
                            color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' 
                        },
                        ticks: { 
                            color: document.body.classList.contains('dark-mode') ? '#edf1ee' : '#1a241b',
                            font: { weight: '700', size: 12 }
                        }
                    }
                }
            }
        });
    } else {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Inter';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.fillText('No transaction data to display', canvas.width / 2, canvas.height / 2);
    }

    const skeleton = container.querySelector('.trend-chart-skeleton-container');
    if (skeleton) skeleton.style.display = 'none';
    wrapper.style.display = 'block';
}