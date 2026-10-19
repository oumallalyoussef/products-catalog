# Utilisation de l'IA (Claude / Claude Code)

J'ai utilisé Claude, principalement via Claude Code, comme assistant tout au long du projet.
Les décisions de conception et les choix de code final restent les miens.

## 1. Ce que j'ai demandé à Claude

### Tâches déléguées
- **Jeu de données des produits** : je lui ai fourni le schéma d'un produit (`id`, `name`,
  `category`, `price`, `stock_status`) et je lui ai demandé de générer un jeu de données
  réaliste. Il se trouve dans `backend/src/products/repositories/products.data.ts`.
- **Tests** : je lui ai demandé de générer les tests, unitaires (`products.service.spec.ts`,
  `in-memory-cache.service.spec.ts`) et end-to-end (`products.e2e-spec.ts`).

### Problèmes que je cherchais à résoudre
- Remplir l'API avec assez de données variées pour que la pagination et les filtres soient
  réellement testables, sans écrire 30 produits à la main.
- Couvrir les cas limites avec des tests (pagination, filtres, cache, validation) pour
  vérifier le comportement attendu par l'énoncé.

## 2. Comment j'ai utilisé les suggestions de Claude

### Adopté directement
- Le jeu de données généré (30 produits, plusieurs catégories et statuts de stock).

### Adapté ou modifié
- Les tests générés.
- j'ai demandé à claude de m'optimiser du code , mais des fois j'ai dû rester sur mon code, car pour moi il est plus propre.

## 3. Ce que j'ai rejeté, et pourquoi

### Écriture du filtre dans `ProductsService`
Claude m'a proposé une version compacte, avec une seule expression booléenne :

```ts
.filter(
  (product) =>
    (!query.category || product.category === query.category) &&
    (!query.stock_status || product.stock_status === query.stock_status),
)
```

J'ai gardé ma propre version, avec des `if` explicites et des retours anticipés :

```ts
private filter(query: GetProductsQueryDto): Product[] {
  return this.productsRepository.findAll().filter((product) => {
    if (query.category && product.category !== query.category) {
      return false;
    }
    if (query.stock_status && product.stock_status !== query.stock_status) {
      return false;
    }
    return true;
  });
}
```

**Ma logique de décision** : les deux versions font exactement la même chose. La mienne est plus
lisible : chaque filtre est traité séparément, on voit tout de suite quelle condition exclut un
produit, et ajouter un nouveau filtre revient à ajouter un bloc `if`. La version compacte est plus
courte, mais il faut raisonner sur la logique de `!a || b` pour la comprendre. Pour un code relu
et maintenu par d'autres, j'ai préféré la lisibilité à la concision.
