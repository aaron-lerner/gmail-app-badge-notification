(() => {
	let unreadCount;

	function getUnreadCount(doc) {
		if (!doc) {
			return -1;
		}
		const fullcountElement = doc.querySelector('fullcount');
		if (!fullcountElement) {
			return -1;
		}
		const count = parseInt(fullcountElement.textContent);
		if (isNaN(count)) {
			return -1;
		}
		return count;
	}

	async function getDocumentFeed() {
		return fetch(`https://mail.google.com/mail/feed/atom?_=${new Date().getTime()}`, {
			headers: {
				'Cache-Control': 'no-cache'
			}
		})
		.then(response => response.text())
		.then(text => new window.DOMParser().parseFromString(text, "text/xml"));
	}

	async function updateBadgeIcon() {
		const feed = await getDocumentFeed();
		const newUnreadCount = getUnreadCount(feed);
		if (newUnreadCount < 0) {
			return;
		}
		if (newUnreadCount !== unreadCount) {
			unreadCount = newUnreadCount
			navigator.setAppBadge(unreadCount);
		}
	}

	setInterval(updateBadgeIcon, 1000);
})();
