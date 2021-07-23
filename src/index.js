import { readable } from 'svelte/store';

export function streamable({ url, event, format = 'json', ...options }, callback, initialValue) {
	const auto = !callback || callback.length < 2;

	return readable(initialValue, (set) => {
		let cleanup = noop;
		let result;

		function update(e) {
			cleanup();

			if (e) {
				const data = format === 'json' ? JSON.parse(e.data) : e.data;
				result = callback ? callback(data, set) : data;
			}

			if (auto) {
				set(result);
			} else {
				cleanup = typeof result === 'function' ? result : noop;
			}
		}

		function error(e) {
			if (e.target.readyState == EventSource.CONNECTING) {
				console.log(`Reconnecting (readyState=${e.target.readyState})...`);
			}
		}

		function open(e) {
			console.log('streamable open', e);
		}

		const es = new EventSource(url, options);

		es.addEventListener('open', open);
		es.addEventListener('error', error);

		if (event) {
			es.addEventListener(event, update);
		} else {
			es.addEventListener('message', update);
		}

		update();

		return () => {
			es.removeEventListener('open', open);
			es.removeEventListener('error', error);
			es.removeEventListener('message', update);
			es.removeEventListener(event, update);
			es.close();
			cleanup();
		};
	});
}

function noop() {}
