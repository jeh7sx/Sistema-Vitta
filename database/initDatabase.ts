export async function migrateDbIfNeeded(db: any) {
  const DATABASE_VERSION = 1;

  const result = await db.getFirstAsync('PRAGMA user_version');

  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) return;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS filhos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      data_nascimento TEXT,
      responsavel TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exames (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      data_exame TEXT,
      observacoes TEXT,
      id_filho INTEGER NOT NULL,
      FOREIGN KEY (id_filho)
      REFERENCES filhos(id)
      ON DELETE CASCADE
    );

    PRAGMA user_version = 1;
  `);
}