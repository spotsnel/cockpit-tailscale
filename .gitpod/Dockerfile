FROM --platform=linux/amd64 ghcr.io/gbraad-devenv/fedora/base:38

USER root

# Add gitpod user with the expected ID (automated setup does not work atm)
RUN useradd -l -u 33333 -G wheel -md /home/gitpod -s /usr/bin/zsh -p gitpod gitpod

RUN dnf install -y \
        docker \
        cockpit \
        passwd \
        make \
        npm \
        rpm-build \
    && dnf clean all \
    && rm -rf /var/cache/yum

USER gitpod
