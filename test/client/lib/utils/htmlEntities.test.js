'use strict';

const { expect } = require('chai');

const htmlEntities = require('../../../../src/client/lib/utils/htmlEntities');

describe('lib/utils/htmlEntities', () => {
    it('should decode html entity', () => {
        const ENTITY = '&#32423;&#31243;&#24207;&#35774;&#35745;';
        const STR = '级程序设计';

        const decoded = htmlEntities.decodeHtmlEntity(ENTITY);

        expect(decoded).to.deep.equal(STR);
    });

    it('should encode html entity', () => {
        const ENTITY = '&#32423;&#31243;&#24207;&#35774;&#35745;';
        const STR = '级程序设计';

        const encoded = htmlEntities.encodeHtmlEntity(STR);

        expect(encoded).to.deep.equal(ENTITY);
    });
});
