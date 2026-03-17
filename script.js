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
			const createdDate = new Date(userData.created_at || userData.createdat);
			const formattedDate = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
			const createdEl =
				document.getElementById('profile-createdat') ||
				document.getElementById('profile-createdAt');
			if (createdEl) createdEl.textContent = formattedDate;
		}

		function handleLogout() {
			removeToken();
			window.location.href = 'BBMAI_GUEST.html';
		}

		function handleNewTransactionClick() {
			if (!isAuthenticated()) {
				openLoginModal();
				return;
			}

			openCreateTransactionModal();
		}

		function openTransactionModal() {
			closeAllModals();
			const modal = document.getElementById('transaction-modal');
			if (modal) modal.classList.add('active');
		}

		function setTransactionModalMode(mode, row) {
			const titleEl = document.getElementById('transaction-modal-title');
			const submitBtn = document.getElementById('transaction-submit-btn');
			const idInput = document.getElementById('trans-id');
			const messageDiv = document.getElementById('transaction-message');
			if (messageDiv) {
				messageDiv.innerHTML = '';
				messageDiv.className = 'message';
			}

			const isEdit = mode === 'edit';
			if (titleEl) titleEl.textContent = isEdit ? 'Edit Transaction' : 'New Transaction';
			if (submitBtn) submitBtn.textContent = isEdit ? 'SAVE CHANGES' : 'SAVE TRANSACTION';
			if (idInput) idInput.value = isEdit ? String(row?.trans_id ?? '') : '';

			// Prefill fields for edit
			if (isEdit && row) {
				const descEl = document.getElementById('trans-description');
				const typeEl = document.getElementById('trans-type');
				const walletEl = document.getElementById('trans-wallet-type');
				const walletOtherGroup = document.getElementById('trans-wallet-other-group');
				const walletOtherInput = document.getElementById('trans-wallet-other');
				const amountEl = document.getElementById('trans-amount');

				if (descEl) descEl.value = row.description ?? row.title ?? '';
				const typeVal = String(row.type ?? '').trim();
				if (typeEl) typeEl.value = typeVal || '';

				const walletVal = String(row.wallet_type ?? row.wallet ?? '').trim();
				// If wallet matches one of the select options, pick it; otherwise use Other
				if (walletEl) {
					const options = Array.from(walletEl.options || []).map(o => String(o.value || ''));
					const hasExact = options.includes(walletVal);
					if (hasExact) {
						walletEl.value = walletVal;
						if (walletOtherGroup) walletOtherGroup.style.display = 'none';
						if (walletOtherInput) {
							walletOtherInput.value = '';
							walletOtherInput.required = false;
						}
					} else {
						walletEl.value = 'Other';
						if (walletOtherGroup) walletOtherGroup.style.display = '';
						if (walletOtherInput) {
							walletOtherInput.value = walletVal;
							walletOtherInput.required = true;
						}
					}
				}

				if (amountEl) amountEl.value = String(row.amount ?? '');
			} else {
				// Reset "Other" wallet field visibility
				const walletOtherGroup = document.getElementById('trans-wallet-other-group');
				const walletOtherInput = document.getElementById('trans-wallet-other');
				if (walletOtherGroup) walletOtherGroup.style.display = 'none';
				if (walletOtherInput) {
					walletOtherInput.value = '';
					walletOtherInput.required = false;
				}
			}
		}

		function openCreateTransactionModal() {
			const form = document.getElementById('transaction-form');
			if (form) form.reset();
			setTransactionModalMode('create');
			openTransactionModal();
		}

		function openEditTransactionModal(row) {
			setTransactionModalMode('edit', row);
			openTransactionModal();
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
			const transId = row.trans_id ?? row.id ?? '';

			return `
				<div class="transaction-item" data-trans-id="${escapeHtml(transId)}">
					<div class="transaction-row" onclick="this.parentElement.classList.toggle('expanded')">
						<span class="rec-number">${recNumber}</span>
						<span class="rec-title">${title}</span>
						<span class="rec-stats ${amountClass}">${formatCurrency(amountValue)}</span>
						<span class="rec-type"><span class="badge ${badgeClass}">${escapeHtml(row.type ?? '')}</span></span>
						<span class="rec-date">${escapeHtml(date)}</span>
						<span class="rec-wallet">${wallet}</span>
						<span class="rec-actions">
							<button class="icon-btn edit-btn" type="button" data-action="edit" title="Edit">✎</button>
							<button class="icon-btn delete-btn" type="button" data-action="delete" title="Delete">🗑</button>
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
			// Guard against duplicate script execution / bindings
			if (window.__bbmUserInitDone) return;
			window.__bbmUserInitDone = true;

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

			const transactionForm = document.getElementById('transaction-form');
			if (transactionForm) {
<<<<<<< Updated upstream
=======
				if (transactionForm.dataset.bound === '1') return;
				transactionForm.dataset.bound = '1';

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
				const submitBtn = document.getElementById('transaction-submit-btn');
				let submitInFlight = false;

>>>>>>> Stashed changes
				transactionForm.addEventListener('submit', async function (e) {
					e.preventDefault();
					if (submitInFlight) return;

					const description = document.getElementById('trans-description')?.value?.trim() || '';
					const type = document.getElementById('trans-type')?.value?.trim() || '';
					const walletTypeRaw = document.getElementById('trans-wallet-type')?.value?.trim() || '';
					const walletOther = document.getElementById('trans-wallet-other')?.value?.trim() || '';
					const walletType =
						walletTypeRaw.toLowerCase() === 'other'
							? walletOther
							: walletTypeRaw;
					const amountStr = document.getElementById('trans-amount')?.value?.trim() || '';
					const transId = document.getElementById('trans-id')?.value?.trim() || '';
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
						return;
					}

					if (!isAuthenticated()) {
						closeTransactionModal();
						openLoginModal();
						return;
					}

					try {
						submitInFlight = true;
						if (submitBtn) {
							submitBtn.disabled = true;
							submitBtn.setAttribute('aria-disabled', 'true');
							submitBtn.textContent = transId ? 'SAVING…' : 'SAVING…';
						}

						const isEdit = Boolean(transId);
						const method = isEdit ? 'PUT' : 'POST';
						const res = await fetch('/api/transactions', {
							method,
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${getToken()}`
							},
							body: JSON.stringify({
								...(isEdit ? { trans_id: transId } : {}),
								description,
								type,
								wallet_type: walletType,
								amount
							})
						});

						const payload = await readResponsePayload(res);
						if (!res.ok) {
<<<<<<< Updated upstream
							console.error('Create transaction failed:', {
								status: res.status,
								payload: payload?.json ?? payload?.text,
								request: { description, type, wallet_type: walletType, amount }
							});
							throw new Error(getErrorMessage(payload, 'Failed to create transaction'));
=======
							console.error(`${isEdit ? 'Update' : 'Create'} transaction failed:`, {
								status: res.status,
								payload: payload?.json ?? payload?.text,
								request: { trans_id: transId || undefined, description, type, wallet_type: walletType, amount }
							});
							throw new Error(getErrorMessage(payload, isEdit ? 'Failed to update transaction' : 'Failed to create transaction'));
>>>>>>> Stashed changes
						}

						transactionForm.reset();
						const idEl = document.getElementById('trans-id');
						if (idEl) idEl.value = '';
						closeTransactionModal();
						await loadTransactions();
<<<<<<< Updated upstream
						showToast('Transaction saved', 'success');
=======
						showToast(isEdit ? 'Transaction updated' : 'Transaction saved', 'success');
>>>>>>> Stashed changes
					} catch (err) {
						if (messageDiv) {
							messageDiv.innerHTML = escapeHtml(err.message);
							messageDiv.className = 'message error';
						}
						console.error('Transaction submit error:', err);
					} finally {
						submitInFlight = false;
						const titleEl = document.getElementById('transaction-modal-title');
						const idVal = document.getElementById('trans-id')?.value?.trim() || '';
						if (submitBtn) {
							submitBtn.disabled = false;
							submitBtn.removeAttribute('aria-disabled');
							submitBtn.textContent = idVal ? 'SAVE CHANGES' : 'SAVE TRANSACTION';
						}
						if (titleEl && titleEl.textContent?.toLowerCase().includes('edit') && !idVal) {
							titleEl.textContent = 'New Transaction';
						}
					}
				});
			}

			// Event delegation for transaction list actions (no duplicate bindings on re-render)
			const listEl = document.getElementById('transaction-list-items');
			if (listEl && listEl.dataset.bound !== '1') {
				listEl.dataset.bound = '1';
				listEl.addEventListener('click', async (e) => {
					const btn = e.target?.closest?.('button[data-action]');
					if (!btn) return;
					e.preventDefault();
					e.stopPropagation();

					const action = btn.getAttribute('data-action');
					const item = btn.closest('.transaction-item');
					const transId = item?.getAttribute('data-trans-id') || '';
					if (!transId) return;

					if (!isAuthenticated()) {
						openLoginModal();
						return;
					}

					if (action === 'delete') {
						const ok = window.confirm('Are you sure you want to delete this transaction?');
						if (!ok) return;

						btn.disabled = true;
						try {
							const res = await fetch('/api/transactions', {
								method: 'DELETE',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${getToken()}`
								},
								body: JSON.stringify({ trans_id: transId })
							});
							const payload = await readResponsePayload(res);
							if (!res.ok) {
								console.error('Delete transaction failed:', {
									status: res.status,
									payload: payload?.json ?? payload?.text,
									trans_id: transId
								});
								throw new Error(getErrorMessage(payload, 'Failed to delete transaction'));
							}

							showToast('Transaction deleted', 'success');
							await loadTransactions();
						} catch (err) {
							showToast(err.message || 'Failed to delete transaction', 'error');
						} finally {
							btn.disabled = false;
						}
						return;
					}

					if (action === 'edit') {
						// Read values from the rendered row (best-effort) then open modal.
						const rowEl = item.querySelector('.transaction-row');
						const desc = rowEl?.querySelector?.('.rec-title')?.textContent?.trim() || '';
						const type = rowEl?.querySelector?.('.badge')?.textContent?.trim() || '';
						const wallet = rowEl?.querySelector?.('.rec-wallet')?.textContent?.trim() || '';
						const amtText = rowEl?.querySelector?.('.rec-stats')?.textContent || '';
						const amt = Number(String(amtText).replace(/[^\d.-]/g, ''));

						openEditTransactionModal({
							trans_id: transId,
							description: desc,
							type,
							wallet_type: wallet,
							amount: Number.isFinite(amt) ? amt : ''
						});
					}
				});
			}
		});