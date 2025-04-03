/* eslint-disable @next/next/no-img-element */

const BrandLogo = (props: React.ButtonHTMLAttributes<HTMLImageElement>) => {
  return <img src="/logo.svg" {...props} alt="ezrest melon" />;
};

export default BrandLogo;
