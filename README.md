Cockpit application to manage Tailscale
=======================================

!["Prompt"](https://raw.githubusercontent.com/gbraad/assets/gh-pages/icons/prompt-icon-64.png)


A Cockpit application to manage Tailscale 

![Screenshot](./docs/screenshot.png)



Development
-----------

This repository includes deployment scripts for the Cocpit Tailscale development environment.
The easiest to get started is by using the following cloud development environments:

  * Open in [Gitpod workspace](https://gitpod.io/#https://github.com/spotsnel/cockpit-tailscale)
  * Open in [CodeSandbox](https://codesandbox.io/p/github/spotsnel/cockpit-tailscale)

or you can either use a local `devsys`/`almsys`, as published here:

  * https://github.com/gbraad-devenv/fedora
  * https://github.com/gbraad-devenv/almalinux



### Preparation

Install the following packages to develop and build:

```bash
$ sudo dnf install -y make npm
```

and to make the RPM you need:

```bash
$ sudo dnf install -y rpm-build gettext libappstream-glib
```


#### Cockpit user

If you want to run Cockpit, you need a user with a password:

```bash
$ sudo dnf install -y passwd
$ sudo passwd gbraad
```

After which you can use this user to log in to Cockpit.


### Build

To perform a development build:
```bash
$ npm run dev
````

To perform a production build:
```bash
$ npm run build
```

For the RPM package:
```bash
$ npm run rpm
```


### Cockpit

After the build, copy contents to `/usr/share/cockpit/tailscale`, `/usr/share/local/cockpit/tailscale` or `~/.local/share/cockpit/tailscale`.

#### Link development

For convenience, you can also create a symlink to `~/.local/share/cockpit/tailscale` to `$PWD/dist`. However, you will need to log out and log in because Cockpit caches the page and assets.

To create a link:

```bash
$ npm run link
```

And to remove:

```bash
$ npm run unlink
```

Note: this only works when the current user also logs in. Otherwise, use the tasks
`linkusr` and `unlinkusr` which uses `sudo` to create the link in `/usr/local/share/cockpit`.


#### Run Cockpit

You can run Cockpit in a container or remote development environment with the following command:

```bash
$ npm run cockpit
```

You will need to use an account with a password to log in.


#### Origins

If the login fails and you see `bad Origin` errors, you need to modify the `/etc/cockpit/cockpit.conf` file and add something like:

```ini
[WebService]
Origins=https://jqgnyj-9090.csb.app
```

The example shows CodeSandbox. For Gitpod this might look like this:
```ini
[WebService]
Origins=https://9090-spotsnel-cockpittailsca-57e5sbbb0zb.ws-us100.gitpod.io
```


### Tailscale systemd image
You can run this as part of [spotsnel/tailscale-systemd](https://github.com/spotsnel/tailscale-systemd) container image to deploy this inside a Podman machine or similar:
```bash
$ tailscale ssh podmandesktop / podman exec -it tailscale-system bash
# dnf install -y cockpit passwd
# systemctl enable --now cockpit.socket
# curl -L https://github.com/spotsnel/cockpit-tailscale/releases/download/v0.0.1/cockpit-tailscale-v0.0.1.tar.gz -o dist.tar.gz
# tar zxvf dist.tar.gz 
# mkdir /usr/local/share/cockpit
# mv dist /usr/local/share/cockpit/tailscale
# passwd root
# tailscale up --ssh
```

Now you can access the remote cockpit from another host by 'add new host'.
Note: remote hosts get authenticated over SSH. If you have conflicts, like on WSL, you can serve on `localhost` instead.

`/etc/systemd/system/cockpit.socket.d/listen.conf`
```ini
[Socket]
ListenStream=
ListenStream=127.0.0.1:9090
FreeBind=yes
```

Note: the blank `ListenStream` is intentional as it resets the parameter.

Now set up the forward from the Tailscale client to open port `9090`:

```bash
# tailscale serve tcp:9090 tcp://localhost:9090
# systemctl daemon-reload
# systemctl restart cockpit.socket
```

Now you can navigate to the Tailscale IP:
```
# tailscale ip -4
100.113.113.114
```

Open https://100.113.113.114:9090.


Authors
-------

| [!["Gerard Braad"](http://gravatar.com/avatar/e466994eea3c2a1672564e45aca844d0.png?s=60)](http://gbraad.nl "Gerard Braad <me@gbraad.nl>") |
|---|
| [@gbraad](https://gbraad.nl/social)  |
