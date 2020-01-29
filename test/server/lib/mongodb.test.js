'use strict';

const { expect } = require('chai');
const { Db, MongoError } = require('mongodb');

const dbLib = require('../../../src/server/lib/mongodb');

describe('lib/mongodb', () => {
  beforeEach(async () => {
      await dbLib.disconnect();
  });

  after(async () => {
      await dbLib.disconnect();
  });

  describe('Database connection', () => {
    it('connects to the database', async () => {
      await dbLib.connect();
      expect(dbLib.isConnected()).to.be.true;

      const db = dbLib.getDb();

      expect(db).to.be.instanceOf(Db);
      const stats = await db.stats();
      expect(stats.ok).to.equal(1)
    });

    it('disconnects to the database', async () => {
      await dbLib.connect();
      expect(dbLib.isConnected()).to.be.true;

      await dbLib.disconnect();
      expect(dbLib.isConnected()).to.be.false;

      const db = dbLib.getDb();

      let error;
      try {
        await db.stats();
      } catch (err) {
        error = err;
      }
      
      expect(error)
        .to.be.instanceof(MongoError)
        .with.property('message', 'topology was destroyed');
    });
  });
});
