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

			const initials = userData.username.substring(0, 2).toUpperCase();
			document.getElementById('profile-initials').textContent = initials;
			document.getElementById('profile-username').textContent = userData.username;
			document.getElementById('profile-email').textContent = userData.email;
			document.getElementById('profile-phone').textContent = userData.pnumber || 'Not provided';
			
			// Use OR (||) to catch both naming styles
			const createdDate = new Date(userData.createdat || userData.created_at);
			const formattedDate = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
			
			const createdEl = document.getElementById('profile-createdat') || document.getElementById('profile-createdAt');
			if (createdEl) createdEl.textContent = formattedDate;
		}

		function handleLogout() {
			removeToken();
			window.location.href = '/';
		}

		function handleNewTransactionClick() {
			if (!isAuthenticated()) {
				openLoginModal();
				return;
			}

			openTransactionModal();
		}

		function openTransactionModal(isEdit = false) {
			closeAllModals();
			const modal = document.getElementById('transaction-modal');
			const header = modal ? modal.querySelector('.login-header') : null;
			if (header) {
				header.textContent = isEdit ? 'Edit Transaction' : 'New Transaction';
			}
			if (!isEdit) {
				const form = document.getElementById('transaction-form');
				if (form) form.reset();
				const idInput = document.getElementById('trans-id');
				if (idInput) idInput.value = '';
				const otherGrp = document.getElementById('trans-wallet-other-group');
				if (otherGrp) otherGrp.style.display = 'none';
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
			if (!Number.isFinite(n)) return '₱ 0.00';
			return `₱ ${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

		function showConfirm(title, message, onConfirm) {
			document.getElementById('confirm-title').textContent = title;
			document.getElementById('confirm-message').textContent = message;
			const modal = document.getElementById('confirm-modal');
			if (modal) modal.classList.add('active');
			
			const btnOk = document.getElementById('btn-confirm-ok');
			const btnCancel = document.getElementById('btn-confirm-cancel');
			
			const newOk = btnOk.cloneNode(true);
			btnOk.parentNode.replaceChild(newOk, btnOk);
			const newCancel = btnCancel.cloneNode(true);
			btnCancel.parentNode.replaceChild(newCancel, btnCancel);
			
			newOk.addEventListener('click', () => {
				if (modal) modal.classList.remove('active');
				if (typeof onConfirm === 'function') onConfirm();
			});
			newCancel.addEventListener('click', () => {
				if (modal) modal.classList.remove('active');
			});
		}

		window.handleDeleteTransaction = async function(id) {
			showConfirm('Delete Transaction', 'Are you sure you want to delete this transaction?', async () => {
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
					showToast('Transaction deleted', 'success');
					loadTransactions();
				} catch (err) {
					showToast('Error deleting transaction', 'error');
				}
			});
		};

		window.handleEditTransaction = function(id) {
			const row = (window.currentTransactions || []).find(t => t.trans_id === id);
			if (!row) return;
			
			document.getElementById('trans-id').value = id;
			document.getElementById('trans-description').value = row.description;
			document.getElementById('trans-type').value = row.type;
			
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
			document.getElementById('trans-amount').value = row.amount;
			
			openTransactionModal(true);
		};

		async function loadTransactions() {
			if (!isAuthenticated()) return;
			const listEl = document.getElementById('transaction-list-items');
			if (!listEl) return;

			try {
				listEl.innerHTML = `<div class="empty-history"><p>Loading transactions…</p></div>`;
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
				renderTransactions(Array.isArray(data) ? data : data?.data || []);
			} catch (e) {
				console.error('Load transactions error:', e);
				listEl.innerHTML = `<div class="empty-history"><p>${escapeHtml(e.message)}</p></div>`;
			}
		}

		function renderTransactions(rows) {
			const listEl = document.getElementById('transaction-list-items');
			if (!listEl) return;

			if (!rows || rows.length === 0) {
				listEl.innerHTML = `<div class="empty-history"><p>No transactions found.</p></div>`;
				return;
			}
			
			window.currentTransactions = rows;

			listEl.innerHTML = rows
				.map((row, idx) => renderTransactionItem(row, idx + 1))
				.join('');
		}

		function renderTransactionItem(row, recNumber) {
			const title = escapeHtml(row.description ?? row.title ?? '');
			const type = String(row.type ?? '').toLowerCase();
			const isIncome = type === 'income';
			const isExpense = type === 'expense';
			const amountValue = Number(row.amount ?? 0);
			const amountClass = isIncome ? 'income' : isExpense ? 'expense' : '';
			const badgeClass = isIncome ? 'badge-income' : isExpense ? 'badge-expense' : '';
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
							<button class="icon-btn edit-btn" type="button" onclick="handleEditTransaction(${row.trans_id})">✎</button>
							<button class="icon-btn delete-btn" type="button" onclick="handleDeleteTransaction(${row.trans_id})">🗑</button>
							<span class="expand-arrow">▼</span>
						</span>
					</div>
					<div class="transaction-details">
						<p><strong>Wallet:</strong> ${wallet || '—'}</p>
					</div>
				</div>
			`;
		}

		document.addEventListener('DOMContentLoaded', function() {
			checkAuthenticationForUserPage();
			loadTransactions();

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
					const isEdit = !!document.getElementById('trans-id')?.value;
					if (submitBtn) submitBtn.disabled = true;
					showCoinLoader(isEdit ? 'UPDATING RECORD...' : 'SAVING TRANSACTION...');

					const transId = document.getElementById('trans-id')?.value;
					const description = document.getElementById('trans-description')?.value?.trim() || '';
					const type = document.getElementById('trans-type')?.value?.trim() || '';
					const walletTypeRaw = document.getElementById('trans-wallet-type')?.value?.trim() || '';
					const walletOther = document.getElementById('trans-wallet-other')?.value?.trim() || '';
					const walletType =
						walletTypeRaw.toLowerCase() === 'other'
							? walletOther
							: walletTypeRaw;
					const amountStr = document.getElementById('trans-amount')?.value?.trim() || '';
					const messageDiv = document.getElementById('transaction-message');
					if (messageDiv) {
						messageDiv.innerHTML = '';
						messageDiv.className = 'message';
					}

					const errors = [];
					if (!description) errors.push('Description is required');
					if (!type) errors.push('Type is required');
					if (!walletTypeRaw) errors.push('Wallet Type is required');
					else if (walletTypeRaw.toLowerCase() === 'other' && !walletOther) errors.push('Please enter your wallet type');
					const amount = Number(amountStr);
					if (!amountStr) errors.push('Amount is required');
					else if (!Number.isFinite(amount)) errors.push('Amount must be a number');

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
								...(transId ? { id: transId } : {}),
								description,
								type,
								wallet_type: walletType,
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

						transactionForm.reset();
						document.getElementById('trans-id').value = '';
						closeTransactionModal();
						await loadTransactions();
						showToast(transId ? 'Transaction updated' : 'Transaction saved', 'success');
					} catch (err) {
						if (messageDiv) {
							messageDiv.innerHTML = escapeHtml(err.message);
							messageDiv.className = 'message error';
						}
						console.error('Save transaction error:', err);
					} finally {
						if (submitBtn) {
							submitBtn.disabled = false;
							submitBtn.textContent = originalBtnText;
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
	const selects = document.querySelectorAll('select.floating-input');
	selects.forEach(select => {
		if (select.closest('.custom-select-wrapper')) return;

		const wrapper = document.createElement('div');
		wrapper.className = 'custom-select-wrapper';
		wrapper.setAttribute('tabindex', '0');
		
		select.parentNode.insertBefore(wrapper, select);
		wrapper.appendChild(select);
		select.style.display = 'none';

		const trigger = document.createElement('div');
		trigger.className = 'custom-select-trigger floating-input';
		
		const textSpan = document.createElement('span');
		if (select.value) {
			const opt = select.options[select.selectedIndex];
			textSpan.innerText = opt ? opt.text : '';
			wrapper.classList.add('has-value');
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
				}
			});
			wrapper.classList.toggle('open');
		});
		
		select.addEventListener('change', () => {
			if (select.value) {
				const opt = select.options[select.selectedIndex];
				textSpan.innerText = opt ? opt.text : '';
				wrapper.classList.add('has-value');
			} else {
				textSpan.innerText = '';
				wrapper.classList.remove('has-value');
			}
		});
	});

	document.addEventListener('click', () => {
		document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
	});
}