# Commandes utiles pour construire et exécuter le conteneur PostgreSQL

### 🐳 Build du `Dockerfile`
```bash
docker build -t postgres-custom .
````

### 🚀 Lancement du conteneur créé

```bash
docker run -d -p 5432:5432 --name postgres-custom postgres-custom
```

### 🔍 Accéder à la CLI de Postgres pour exécuter des commandes

```bash
docker exec -it postgres-custom psql -U root -d todoapp
```
