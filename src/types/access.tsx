
import {
  LockIcon,
  LockOpenIcon,
  Anchor,
  Shield,
  RefreshCw,
  Palette,
  GroupIcon,
  UngroupIcon
} from "lucide-react";
import { DualTemplate } from "./template";
import { useLock } from "../canvas/hooks/useTextLock";

export type AccessLevel = 'view' | 'comment' | 'edit';

export type LockType =
  | "none"          // default, unlocked
  | "position"      // prevent moving
  | "full"          // prevent moving + editing
  | "replace"       // allow content swap only
  | "style"         // freeze styling, allow content edits
  | "hierarchical" 
  | "transform"; // cascades to children



  export function getLockVisual(lockType: LockType) {
    switch (lockType) {
      case "position":
        return { icon: <Anchor size={24} />, title: "Position locked" };
      case "full":
        return { icon: <LockIcon size={24} />, title: "Fully locked" };
      case "replace":
        return { icon: <RefreshCw size={24} />, title: "Replace-only lock" };
      case "style":
        return { icon: <Palette size={24} />, title: "Style locked" };
      case "hierarchical":
        return { icon: <Shield size={24} />, title: "Hierarchical lock" };
      default:
        return { icon: <LockOpenIcon size={24} />, title: "Unlocked" };
    }
  }

  export function useSafeLock(
    id: string | null,
    lockType: LockType,
    template: DualTemplate | null,
    side: keyof DualTemplate,
    setTemplate: (next: DualTemplate) => void
  ) {
    const canUseLock = id !== null && template !== null && typeof side === "string";
  
    return canUseLock
      ? useLock({ id, lockType, template, side, setTemplate })
      : { currentLock: "none" as LockType, toggle: () => {}, setLockType: () => {} };
  }

  
  
  