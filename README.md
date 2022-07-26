# Super tiny, simple to use SvelteJS store for real-time updates from server via SSE.

[![NPM version](https://img.shields.io/npm/v/svelte-streamable.svg?style=flat)](https://www.npmjs.com/package/svelte-streamable) [![NPM downloads](https://img.shields.io/npm/dm/svelte-streamable.svg?style=flat)](https://www.npmjs.com/package/svelte-streamable)


## Install

```bash
npm i svelte-streamable --save-dev
```

```bash
yarn add svelte-streamable
```

CDN: [UNPKG](https://unpkg.com/svelte-streamable/) | [jsDelivr](https://cdn.jsdelivr.net/npm/svelte-streamable/) (available as `window.Streamable`)

If you are **not** using ES6, instead of importing add 

```html
<script src="/path/to/svelte-streamable/index.js"></script>
```

just before closing body tag.

## Usage

### Store for any server updates in JSON format

Just provide Server-sent event endpoint as `url` property in config object.

```javascript
import { streamable } from 'svelte-streamable';

const updatesAsync = streamable({
  url: 'http://xxx.xxx.xxx:xxx/updates'
});
```

### Store for specific server event and allow credentials if needed:

Just provide event name as `event` and `withCredentials` properties in config object.

```javascript
import { streamable } from 'svelte-streamable';

const postsAsync = streamable({
  url: 'http://xxx.xxx.xxx:xxx/updates',
  event: 'posts',
  withCredentials: true,
});
```

### Pre-process recieved data with custom logic:

Just provide callback handler as second argument of `streamable` constructor and return the value:

```javascript
import { streamable } from 'svelte-streamable';

const postsAsync = streamable({
  url: 'http://xxx.xxx.xxx:xxx/updates',
  event: 'posts'
}, ($posts) => {
  return $posts.reduce(...);
});
```

### Asynchronous callback with cleanup logic:

This sematic formly looks like Svelte's [derived](https://svelte.dev/docs#derived) store:

```javascript
import { streamable } from 'svelte-streamable';

const postsAsync = streamable({
  url: 'http://xxx.xxx.xxx:xxx/updates',
  event: 'posts'
}, ($posts, set) => {

  // some async logic

	setTimeout(() => {
	  set($posts);
	}, 1000);

	return (lastSubscriber) => {
		// cleanup logic
    console.log(lastSubscriber ?  'no more subscribers' : 'new update cleanup');
	};
});
```

### Get value in `raw` format instead of `json` (default) with custom preprocessing:

```javascript
import { streamable } from 'svelte-streamable';

const csvAsync = streamable({
  url: 'http://xxx.xxx.xxx:xxx/updates',
  event: 'csv',
  format: 'raw',
}, ($csv) => {
  return CSVToArray($csv);
});
```

### Using with `svelte-asyncable`

Streamable store contains a Promise to control async statuses (pending, fullfilled, rejected). To use the data in synchronous-way, you can use `syncable` store from  [svelte-asyncable](https://www.npmjs.com/package/svelte-asyncable) package:


```javascript
import { streamable } from 'svelte-streamable';
import { syncable } from 'svelte-asyncable';

const postsAsync = streamable(...); // contains Promise
const posts = syncable(postsAsync, []); // contains value
```

## License

MIT &copy; [PaulMaly](https://github.com/PaulMaly)
