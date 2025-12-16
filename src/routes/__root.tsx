import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import React from 'react'

export const Route = createRootRoute({  
  component: () => (
<>
      <nav className="flex">
        <Link to="/" className="[&.active]"/>
      </nav>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})