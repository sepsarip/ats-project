import { assertDevOnly, truncateAllTables, closePool } from './db.utils.js';

async function main() {
  try {
    assertDevOnly();

    console.log('Starting database reset...');
    await truncateAllTables();

    console.log('Done.');
  } catch (err) {
    console.error('Error resetting database:', err.message);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

main();
