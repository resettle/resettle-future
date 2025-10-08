'use client'

import * as PortalPrimitive from '@radix-ui/react-portal'
import * as React from 'react'

interface PortalNode {
  id: string
  node: React.ReactElement
}

interface PortalContextValue {
  nodes: PortalNode[]
  createNode: (node: React.ReactElement) => () => void
  removeNode: (nodeId: string) => void
}

const PortalContext = React.createContext<PortalContextValue | null>(null)

interface PortalProviderProps {
  children: React.ReactNode
}

/**
 * A provider that provides a portal context to its children.
 *
 * @param children - The children to render.
 * @returns The portal provider.
 */
export function PortalProvider({ children }: PortalProviderProps) {
  const [nodes, setNodes] = React.useState<PortalNode[]>([])

  const createNode = React.useCallback((node: React.ReactElement) => {
    const nodeId = Date.now().toString()

    setNodes(prev => [...prev, { id: nodeId, node }])

    return () => {
      setNodes(prev => prev.filter(n => n.id !== nodeId))
    }
  }, [])

  const removeNode = React.useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
  }, [])

  const value = React.useMemo(
    () => ({
      nodes,
      createNode,
      removeNode,
    }),
    [nodes, createNode, removeNode],
  )

  const sortedNodes = React.useMemo(() => {
    return nodes
      .sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }))
      .map(({ id, node }) => {
        if (React.isValidElement(node) && node.type === PortalPrimitive.Root) {
          return React.cloneElement(node, { key: id })
        }

        return (
          <PortalPrimitive.Root key={id} asChild>
            {node}
          </PortalPrimitive.Root>
        )
      })
  }, [nodes])

  return (
    <PortalContext.Provider value={value}>
      {children}
      {sortedNodes}
    </PortalContext.Provider>
  )
}

/**
 * A hook that returns the portal context.
 *
 * @returns The portal context.
 */
export const usePortal = () => {
  const context = React.useContext(PortalContext)

  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider')
  }

  return context
}

/**
 * A wrapper component that provides a portal context to its children.
 *
 * @param Component - The component to wrap.
 * @returns The wrapped component.
 */
export const withPortal = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: P) => {
    return <PortalProvider>{<Component {...props} />}</PortalProvider>
  }
}
