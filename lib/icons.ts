// Central icon registry — JSON content files reference icons by string name;
// components look them up here. Keep in sync with lucide-react usages.
import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Banknote,
  BarChart3,
  Bot,
  Boxes,
  Briefcase,
  Building,
  Building2,
  Cloud,
  Cpu,
  Database,
  GraduationCap,
  Headset,
  HeartHandshake,
  Leaf,
  MapPin,
  Navigation,
  Palette,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Sun,
  Target,
  Users,
  Users2,
  Workflow,
} from 'lucide-react';

const REGISTRY: Record<string, LucideIcon> = {
  Award, Banknote, BarChart3, Bot, Boxes, Briefcase, Building, Building2,
  Cloud, Cpu, Database, GraduationCap, Headset, HeartHandshake, Leaf,
  MapPin, Navigation, Palette, ShieldCheck, ShoppingCart, Sparkles, Sprout,
  Star, Stethoscope, Sun, Target, Users, Users2, Workflow,
};

/** Look up a lucide icon by name. Falls back to Sparkles if a name typos out. */
export function icon(name: string): LucideIcon {
  return REGISTRY[name] ?? Sparkles;
}
