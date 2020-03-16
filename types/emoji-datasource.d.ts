declare module 'emoji-datasource' {
  export type Emoji = {
    name: string;
    unified: string;
    short_name: string;
    short_names: string[];
    category: string;
    added_in: string;
    obsoleted_by: string;
    sort_order: number;
  };

  export type Emojis = Emoji[];
  let emojis: Emojis;
  export default emojis;
}
