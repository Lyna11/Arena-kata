import { ArenaDamageCalculator } from "./arena-damage-calculator";
import { Buff } from "./model/buff";
import { Hero } from "./model/hero";
import { HeroElement } from "./model/hero-element";

describe("ArenaDamageCalculator", () => {
  let calculator: ArenaDamageCalculator;

  beforeEach(() => {
    calculator = new ArenaDamageCalculator();
  });

  it("A water attacker with no buffs should deal 118 damage to a fire defender who has 75 in def ", () => {
    /*attaque = pow, defense = def, critique = crtr, leth = leth et vies = lp*/
    const attacker = new Hero(HeroElement.Water, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Fire, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(82);
    expect(result[1].lp).toBe(200);
    expect(result[2].lp).toBe(200);
  });
  it("A fire attacker with no buffs should deal 118 damage to a earth defender ", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Fire, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(200);
    expect(result[1].lp).toBe(200);
    expect(result[2].lp).toBe(82);
  });
  it("An Earth attacker with no buffs should attack water and deal 88 damage when defender has Defense buff and has 75 in def", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Fire, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
    ];
    defenders[1].buffs.push(Buff.Defense);
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(200);
    expect(result[1].lp).toBe(112);
    expect(result[2].lp).toBe(200);
  });
  it("a water attacker with no buffs should deal 99 damage to a water defender who has 75 in def when no fire defender", () => {
    const attacker = new Hero(HeroElement.Water, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 75, 0, 0, 200),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(200);
    expect(result[1].lp).toBe(101);
    expect(result[2].lp).toBe(200);
  });
  it("a fire attacker with attack buff should deal 123 damage to a fire defender who has 75 in def who has no buffs when no earth defender", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 75, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Fire, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
      new Hero(HeroElement.Water, 100, 75, 0, 0, 200),
    ];
    attacker.buffs.push(Buff.Attack);
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(77);
    expect(result[1].lp).toBe(200);
    expect(result[2].lp).toBe(200);
  });
  it("a earth attacker with no buffs should deal 188 damage to a earth defender who has 0 in def, 100 in crit and 50 in leth", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 0, 50, 100, 200);
    const defenders = [
      new Hero(HeroElement.Earth, 100, 0, 0, 50, 200),
      new Hero(HeroElement.Fire, 100, 0, 0, 50, 200),
      new Hero(HeroElement.Fire, 100, 0, 0, 50, 200),
    ];
    attacker.buffs.push(Buff.Attack);
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(12);
    expect(result[1].lp).toBe(200);
    expect(result[2].lp).toBe(200);
  });
  it("a fire attacker with no buffs should deal 80 damage to a water defender even if its weakness if others defenders has 0 lp", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 200),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 0),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(120);
    expect(result[1].lp).toBe(0);
    expect(result[2].lp).toBe(0);
  });
  it("a water attacker with no buffs should deal 80 damage to a earth defender even if its weakness if others defenders has 0 lp", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 200),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(0);
    expect(result[1].lp).toBe(0);
    expect(result[2].lp).toBe(120);
  });
  it("a earth attacker with no buffs should deal 80 damage to a fire defender even if its weakness if others defenders has 0 lp", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 200),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 0),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(0);
    expect(result[1].lp).toBe(120);
    expect(result[2].lp).toBe(0);
  });
  it("a earth attacker with no buffs should deal 1 damage to a fire defender beacause it's the only one who was his lp > 0 and lp can't be < 0", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 1),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 0),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(0);
    expect(result[1].lp).toBe(0);
    expect(result[2].lp).toBe(0);
  });

  it("a earth should attack no one when all the defenders has 0 lp", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 0, 0, 0, 200);
    const defenders = [
      new Hero(HeroElement.Water, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Fire, 100, 0, 0, 0, 0),
      new Hero(HeroElement.Earth, 100, 0, 0, 0, 0),
    ];
    const result = calculator.computeDamage(attacker, defenders);
    expect(result[0].lp).toBe(0);
    expect(result[1].lp).toBe(0);
    expect(result[2].lp).toBe(0);
  });
  // Add more test cases to cover other scenarios and edge cases
});
