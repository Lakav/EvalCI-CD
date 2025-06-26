# Partir de l'image officielle de PostgreSQL
FROM postgres:latest

# Variables d'environnement
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=root
ENV POSTGRES_DB=todoapp

# Copie du script d'initialisation
COPY init-scripts/init.sql /docker-entrypoint-initdb.d/
