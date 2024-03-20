import { HeroElement } from "./model/hero-element";
import { Buff } from "./model/buff";
import { Hero } from "./model/hero";

export class ArenaDamageCalculator {
  public cpt: number | undefined;
  public originalElement!: HeroElement;
  computeDamage(attacker: Hero, defenders: Hero[]): Hero[] {
    if (this.cpt == 1) {
      // À la fin du round, rétablir l'élément d'origine de l'attaquant
      attacker.element = this.originalElement;
      this.cpt = 0;
    }
    if (attacker.buffs.includes(Buff.Turncoat)) {
      // Appliquer le changement d'élément temporaire selon les règles de TURNCOAT
      this.originalElement = attacker.element;
      this.cpt = 1;
      switch (attacker.element) {
        case HeroElement.Fire:
          attacker.element = HeroElement.Water;
          break;
        case HeroElement.Water:
          attacker.element = HeroElement.Earth;
          break;
        case HeroElement.Earth:
          attacker.element = HeroElement.Fire;
          break;
      }
    }
    // Supprimer le buff TURNCOAT
    attacker.removeBuff(Buff.Turncoat);
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
        if (attacker.buffs.includes(Buff.Holy) || h.buffs.includes(Buff.Holy)) {
          acc[1].push(h);
        } else {
          if (h.element === advElement) acc[0].push(h);
          else if (h.element === disElement) acc[2].push(h);
          else acc[1].push(h);
        }
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
      attacker.crtr > Math.random() * 100,
      false
    );
    // BUFFS
    if (attacker.buffs.includes(Buff.Attack)) {
      dmg += this.calculateDamage(
        attacker,
        attacked,
        attacker.crtr > Math.random() * 100,
        false,
        0.25
      );
    }

    if (attacked.buffs.includes(Buff.Defense)) {
      dmg =
        (dmg / (1 - attacked.def / 7500)) * (1 - attacked.def / 7500 - 0.25);
    }
    // Holy buff
    if (attacker.buffs.includes(Buff.Holy)) {
      // Ignores the opponent's defense and reduces damage by 20%.
      dmg += this.calculateDamage(
        attacker,
        attacked,
        attacker.crtr > Math.random() * 100,
        true,
        -0.2
      );
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
    ignoreDefense: boolean,
    multiplier = 1
  ): number {
    const baseDamage = isCritical
      ? attacker.pow + (0.5 + attacker.leth / 5000) * attacker.pow
      : attacker.pow;
    if (ignoreDefense) {
      return baseDamage * multiplier;
    } else {
      return baseDamage * multiplier * (1 - defender.def / 7500);
    }
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
