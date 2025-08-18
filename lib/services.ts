import { creatClient } from "./supabase/client";
import { IBoard } from "./supabase/models";

const supabase = creatClient();
export const boardService = {
  async getBoards(userId: string): Promise<IBoard[]> {
    const {data, error} = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

      if(error) throw error

      return data || []
  },

    async createBoard(board: Omit<IBoard, "id" | "updated_at" | "created_at">): Promise<IBoard> {
    const {data, error} = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single()

      if(error) throw error

      return data;
  },
};
