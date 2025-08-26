import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import React from 'react'

export const Route = createRootRoute({
  component: () => (
<>
      <nav className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">SATEM</Link>
        <Link to="/landing" className="[&.active]:font-bold">My Data Vault</Link>
      </nav>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})