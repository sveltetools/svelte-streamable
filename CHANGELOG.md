# svelte-streamable changelog

## 2.0.0

* (breaking change): now `streamable` store is always contain `Promise` to control different async statuses.
* (breaking change): `streamable` store initially have `pending` status if `defaultValue` is not provided.

## 1.1.0

* Call callback with `undefined` data on int.
* Fallback to default value every time when result data is `undefined`.
* Remove superfluous logging and event listeners.
* Few improvements in README.
* Improved types.

## 1.0.0

* First release
