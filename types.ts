import type { Model } from "./model";

export type Row = { id: string };

export type ModelMap = Record<string, Model<any, any>>;
