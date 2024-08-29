declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
import "@material-tailwind/react";

declare module "@material-tailwind/react" {
  interface MaterialTailwindComponent {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }

  interface NavbarProps extends MaterialTailwindComponent {}
  interface ButtonProps extends MaterialTailwindComponent {}
  interface TypographyProps extends MaterialTailwindComponent {}
  interface MobileNavProps extends MaterialTailwindComponent {}
  interface InputProps extends MaterialTailwindComponent {}
  interface IconButtonProps extends MaterialTailwindComponent {}
  interface CardProps extends MaterialTailwindComponent {}
  interface CardHeaderProps extends MaterialTailwindComponent {}
  interface CardBodyProps extends MaterialTailwindComponent {}
  interface SelectProps extends MaterialTailwindComponent {}
  interface OptionProps extends MaterialTailwindComponent {}
  interface TextareaProps extends MaterialTailwindComponent {}
  interface SpinnerProps extends MaterialTailwindComponent {}
}
