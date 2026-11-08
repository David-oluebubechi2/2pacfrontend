import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { OrdersProvider } from './context/OrdersContext'
import { WishlistProvider } from './context/WishlistContext'
import { ProductsProvider } from './context/ProductsContext'
import { CategoriesProvider } from './context/CategoriesContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <CategoriesProvider>
          <AuthProvider>
            <WishlistProvider>
              <ToastProvider>
                <OrdersProvider>
                  <CartProvider>
                    <App />
                  </CartProvider>
                </OrdersProvider>
              </ToastProvider>
            </WishlistProvider>
          </AuthProvider>
        </CategoriesProvider>
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>,
)
