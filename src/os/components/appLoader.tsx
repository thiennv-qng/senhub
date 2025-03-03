import { Suspense, forwardRef, cloneElement } from 'react'
import { useRemoteModule } from 'react-dynamic-remote-component'
import { RemoteModule } from 'react-dynamic-remote-component/dist/types/types'

import { Skeleton, Spin } from 'antd'
import ErrorBoundary from 'os/components/errorBoundary'

/**
 * Remote Static
 */
type StaticType = 'logo' | 'panel' | 'readme'

export const RemoteStatic = forwardRef<
  HTMLElement,
  {
    type?: StaticType
    manifest: RemoteModule
    render: (src: string) => JSX.Element
  }
>(({ type = 'default', manifest, render }, ref) => {
  const { [type]: src } = useRemoteModule(manifest)
  return cloneElement(render(src), ref ? { ref } : {})
})

/**
 * Static Loader
 */
export const StaticLoader = forwardRef<
  HTMLElement,
  {
    type: StaticType
    render: (url: string) => JSX.Element
  } & ComponentManifest
>(({ type, url, appId, render }, ref) => {
  const manifest = { url, scope: appId, module: './static' }
  return (
    <ErrorBoundary remoteUrl={url || 'Unknown'}>
      <Suspense fallback={<Spin size="small" />}>
        <RemoteStatic
          type={type}
          manifest={manifest}
          render={render}
          ref={ref}
        />
      </Suspense>
    </ErrorBoundary>
  )
})

/**
 * Remote component
 */
const RemoteComponent = forwardRef<HTMLElement, { manifest: RemoteModule }>(
  ({ manifest, ...props }, ref) => {
    const { default: Component } = useRemoteModule(manifest)
    return <Component {...props} ref={ref} />
  },
)

/**
 * Page Loader
 */
export const PageLoader = forwardRef<HTMLElement, ComponentManifest>(
  ({ url, appId, ...props }, ref) => {
    const manifest = { url, scope: appId, module: './page' }
    return (
      <ErrorBoundary remoteUrl={url || 'Unknown'}>
        <Suspense fallback={<Skeleton active />}>
          <RemoteComponent manifest={manifest} {...props} ref={ref} />
        </Suspense>
      </ErrorBoundary>
    )
  },
)
