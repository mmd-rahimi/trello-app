import { SupabaseClient } from "@supabase/supabase-js";
import { creatClient } from "./supabase/client";
import { IBoard, IColumn } from "./supabase/models";

const supabase = creatClient();

// board Service
export const boardService = {
  async getBoard(supabase: SupabaseClient, boardId: string): Promise<IBoard> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (error) throw error;

    return data;
  },

  async createBoard(
    supabase: SupabaseClient,
    board: Omit<IBoard, "id" | "created_at" | "updated_at">
  ): Promise<IBoard> {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

// column Service
export const columnService = {
  //   async getBoards(userId: string): Promise<IBoard[]> {
  //     const {data, error} = await supabase
  //       .from("boards")
  //       .select("*")
  //       .eq("user_id", userId)
  //       .order("created_at", { ascending: false });

  //       if(error) throw error

  //       return data || []
  //   },

  async createColumn(
    supabase: SupabaseClient,
    column: Omit<IColumn, "id" | "created_at">
  ): Promise<IColumn> {
    const { data, error } = await supabase
      .from("columns")
      .insert(column)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

// board data Service
export const boardDataService = {
  async createBoardWithDefaultColumns(
    supabase: SupabaseClient,
    boardData: {
      title: string;
      description?: string;
      color?: string;
      userId: string;
    }
  ) {
    const board = await boardService.createBoard(supabase, {
      title: boardData.title,
      description: boardData.description || null,
      color: boardData.color || "bg-blue-500",
      user_id: boardData.userId,
    });

    const defaultColumns = [
      { title: "To Do", sort_order: 0 },
      { title: "In Progress", sort_order: 1 },
      { title: "Review", sort_order: 2 },
      { title: "Done", sort_order: 3 },
    ];

    await Promise.all(
      defaultColumns.map((column) =>
        columnService.createColumn(supabase, {
          ...column,
          board_id: board.id,
          user_id: boardData.userId,
        })
      )
    );

    return board
  },
};
