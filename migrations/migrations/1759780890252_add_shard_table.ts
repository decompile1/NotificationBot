import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
      .createTable('shard')
      .addColumn('id', 'integer', col => col.primaryKey())
      .addColumn('name', 'varchar', col => col.notNull())
      .addColumn('ping', 'integer', col => col.notNull())
      .addColumn('uptime', 'varchar', col => col.notNull())
      .addColumn('memory', 'real', col => col.notNull())
      .addColumn('guilds', 'integer', col => col.notNull())
      .addColumn('users', 'integer', col => col.notNull())
      .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('shard').execute();
}
