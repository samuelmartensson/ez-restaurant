import { SVGProps } from "react";

const BrandLogo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 80">
      <defs>
        <style type="text/css">
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
        </style>
      </defs>
      <text
        x="0"
        y="65"
        fontFamily="Poppins, Arial, sans-serif"
        fontSize="75"
        fontWeight="bold"
        fill="#3f72ff"
        style={{ fontStyle: "italic" }}
      >
        EZ
      </text>
      <text
        x="84"
        y="65"
        fontFamily="Poppins, Arial, sans-serif"
        fontSize="75"
        fontWeight="bold"
        fill="#333333"
        style={{ fontStyle: "italic" }}
      >
        Rest
      </text>
    </svg>
  );
};

export default BrandLogo;
