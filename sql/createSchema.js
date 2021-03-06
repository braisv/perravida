const db = require('../lib/db');
const fs = require('fs');
const path = require('path');

/**
 * Executes all sql statements in createSchema.sql
 */
const createSchema = async () => {
  const dbClient = await db.getClient();
  const schema = fs.readFileSync(path.join(__dirname, 'createSchema.sql'));

  console.log('- LOADING SCHEMA -')
  await dbClient.exec(schema.toString());
  dbClient.close();
};

createSchema().then(r => {
  console.log('Finished  OK', r);
}).catch(e => {
  console.log('Finished  KO', e);
});