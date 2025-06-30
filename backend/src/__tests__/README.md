# Tests Unitaires et d'Intégration pour le Backend

Ce dossier contient les tests unitaires et d'intégration pour le backend de l'application.

## Structure des Tests

Les tests sont organisés comme suit :

- `task.controller.test.ts` : Tests unitaires pour le contrôleur des tâches
- `user.controller.test.ts` : Tests unitaires pour le contrôleur des utilisateurs
- `task.model.test.ts` : Tests unitaires pour le modèle des tâches
- `user.model.test.ts` : Tests unitaires pour le modèle des utilisateurs
- `integration.test.ts` : Tests d'intégration pour les API

## Approche de Test

### Tests Unitaires

Les tests unitaires utilisent Jest comme framework de test et se concentrent sur le test des fonctions individuelles des contrôleurs et des modèles. Nous utilisons des mocks pour simuler les dépendances externes comme la base de données et les bibliothèques de cryptographie.

### Tests d'Intégration

Les tests d'intégration utilisent Supertest avec Jest pour tester les routes API de bout en bout. Ces tests vérifient que les différentes parties de l'application fonctionnent correctement ensemble.

## Exécution des Tests

Pour exécuter tous les tests :

```bash
npm test
```

Pour exécuter les tests avec le mode watch (utile pendant le développement) :

```bash
npm run test:watch
```

Pour générer un rapport de couverture de code :

```bash
npm run test:coverage
```

## Bonnes Pratiques

1. **Isolation** : Chaque test doit être isolé et ne pas dépendre d'autres tests.
2. **Mocking** : Utilisez des mocks pour simuler les dépendances externes.
3. **Assertions** : Faites des assertions claires et précises.
4. **Couverture** : Visez une couverture de code élevée, mais privilégiez la qualité des tests à la quantité.
5. **Maintenance** : Maintenez vos tests à jour avec le code de l'application.

## Intégration CI/CD

Ces tests sont intégrés dans le pipeline CI/CD et sont exécutés automatiquement à chaque push ou pull request. Un build échouera si les tests ne passent pas, assurant ainsi la qualité du code.
