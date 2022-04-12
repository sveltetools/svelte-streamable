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
		let result;

		function resolve(value) {
			set(typeof value !== 'undefined' ? Promise.resolve(value) : initial);
		}

		function update(e) {
			cleanup();

			let data;

			if (e) {
				data = format === 'json' ? JSON.parse(e.data) : e.data;
			}

			result = callback ? callback(data, resolve) : data;

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
			cleanup();
		};
	});
}

function noop() {}
