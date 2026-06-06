declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  
  export type LucideIcon = ComponentType<LucideProps>;

  export const ArrowLeft: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Plus: LucideIcon;
  export const Minus: LucideIcon;
  export const Check: LucideIcon;
  export const Star: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const X: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Trash2: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Sparkles: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Search: LucideIcon;
  export const CheckSquare: LucideIcon;
}
