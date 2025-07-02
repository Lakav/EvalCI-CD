# Utiliser un runtime Node.js officiel comme image de base
FROM node:20 AS build

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copiez package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copiez le reste du code source de l'application dans le conteneur
COPY . .

# Créer l'application angular
RUN node_modules/.bin/ng build --configuration production

# Debug: Voir ce qui est généré dans dist
RUN ls -la /app/dist/
RUN find /app/dist -type f -name "index.html"

# Utiliser NGINX comme serveur de production
FROM nginx:alpine

# Copier les fichiers Angular buildés (avec vérification)
COPY --from=build /app/dist/abubakkar-apps/* /usr/share/nginx/html/

# Debug: Vérifier ce qui a été copié
RUN ls -la /usr/share/nginx/html/

# Supprimer la config par défaut et créer une nouvelle
RUN rm /etc/nginx/conf.d/default.conf
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    error_log /var/log/nginx/error.log; \
    access_log /var/log/nginx/access.log; \
}' > /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]