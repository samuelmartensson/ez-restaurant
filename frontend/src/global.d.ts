declare global {
  interface Window {
    dataLayer?: object[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
}
export {};
