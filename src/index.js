import { readable } from 'svelte/store';

export function streamable({ url, event, format = 'json', ...options }, callback, defaultValue) {
	const auto = !callback || callback.length < 2;

	return readable(defaultValue, (set) => {
		let cleanup = noop;
		let result;

		function update(e) {
			cleanup();

			let data;

			if (e) {
				data = format === 'json' ? JSON.parse(e.data) : e.data;
			}

			result = callback ? callback(data, set) : data;

			if (auto) {
				set(typeof result !== 'undefined' ? result : defaultValue);
			} else {
				cleanup = typeof result === 'function' ? result : noop;
			}
		}

		function error(e) {
			if (e.target.readyState == EventSource.CONNECTING) {
				console.log(`Reconnecting (readyState=${e.target.readyState})...`);
			}
		}

		const es = new EventSource(url, options);

		es.addEventListener('error', error);

		if (event) {
			es.addEventListener(event, update);
		} else {
			es.addEventListener('message', update);
		}

		update();

		return () => {
			es.removeEventListener('error', error);
			es.removeEventListener('message', update);
			es.removeEventListener(event, update);
			es.close();
			cleanup();
		};
	});
}

function noop() {}
