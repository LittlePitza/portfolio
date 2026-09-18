import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";
import { Attendance } from "./Attendance";
import { Dnd } from "./Dnd";
import { Maintenance } from "./Maintenance";
import { Marketplace } from "./Marketplace";
import { MeetScribe } from "./MeetScribe";
import { PasswordVault } from "./PasswordVault";
import { TiHub } from "./TiHub";
import { Woodland } from "./Woodland";

/** Each project's drawing, by slug. A project without one still gets its mat and its name. */
export const drawings: Record<string, ComponentType<{ locale: Locale }>> = {
  "ti-hub": TiHub,
  attendance: Attendance,
  maintenance: Maintenance,
  marketplace: Marketplace,
  meetscribe: MeetScribe,
  "password-vault": PasswordVault,
  "woodland-setup": Woodland,
  "dnd-companion": Dnd,
};
