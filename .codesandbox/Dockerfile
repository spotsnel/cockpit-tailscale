FROM --platform=linux/amd64 ghcr.io/gbraad-devenv/fedora/base:38

USER root

RUN dnf install -y \
        docker \
        cockpit \
        passwd \
        make \
        npm \
        rpm-build \
    && dnf clean all \
    && rm -rf /var/cache/yum

RUN npm install -g yarn

COPY .codesandbox/tailscaled /etc/init.d/taiscaled

USER gbraad

RUN git clone https://github.com/gbraad/dotfiles ~/.dotfiles \
    && ~/.dotfiles/install.sh
