import { readable } from 'svelte/store';

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

		const es = new EventSource(url, options);

		es.addEventListener('error', error);
		es.addEventListener(event, update);

		callback && setTimeout(update);

		return () => {
			es.removeEventListener('error', error);
			es.removeEventListener(event, update);
			es.close();
			cleanup(true);
		};
	});
}

function noop() {}
