import { readable } from 'svelte/store';

const esx = {};

export function streamable(
	{ url, event = 'message', format = 'json', ...options },
	callback,
	defaultValue
) {
	const auto = !callback || callback.length < 2;
	const initial = defaultValue ? Promise.resolve(defaultValue) : new Promise(noop);
	return readable(initial, (set) => {
		let cleanup = noop;

		function resolve(value) {
			set(typeof value !== 'undefined' ? Promise.resolve(value) : initial);
		}

		function update(e) {
			cleanup(false);

			let data;

			if (e && e.data) {
				if (format === 'json') {
					data = JSON.parse(e.data);
				} else if (format === 'base64') {
					data = atob(e.data);
				} else if (format === 'urlencoded') {
					data = Object.fromEntries(new URLSearchParams(e.data));
				} else {
					data = e.data;
				}
			}

			const result = callback ? callback(data, resolve) : data;

			if (auto) {
				resolve(result);
			} else {
				cleanup = typeof result === 'function' ? result : noop;
			}
		}

		function error(e) {
			set(Promise.reject(e));
		}

		const keypath = Object.entries(options).sort().reduce((k, [_, v]) => `${k}/${v}`, url);

		let es = esx[keypath];

		if (!es) {
			es = new EventSource(url, options);
			es.subscribers = 0;
			esx[keypath] = es;
		}

		es.addEventListener('error', error);
		es.addEventListener(event, update);

		callback && setTimeout(update);

		es.subscribers++;

		return () => {
			es.removeEventListener('error', error);
			es.removeEventListener(event, update);

			if (!--es.subscribers) {
				es.close();
				delete esx[keypath];
			}

			cleanup(true);
		};
	});
}

function noop() {}
