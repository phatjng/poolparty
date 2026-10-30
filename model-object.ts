import type { Pool } from "./pool";
import type { ModelMap, Row } from "./types";

export abstract class ModelObject<T extends Row, M extends ModelMap> {
  constructor(
    protected data: T,
    protected pool: Pool<M>,
  ) {}

  get id() {
    return this.data.id;
  }
}
