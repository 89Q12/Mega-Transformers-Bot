/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  /**
   * Temporary workaround for not having a guild
   * selection screen.
   */
  readonly VITE_DISCORD_OAUTH_CLIENT_ID: string;
  readonly VITE_DISCORD_CALLBACK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
