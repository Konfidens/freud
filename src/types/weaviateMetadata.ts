export type weaviateMetadataDictionary = {
  [key: string]: {
    title: string;
    author: string;
    isbn: number;
    splitCount?: number;
  };
};
