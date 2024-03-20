import { ArenaDamageCalculator } from "./arena-damage-calculator";
import { Buff } from "./model/buff";
import { Hero } from "./model/hero";
import { HeroElement } from "./model/hero-element";

describe("ArenaDamageCalculator", () => {
  let calculator: ArenaDamageCalculator;

  beforeEach(() => {
    calculator = new ArenaDamageCalculator();
  });

  it("A water attacker should deal demage to a fire defender ", () => {
    /*attaque = pow, defense = def, critique = crtr, leth = leth et vies = lp*/
    const attacker = new Hero(HeroElement.Water, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Fire, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[0].lp).toBe(82);
  });
  it("A fire attacker should deal demage to a earth defender ", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Fire, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[2].lp).toBe(82);
  });
  it("should decrease damage when defender has Defense buff", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Fire, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
    ];
    defenders[1].buffs.push(Buff.Defense);
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[1].lp).toBe(112);
  });
  it("a water attacker should deal demage to a water defender", () => {
    const attacker = new Hero(HeroElement.Water, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[1].lp).toBe(101);
  });
  it("should increase damage when attacker has attcker buff", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Fire, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
    ];
    attacker.buffs.push(Buff.Attack);
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[0].lp).toBe(77);
  });
  it("a earth attacker should deal demage to a earth defender", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 0, 50, 100, 200);
    const defenders = [
      new Hero(HeroElement.Earth, 100, 0, 0, 50, 200),
      new Hero(HeroElement.Fire, 100, 0, 0, 50, 200),
      new Hero(HeroElement.Fire, 100, 0, 0, 50, 200),
    ];
    attacker.buffs.push(Buff.Attack);
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[0].lp).toBe(12);
  });
  it("a fire attker should deal demage to a water defender", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 200),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 0),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[0].lp).toBe(120);
  });
  it("a water attker should deal demage to a earth defender", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 200),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[2].lp).toBe(120);
  });
  it("a earth attker should deal demage to a fire defender", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 0),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[1].lp).toBe(120);
  });
  it("a earth attker should deal demage to a fire defender", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 1),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 0),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result).toBeDefined();
    expect(result[1].lp).toBe(0);
  });
  // Add more test cases to cover other scenarios and edge cases
});
