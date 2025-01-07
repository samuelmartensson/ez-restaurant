"use client";
import Script from "next/script";

type GAParams = {
  gaId: string;
  domain: string;
  dataLayerName?: string;
  debugMode?: boolean;
  nonce?: string;
};

let currDataLayerName: string | undefined = undefined;

export function GoogleAnalytics(props: GAParams) {
  const { gaId, dataLayerName = "dataLayer", nonce } = props;

  if (currDataLayerName === undefined) {
    currDataLayerName = dataLayerName;
  }

  return (
    <>
      <Script
        id="_next-ga-init"
        dangerouslySetInnerHTML={{
          __html: `
          window['${dataLayerName}'] = window['${dataLayerName}'] || [];
          function gtag(){window['${dataLayerName}'].push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}', { domain: '${props.domain}' });`,
        }}
        nonce={nonce}
      />
      <Script
        id="_next-ga"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        nonce={nonce}
      />
    </>
  );
}
