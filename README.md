Cockpit application to manage Tailscale
=======================================

!["Prompt"](https://raw.githubusercontent.com/gbraad/assets/gh-pages/icons/prompt-icon-64.png)


A Cockpit application to manage Tailscale 

![Screenshot](./docs/screenshot.png)



Development
-----------

This repo story includes deployment scripts for the Cocpit Tailscale development environment.
The easiest to get started is by using the following cloud development environments:

  * Open in [Gitpod workspace](https://gitpod.io/#https://github.com/spotsnel/cockpit-tailscale)
  * Open in [CodeSandbox](https://codesandbox.io/p/github/spotsnel/cockpit-tailscale)

or you can either use a local `devsys`/`almsys`, like published here:

  * https://github.com/gbraad-devenv/fedora
  * https://github.com/gbraad-devenv/almalinux



### Preparation

Install the following packages to develop and build:

```
$ sudo dnf install -y make npm
```

and to make the RPM you need:

```
$ sudo dnf install -y rpm-build gettext libappstream-glib
```


#### Cockpit user

If you want to run cockpit, you need a user with a password:

```
$ sudo dnf install -y passwd
$ sudo passwd gbraad
```

After which you can use this user to log in to Cockpit.


### Build

To perform a development build:
```
$ npm run dev
````

To perform a production build:
```
$ npm run build
```

For the RPM package:
```
$ npm run rpm
```


### Cockpit

After the build, copy contents to `/usr/share/cockpit/tailscale`, `/usr/share/local/cockpit/tailscale` or `~/.local/share/cockpit/tailscale`.

#### Link development

For convenience, you can also create a symlink to `~/.local/share/cockpit/tailscale` to `$PWD/dist`. However, you will need to logout/login because Cockpit caches the page and assets.

To create a link:
```
$ npm run link
```

And to remove:
```
$ npm run unlink
```

#### Run Cockpit
You can run Cockpit in a container or remote development environment with the following command:
```
$ npm run cockpit
```

You will need to use an account with a password to log in.


### Tailscale systemd image

For example, on an instance of [spotsnel/tailscale-systemd](https://github.com/spotsnel/tailscale-systemd):
```
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
```
[Socket]
ListenStream=
ListenStream=127.0.0.1:9090
FreeBind=yes
```

```
# tailscale serve tcp:9090 tcp://localhost:9090
# systemctl daemon-reload
# systemctl restart cockpit.socket
```


Authors
-------

| [!["Gerard Braad"](http://gravatar.com/avatar/e466994eea3c2a1672564e45aca844d0.png?s=60)](http://gbraad.nl "Gerard Braad <me@gbraad.nl>") |
|---|
| [@gbraad](https://gbraad.nl/social)  |
