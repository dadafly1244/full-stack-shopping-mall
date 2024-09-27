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
  interface DialogProps extends MaterialTailwindComponent {}
  interface DialogHeaderProps extends MaterialTailwindComponent {}
  interface DialogBodyProps extends MaterialTailwindComponent {}
  interface DialogFooterProps extends MaterialTailwindComponent {}
  interface ListProps extends MaterialTailwindComponent {}
  interface ListItemProps extends MaterialTailwindComponent {}
  interface AccordionProps extends MaterialTailwindComponent {}
  interface AccordionHeaderProps extends MaterialTailwindComponent {}
  interface CarouselProps extends MaterialTailwindComponent {}
  interface DrawerProps extends MaterialTailwindComponent {}
  interface BreadcrumbsProps extends MaterialTailwindComponent {}
  interface TabsHeaderProps extends MaterialTailwindComponent {}
  interface TabsProps extends MaterialTailwindComponent {}
  interface TabProps extends MaterialTailwindComponent {}
  interface TabsBodyProps extends MaterialTailwindComponent {}
}
