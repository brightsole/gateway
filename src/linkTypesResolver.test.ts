import {
  ASSOCIATION_TYPES,
  makeAssociationKeyReadable,
  resolvers,
} from './linkTypesResolver';

describe('linkTypesResolver', () => {
  describe('makeAssociationKeyReadable', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should convert valid association keys to human-readable format', () => {
      const result = makeAssociationKeyReadable('agram|rhyme|means');

      expect(result).toEqual([
        { id: 'agram', name: 'Anagram' },
        { id: 'rhyme', name: 'Rhymes' },
        { id: 'means', name: 'Means Like' },
      ]);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle single association key', () => {
      const result = makeAssociationKeyReadable('soundsLike');

      expect(result).toEqual([{ id: 'soundsLike', name: 'Sounds Like' }]);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should filter out invalid keys and log error', () => {
      const result = makeAssociationKeyReadable('agram|invalidKey|rhyme');

      expect(result).toEqual([
        { id: 'agram', name: 'Anagram' },
        { id: 'rhyme', name: 'Rhymes' },
      ]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Invalid association type encountered: "invalidKey"',
        ),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Valid types are:'),
      );
    });

    it('should filter out multiple invalid keys and log multiple errors', () => {
      const result = makeAssociationKeyReadable(
        'badKey|agram|anotherBad|rhyme',
      );

      expect(result).toEqual([
        { id: 'agram', name: 'Anagram' },
        { id: 'rhyme', name: 'Rhymes' },
      ]);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Invalid association type encountered: "badKey"',
        ),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Invalid association type encountered: "anotherBad"',
        ),
      );
    });

    it('should return empty array if all keys are invalid', () => {
      const result = makeAssociationKeyReadable('invalid1|invalid2');

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle all valid enum values', () => {
      const allValidKeys = Object.values(ASSOCIATION_TYPES).join('|');
      const result = makeAssociationKeyReadable(allValidKeys);

      expect(result.length).toBe(Object.values(ASSOCIATION_TYPES).length);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('resolvers', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should resolve Solve associations correctly', () => {
      const parent = { associationsKey: 'agram|rhyme' };
      const result = resolvers.Solve.linkTypes(parent);

      expect(result).toEqual([
        { id: 'agram', name: 'Anagram' },
        { id: 'rhyme', name: 'Rhymes' },
      ]);
    });

    it('should resolve Hop associations correctly', () => {
      const parent = { associationsKey: 'means|associated' };
      const result = resolvers.Hop.linkTypes(parent);

      expect(result).toEqual([
        { id: 'means', name: 'Means Like' },
        { id: 'associated', name: 'Associated With' },
      ]);
    });

    it('should filter invalid keys in Solve resolver', () => {
      const parent = { associationsKey: 'agram|invalidType|rhyme' };
      const result = resolvers.Solve.linkTypes(parent);

      expect(result).toEqual([
        { id: 'agram', name: 'Anagram' },
        { id: 'rhyme', name: 'Rhymes' },
      ]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Invalid association type encountered: "invalidType"',
        ),
      );
    });

    it('should filter invalid keys in Hop resolver', () => {
      const parent = { associationsKey: 'means|badKey|associated' };
      const result = resolvers.Hop.linkTypes(parent);

      expect(result).toEqual([
        { id: 'means', name: 'Means Like' },
        { id: 'associated', name: 'Associated With' },
      ]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Invalid association type encountered: "badKey"',
        ),
      );
    });
  });
});
