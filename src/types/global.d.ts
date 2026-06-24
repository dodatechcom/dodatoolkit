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
    }
  }
}
