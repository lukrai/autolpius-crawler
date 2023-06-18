import { matchCarModel } from "./carModels";

describe("matchCarModel", () => {
    it('should match toyota auris to toyota corrolla', () => {
        const result = matchCarModel('Toyota Auris')
        expect(result).toEqual('Toyota Corolla/Auris');
    })

    it('should handle whitespaces', () => {
        const result = matchCarModel('   Toyota      Auris    ')
        expect(result).toEqual('Toyota Corolla/Auris');
    })

    it('should match passat to passat', () => {
        const result = matchCarModel('Volkswagen Passat')
        expect(result).toEqual('Volkswagen Passat');
    })

    it('should return passed model if not matched', () => {
        const result = matchCarModel('Some car maker')
        expect(result).toEqual('Some car maker');
        const result2 = matchCarModel('   Toyota      NotAuris    ')
        expect(result2).toEqual('Toyota NotAuris');
    })

    it('should return empty string if passed null', () => {
        const result = matchCarModel(null as any)
        expect(result).toEqual('');
    })
    it('should return empty string if passed undefined', () => {
        const result = matchCarModel(undefined)
        expect(result).toEqual('');
    })
});