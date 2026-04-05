import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
      .createTable('bye')
      .addColumn('guild_id', 'varchar', col => col.primaryKey())
      .addColumn('enabled', 'boolean')
      .addColumn('channel_id', 'varchar')
      .addColumn('webhook_url', 'varchar')
      .addColumn('message', 'jsonb')
      .addColumn('delete_after', 'integer')
      .addColumn('card', 'jsonb')
      .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .execute();

  await db.schema
      .createTable('dmnotifications')
      .addColumn('user_id', 'varchar', col => col.primaryKey())
      .addColumn('enabled', 'boolean')
      .addColumn('embedcolor', 'integer')
      .addColumn('source', 'varchar')
      .addColumn('thumbnail', 'varchar')
      .addColumn('text', 'varchar')
      .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .execute();

  await db.schema
      .createTable('followupdates')
      .addColumn('guild_id', 'varchar', col => col.primaryKey())
      .addColumn('channel_id', 'varchar')
      .addColumn('name', 'varchar')
      .execute();

  await db.schema
      .createTable('notifications')
      .addColumn('id', 'varchar', col => col.primaryKey())
      .addColumn('guild_id', 'varchar')
      .addColumn('channel_id', 'varchar')
      .addColumn('role_id', 'varchar')
      .addColumn('type', 'integer')
      .addColumn('flags', 'integer')
      .addColumn('regex', 'varchar')
      .addColumn('creator_id', 'varchar')
      .addColumn('message', 'jsonb')
      .addColumn('creator', 'jsonb')
      .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .execute();

  await db.schema
      .createTable('reviews')
      .addColumn('guild_id', 'varchar', col => col.primaryKey())
      .addColumn('name', 'varchar')
      .addColumn('icon', 'varchar')
      .addColumn('member_count', 'integer')
      .addColumn('review', 'text')
      .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .execute();

  await db.schema
      .createTable('user')
      .addColumn('id', 'varchar', col => col.primaryKey())
      .addColumn('email', 'varchar')
      .addColumn('username', 'varchar')
      .addColumn('display_name', 'varchar')
      .addColumn('avatar_hash', 'varchar')
      .addColumn('access_token', 'varchar', col => col.notNull())
      .addColumn('refresh_token', 'varchar', col => col.notNull())
      .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .execute();

  await db.schema
      .createTable('welcome')
      .addColumn('guild_id', 'varchar', col => col.primaryKey())
      .addColumn('enabled', 'boolean')
      .addColumn('channel_id', 'varchar')
      .addColumn('message', 'jsonb')
      .addColumn('role_ids', 'jsonb')
      .addColumn('ping_ids', 'jsonb')
      .addColumn('delete_after', 'integer')
      .addColumn('delete_after_leave', 'boolean')
      .addColumn('is_restorable', 'boolean', col => col.notNull().defaultTo(false))
      .addColumn('dm', 'jsonb')
      .addColumn('reactions', 'jsonb')
      .addColumn('card', 'jsonb')
      .addColumn('button', 'jsonb')
      .addColumn('welcome_message_ids', 'jsonb')
      .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
      .execute();

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
  await db.schema.dropTable('welcome').execute();
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('reviews').execute();
  await db.schema.dropTable('notifications').execute();
  await db.schema.dropTable('followupdates').execute();
  await db.schema.dropTable('dmnotifications').execute();
  await db.schema.dropTable('bye').execute();
  await db.schema.dropTable('shard').execute();
}