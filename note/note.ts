import { APIError, ErrCode, api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const NoteDB = new SQLDatabase("notes", { migrations: "./migrations" });

type Note = {
  id: string;
  content: string;
  coverUrl: string;
};

export const saveNote = api(
  { expose: true, path: "/note", method: "POST" },
  async (note: Note): Promise<Note> => {
    await NoteDB.exec`
      INSERT INTO note (id, content, cover_url) VALUES (${note.id}, ${note.content}, ${note.coverUrl})
      ON CONFLICT (id) DO UPDATE SET content=${note.content}, cover_url=${note.coverUrl}
    `;

    return note;
  },
);

type GetNoteParams = Pick<Note, "id">;

export const getNote = api(
  { expose: true, path: "/note/:id", method: "GET" },
  async ({ id }: GetNoteParams): Promise<Note> => {
    const note = await NoteDB.queryRow<Note>`
      SELECT text, cover_url FROM note
      WHERE id = ${id}
    `;

    if (!note) {
      throw new APIError(ErrCode.NotFound, "note not found");
    }

    return note;
  },
);
