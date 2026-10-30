import type { ModelObject } from "./model-object";
import type { Pool } from "./pool";
import type { Row } from "./types";

type ModelObjectClass<T extends Row, O> = new (data: T, pool: Pool<any>) => O;

export class Model<T extends Row, O extends ModelObject<T, any>> {
  private pool?: Pool<any>;
  protected rows = new Map<string, T>();

  constructor(private ModelObjectClass: ModelObjectClass<T, O>) {}

  private wrap(row: T): O {
    if (!this.pool) {
      throw new Error("Model is not attached to a pool");
    }

    return new this.ModelObjectClass(row, this.pool);
  }

  /** @internal called by Pool */
  public attach(pool: Pool<any>): void {
    if (this.pool) {
      throw new Error("Model is already attached to a pool");
    }

    this.pool = pool;
  }

  public get(id: string): O | undefined {
    const row = this.rows.get(id);
    return row ? this.wrap(row) : undefined;
  }

  public set(row: T): void {
    this.rows.set(row.id, row);
  }

  public del(id: string): boolean {
    return this.rows.delete(id);
  }

  public where(predicate: (row: T) => boolean): O[] {
    const result: O[] = [];

    for (const row of this.rows.values()) {
      if (predicate(row)) {
        result.push(this.wrap(row));
      }
    }

    return result;
  }
}
