import { Buff } from "./buff";
import { HeroElement } from "./hero-element";

export class Hero {
  public buffs: Buff[] = [];

  constructor(
    public element: HeroElement,
    readonly pow: number,
    readonly def: number,
    readonly leth: number,
    readonly crtr: number,
    public lp: number
  ) {}
  removeBuff(buff: Buff) {
    const index = this.buffs.indexOf(buff);
    if (index > -1) {
      this.buffs.splice(index, 1);
    }
  }
}
