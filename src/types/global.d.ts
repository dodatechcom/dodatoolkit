export {}

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => Promise<void>
      maximize: () => Promise<void>
      close: () => Promise<void>
      saveFile: (options: {
        defaultName: string
        filters: { name: string; extensions: string[] }[]
        data: string
      }) => Promise<string | null>
      openExternal: (url: string) => Promise<void>
      fetchUrlMetadata?: (url: string) => Promise<{
        title?: string
        description?: string
        image?: string
        siteName?: string
        url?: string
        error?: string
      }>
    }
  }
}
