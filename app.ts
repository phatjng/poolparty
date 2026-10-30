import { Model } from "./model";
import { ModelObject } from "./model-object";
import { Pool } from "./pool";

type MemberRow = { id: string; name: string };
type IssueRow = { id: string; title: string; assigneeId?: string };

type Models = {
  members: Model<MemberRow, Member>;
  issues: Model<IssueRow, Issue>;
};

class Member extends ModelObject<MemberRow, Models> {
  get name() {
    return this.data.name;
  }

  get issues() {
    return this.pool.models.issues.where((row) => row.assigneeId === this.id);
  }
}

class Issue extends ModelObject<IssueRow, Models> {
  get title() {
    return this.data.title;
  }

  get assignee() {
    return this.data.assigneeId
      ? this.pool.models.members.get(this.data.assigneeId)
      : undefined;
  }
}

const pool = new Pool<Models>({
  models: {
    members: new Model(Member),
    issues: new Model(Issue),
  },
});

const alice: MemberRow = { id: crypto.randomUUID(), name: "Alice" };

pool.models.members.set(alice);

pool.models.issues.set({
  id: crypto.randomUUID(),
  title: "Fix login",
  assigneeId: alice.id,
});
