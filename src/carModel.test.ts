import { matchCarModel, convertPriceTextToNumber } from "./carModels";

describe("matchCarModel file", () => {
  describe("matchCarModel", () => {
    it("should match toyota auris to toyota corrolla", () => {
      const result = matchCarModel("Toyota Auris");
      expect(result).toEqual("Toyota Corolla/Auris");
    });

    it("should handle whitespaces", () => {
      const result = matchCarModel("   Toyota      Auris    ");
      expect(result).toEqual("Toyota Corolla/Auris");
    });

    it("should match passat to passat", () => {
      const result = matchCarModel("Volkswagen Passat");
      expect(result).toEqual("Volkswagen Passat");
    });

    it("should return passed model if not matched", () => {
      const result = matchCarModel("Some car maker");
      expect(result).toEqual("Some car maker");
      const result2 = matchCarModel("   Toyota      NotAuris    ");
      expect(result2).toEqual("Toyota NotAuris");
    });

    it("should return empty string if passed null", () => {
      const result = matchCarModel(null as any);
      expect(result).toEqual("");
    });
    it("should return empty string if passed undefined", () => {
      const result = matchCarModel(undefined);
      expect(result).toEqual("");
    });
  });

  describe("convertPriceTextToNumber", () => {
    it("should convert price text to number", () => {
      expect(convertPriceTextToNumber("13 399 €")).toEqual(13399);
      expect(convertPriceTextToNumber("13 399 €\n                \n                            \n\n        \n\n\n        \n            \n                            \n                    13 200 € eksportui")).toEqual(13399);
      expect(convertPriceTextToNumber("")).toEqual(0);
      expect(convertPriceTextToNumber(undefined as any)).toEqual(0);
      expect(convertPriceTextToNumber('22 222' as any)).toEqual(22222);
      expect(convertPriceTextToNumber('22 222 € + something' as any)).toEqual(22222);
      expect(convertPriceTextToNumber('22 222 € + muitas' as any)).toEqual(26888);
    });
});
});
