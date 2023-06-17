FROM --platform=linux/amd64 ghcr.io/gbraad-devenv/fedora/base:38

USER root

RUN dnf install -y \
        docker cockpit \
        make npm \
    && dnf clean all \
    && rm -rf /var/cache/yum

RUN npm install -g yarn

USER gbraad

RUN git clone https://github.com/gbraad/dotfiles ~/.dotfiles \
    && ~/.dotfiles/install.sh
