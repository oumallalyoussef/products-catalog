import { Pagination } from './components/Pagination';
import { ProductFilters } from './components/ProductFilters';
import { ProductList } from './components/ProductList';
import { StatusMessage } from './components/StatusMessage';
import { useProducts } from './hooks/useProducts';

function App() {
  const {
    filters,
    products,
    isLoading,
    error,
    setPage,
    setCategory,
    setStockStatus,
  } = useProducts();

  return (
    <main className="app">
      <header className="app__header">
        <h1>Produits</h1>
        {products && <p className="app__count">{products.total} résultat(s)</p>}
      </header>

      <ProductFilters
        category={filters.category}
        stockStatus={filters.stock_status}
        onCategoryChange={setCategory}
        onStockStatusChange={setStockStatus}
      />

      <section aria-busy={isLoading}>
        {error && <StatusMessage variant="error" message={error} />}
        {!error && !products && (
          <StatusMessage variant="loading" message="Chargement des produits…" />
        )}
        {!error && products && products.data.length === 0 && (
          <StatusMessage
            variant="empty"
            message="Aucun produit ne correspond à ces filtres."
          />
        )}
        {!error && products && products.data.length > 0 && (
          <ProductList products={products.data} isRefreshing={isLoading} />
        )}
      </section>

      {products && (
        <Pagination
          page={products.page}
          totalPages={products.totalPages}
          onPageChange={setPage}
        />
      )}
    </main>
  );
}

export default App;
