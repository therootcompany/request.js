# Extra

There are some niche features of @root/request which are beyond the request.js
compatibility.

## async/await & Promises

The differences in async support are explained in [README.md](/README.md), up near the top.

If you're familiar with Promises (and async/await), then it's pretty self-explanatory.

## ok

Just like WHATWG `fetch`, we have `resp.ok`:

```js
let resp = await request({
    url: 'https://example.com'
}).then(mustOk);
```

```js
function mustOk(resp) {
    if (!resp.ok) {
        // handle error
        throw new Error('BAD RESPONSE');
    }
    return resp;
}
```

## streams

The differences in stream support are explained in [README.md](/README.md), up near the top.

## userAgent

There's a default User-Agent string describing the version of @root/request, node.js, and the OS.

Add to the default User-Agent

```js
request({
    // ...
    userAgent: 'my-package/1.0' // add to agent
});
```

Replace the default User-Agent

```js
request({
    // ...
    headers: { 'User-Agent': 'replace/0.0' }
});
```

Disable the default User-Agent:

```js
request({
    // ...
    headers: { 'User-Agent': false }
});
```
