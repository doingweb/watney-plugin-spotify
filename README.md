Watney Spotify Plugin
================================

[![Build Status](https://travis-ci.org/doingweb/watney-plugin-spotify.svg?branch=master)](https://travis-ci.org/doingweb/watney-plugin-spotify)

A Watney plugin for Spotify. Basically a wrapper around the excellent [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node).

**Note**: Experimental API. May go though some pretty wild changes before 1.x, as we figure out which ideas are good and which are really really bad.

Getting Started
---------------

Go to https://developer.spotify.com/dashboard/applications and register your Watney app. Save your Client ID and Client Secret in your Watney config:

```yaml
spotify:
  clientId: 12345678901234567890123456789012
  clientSecret: 12345678901234567890123456789012
```

Add a Redirect URI of "https://watney.local/auth/", so we can complete the OAuth flow.

TODO: Configuring and auth for user(s).

Usage
-----

```js
let spotify = app.plugins.get('spotify');

// TODO: Usage example.
```

TODO
----

