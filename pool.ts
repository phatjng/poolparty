import { ModelMap } from "./types";

export class Pool<M extends ModelMap> {
  public readonly models: M;

  constructor(options: { models: M }) {
    this.models = options.models;

    for (const model of Object.values(options.models)) {
      model.attach(this);
    }
  }
}
