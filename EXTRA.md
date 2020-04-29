# Extra

There are some niche features of @root/request which are beyond the request.js
compatibility.

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
