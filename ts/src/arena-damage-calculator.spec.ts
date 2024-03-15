import { ArenaDamageCalculator } from "./arena-damage-calculator";
import { Buff } from "./model/buff";
import { Hero } from "./model/hero";
import { HeroElement } from "./model/hero-element";
describe("Arena damage calculator", function () {
  let calculator: ArenaDamageCalculator;

  beforeEach(() => {
    calculator = new ArenaDamageCalculator();
    jest.spyOn(Math, "random").mockReturnValue(0.5); // Always return 0.5 when Math.random() is called
  });

  afterEach(() => {
    jest.spyOn(Math, "random").mockRestore(); // Restore the original Math.random() method after each test
  });

  it("a fire attacker should deal damage to a earth defender", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 50, 10, 20, 100);

    const defenders = [
      new Hero(HeroElement.Water, 80, 60, 10, 20, 100),
      new Hero(HeroElement.Fire, 90, 70, 10, 20, 100),
      new Hero(HeroElement.Earth, 50, 70, 20, 30, 100),
    ];
    const result = calculator.computeDamage(attacker, defenders);

    expect(result[0].lp).toBe(100);
    expect(result[1].lp).toBe(100);
    expect(result[2].lp).toBe(0);
  });
  it("a water attacker should deal damage to a fire defender", () => {
    const attacker = new Hero(HeroElement.Water, 100, 50, 10, 20, 100);

    const defenders = [
      new Hero(HeroElement.Water, 80, 60, 10, 20, 100),
      new Hero(HeroElement.Fire, 90, 70, 10, 20, 100),
      new Hero(HeroElement.Earth, 50, 70, 20, 30, 100),
    ];
    const result = calculator.computeDamage(attacker, defenders);

    expect(result[0].lp).toBe(100);
    expect(result[1].lp).toBe(0);
    expect(result[2].lp).toBe(100);
  });
  it("an earth attacker should deal damage to a water defender", () => {
    const attacker = new Hero(HeroElement.Earth, 100, 50, 10, 20, 100);

    const defenders = [
      new Hero(HeroElement.Water, 80, 60, 10, 20, 100),
      new Hero(HeroElement.Fire, 90, 70, 10, 20, 100),
      new Hero(HeroElement.Earth, 50, 70, 20, 30, 100),
    ];
    const result = calculator.computeDamage(attacker, defenders);

    expect(result[0].lp).toBe(0);
    expect(result[1].lp).toBe(100);
    expect(result[2].lp).toBe(100);
  });
  it("should calculate damage correctly when attacker has Buff.Attack", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 50, 10, 100, 100);
    attacker.buffs.push(Buff.Attack);
    const defender = new Hero(HeroElement.Water, 100, 50, 10, 100, 100);

    const defenders = calculator.computeDamage(attacker, [defender]);

    // Check that the damage was calculated correctly
    // This will depend on your game's damage calculation rules
    expect(defenders[0].lp).toBe(0);
  });

  it("should calculate damage correctly when defender has Buff.Defense", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 50, 10, 20, 100);
    const defender = new Hero(HeroElement.Water, 100, 50, 10, 20, 100);
    defender.buffs.push(Buff.Defense);

    const defenders = calculator.computeDamage(attacker, [defender]);

    expect(defenders[0].lp).toBeLessThan(100);
  });

  it("should calculate damage correctly for each element", () => {
    const elements = [HeroElement.Fire, HeroElement.Water, HeroElement.Earth];
    for (let i = 0; i < elements.length; i++) {
      const attacker = new Hero(elements[i], 100, 50, 10, 20, 100);
      const defender = new Hero(
        elements[(i + 1) % elements.length],
        100,
        50,
        10,
        20,
        100
      );

      const defenders = calculator.computeDamage(attacker, [defender]);

      expect(defenders[0].lp).toBeLessThan(100);
    }
  });

  it("should not deal damage to a dead defender", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 50, 10, 20, 100);
    const defender = new Hero(HeroElement.Water, 0, 50, 10, 20, 100);

    const defenders = calculator.computeDamage(attacker, [defender]);

    expect(defenders[0].lp).toBe(21);
  });

  it(" a fire attacker should deal 20% less damage to a water defenders", () => {
    const attacker = new Hero(HeroElement.Fire, 100, 50, 10, 20, 100);

    const defenders = [
      new Hero(HeroElement.Water, 100, 60, 10, 20, 100),
      new Hero(HeroElement.Water, 100, 60, 10, 20, 100),
      new Hero(HeroElement.Water, 100, 60, 10, 20, 100),
    ];
    const result = calculator.computeDamage(attacker, defenders);

    expect(result[0].lp).toBe(100);
    expect(result[1].lp).toBe(21);
    expect(result[2].lp).toBe(100);
  });
});
