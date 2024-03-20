import { HeroElement } from "./model/hero-element";
import { Buff } from "./model/buff";
import { Hero } from "./model/hero";

export class ArenaDamageCalculator {
  computeDamage(attacker: Hero, defenders: Hero[]): Hero[] {
    const elementAdvantage = {
      [HeroElement.Water]: { adv: HeroElement.Fire, dis: HeroElement.Earth },
      [HeroElement.Fire]: { adv: HeroElement.Earth, dis: HeroElement.Water },
      [HeroElement.Earth]: { adv: HeroElement.Water, dis: HeroElement.Fire },
    };

    const { adv: advElement, dis: disElement } =
      elementAdvantage[attacker.element];

    const [adv, eq, dis] = defenders.reduce(
      (acc: Hero[][], h: Hero) => {
        if (h.lp <= 0) return acc;
        if (h.element === advElement) acc[0].push(h);
        else if (h.element === disElement) acc[2].push(h);
        else acc[1].push(h);
        return acc;
      },
      [[], [], []] as Hero[][]
    );

    const attacked =
      this.getRandomHero(adv) ||
      this.getRandomHero(eq) ||
      this.getRandomHero(dis);

    if (!attacked) return defenders;

    let dmg = this.calculateDamage(
      attacker,
      attacked,
      attacker.crtr > Math.random() * 100
    );

    // BUFFS
    if (attacker.buffs.includes(Buff.Attack)) {
      dmg += this.calculateDamage(
        attacker,
        attacked,
        attacker.crtr > Math.random() * 100,
        0.25
      );
    }

    if (attacked.buffs.includes(Buff.Defense)) {
      dmg =
        (dmg / (1 - attacked.def / 7500)) * (1 - attacked.def / 7500 - 0.25);
    }

    dmg = Math.max(dmg, 0);
    if (dmg > 0) {
      dmg = this.applyElementalAdvantage(dmg, attacked, adv, eq, dis);
      attacked.lp = Math.max(attacked.lp - Math.floor(dmg), 0);
    }

    return defenders;
  }

  private getRandomHero(heroes: Hero[]): Hero | undefined {
    return heroes.length
      ? heroes[Math.floor(Math.random() * heroes.length)]
      : undefined;
  }

  private calculateDamage(
    attacker: Hero,
    defender: Hero,
    isCritical: boolean,
    multiplier = 1
  ): number {
    const baseDamage = isCritical
      ? attacker.pow + (0.5 + attacker.leth / 5000) * attacker.pow
      : attacker.pow;
    return baseDamage * multiplier * (1 - defender.def / 7500);
  }

  private applyElementalAdvantage(
    dmg: number,
    attacked: Hero,
    adv: Hero[],
    eq: Hero[],
    dis: Hero[]
  ): number {
    if (adv.find((h) => h === attacked)) {
      dmg = dmg + (dmg * 20) / 100;
    } else if (dis.find((h) => h === attacked)) {
      dmg = dmg - (dmg * 20) / 100;
    }
    return dmg;
  }
}
