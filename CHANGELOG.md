# CHANGELOG

## v1.8.0

-   add `resp.ok` - same as WHATWG fetch `resp.ok = (resp.statusCode >= 200 && resp.statusCode < 300)`
-   add `resp.stream.body()` to populate `resp.body` rather than (or perhaps in addition to) continuing to stream (useful for error handling)
