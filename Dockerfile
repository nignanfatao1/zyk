FROM node:lts-buster

# Ajouter le dépôt de deadsnakes et installer les dépendances nécessaires
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get install -y software-properties-common && \
  add-apt-repository ppa:deadsnakes/ppa && \
  apt-get update && \
  apt-get install -y \
  python3.8 \
  python3.8-dev \
  python3.8-distutils && \
  ln -s /usr/bin/python3.8 /usr/bin/python && \
  curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
  python3.8 get-pip.py && \
  rm get-pip.py && \
  apt-get upgrade -y && \
  npm i pm2 -g && \
  rm -rf /var/lib/apt/lists/*

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
