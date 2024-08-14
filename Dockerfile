FROM node:lts-buster

# Installer les dépendances nécessaires
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp \
  build-essential \
  curl \
  libssl-dev \
  zlib1g-dev \
  libbz2-dev \
  libreadline-dev \
  libsqlite3-dev \
  wget \
  llvm \
  libncurses5-dev \
  libncursesw5-dev \
  xz-utils \
  tk-dev \
  libffi-dev \
  liblzma-dev \
  python3-openssl \
  git && \
  apt-get upgrade -y && \
  npm i pm2 -g && \
  rm -rf /var/lib/apt/lists/*

# Installer pyenv
RUN curl https://pyenv.run | bash

# Ajouter pyenv au PATH et installer Python 3.8
ENV HOME /root
ENV PYENV_ROOT $HOME/.pyenv
ENV PATH $PYENV_ROOT/bin:$PATH
RUN /bin/bash -c "source $HOME/.bashrc && pyenv install 3.8.12 && pyenv global 3.8.12"

# Installer pip
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
  python3.8 get-pip.py && \
  rm get-pip.py

# Cloner le dépôt
RUN git clone https://github.com/nignanfatao1/Zyy /root/my_zyy_app
WORKDIR /root/my_zyy_app/

# Copier et installer les dépendances
COPY package.json .
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 8000

# Démarrer l'application avec PM2
CMD ["npm", "run", "web"]
