import { createClient, RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { Note } from "@/modules/notes/note.entity";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);

// 常にデータベースを監視してsupabaseのデータが変わったら、リアルタイムでそれがアプリに通知されて取得できる。
export const subscribe = (
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<Note>) => void
) => {
  return supabase
    // channelの引数は任意のもの
    .channel('notes-changes')
    .on<Note>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

export const unsubscribe = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel);
};
