# Partir de l'image officielle de PostgreSQL
FROM postgres:latest

# Copie du script d'initialisation
COPY init-scripts/init.sql /docker-entrypoint-initdb.d/
