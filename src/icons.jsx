// ═══════════════════════════════════════════════
// ICON SYSTEM — flat line icons (lucide), no emojis.
// Use <Icon name="..." size={14} color="#fff" /> anywhere a glyph is needed.
// Data files store semantic name strings; this maps them to icon components.
// ═══════════════════════════════════════════════
import {
  Antenna, Radio, RadioTower, Mic, Camera, Video, FileText, Smartphone, Eye,
  FlaskConical, Link, Landmark, Map, RefreshCw, Zap, AlertTriangle, Globe,
  GraduationCap, Clipboard, Hourglass, Scale, User, Users, MapPin, Lightbulb,
  Building, Building2, Lock, Settings, Handshake, Search, CircleDashed, X, Worm,
  Ruler, Puzzle, Circle, Mail, Contact, Leaf, Home, Eraser, BookOpen, Sparkles,
  Signal, Tag, ShieldCheck, Clock, Pin, Library, Presentation, Scroll, Package,
  Folder, FolderTree, Phone, Thermometer, Syringe, Timer, Triangle, TrendingUp,
  CheckCircle, Check, Telescope, Layers, Droplet, Wheat, HeartPulse, Monitor,
  File, Pause, Play, Briefcase, Pencil, Network, ExternalLink,
} from "lucide-react";

// semantic name → component
const MAP = {
  // navigation / sections
  feed: Antenna, observe: Eye, compose: Eye, compound: FlaskConical, pattern: Link,
  routing: Landmark, institution: Landmark, stakeholders: Map, map: Map,
  pipeline: RefreshCw, refresh: RefreshCw, triggers: Zap, zap: Zap,
  docs: Library, pitch: Presentation, about: User, edit: Pencil,
  // modalities
  voice: Mic, mic: Mic, image: Camera, camera: Camera, video: Video,
  text: FileText, social: Smartphone, sensor: RadioTower, phone: Phone,
  // routing layers
  hardcoded: Lock, lock: Lock, regulatory: Clipboard, configurable: Settings,
  informal: Handshake, broadcast: Antenna,
  // origin
  defined: Pin, discovered: Search, gap: CircleDashed,
  // domains
  health: HeartPulse, ecology: Leaf, agriculture: Wheat, climate: Thermometer,
  infrastructure: Building2, governance: ShieldCheck,
  // pipeline stages / concepts
  capture: Antenna, cleanse: Eraser, observe2: Eye, insight: Lightbulb,
  decision: Scale, scale: Scale, ladder: Layers, monitor: Monitor, package: Package,
  // states / misc UI
  warning: AlertTriangle, alert: AlertTriangle, hourglass: Hourglass,
  check: Check, "check-circle": CheckCircle, close: X, pause: Pause, play: Play,
  external: ExternalLink,
  timer: Timer, clock: Clock, triangle: Triangle, escalation: Triangle,
  chart: TrendingUp, search: Search, tag: Tag, folder: Folder, categorized: Folder,
  pin: MapPin, location: MapPin, scroll: Scroll, obligation: Scroll,
  user: User, users: Users, community: Users, directory: Contact,
  globe: Globe, grad: GraduationCap, mail: Mail, briefcase: Briefcase,
  // docs / framework
  intro: BookOpen, book: BookOpen, architecture: Building2, protocol: Ruler,
  model: Puzzle, features: Sparkles, connect: Link, governanceShield: ShieldCheck,
  signal: Signal, retro: Clock, telescope: Telescope, droplet: Droplet,
  zonal: Home, district: Building, file: File, syringe: Syringe,
  snake: Worm, dot: Circle, link: Link,
};

export function Icon({ name, size = 16, color = "currentColor", strokeWidth = 2, fill, style, title }) {
  const Cmp = MAP[name] || Circle;
  return (
    <Cmp
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      fill={fill || "none"}
      aria-label={title || name}
      style={{ flexShrink: 0, ...style }}
    />
  );
}

export default Icon;
