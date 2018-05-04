declare namespace SearchIndex {
  export interface Callback<T> {
    (err: any, si: Index<T>): void;
  }
  export interface Options {
    batchsize?: number;
    db?: any; // A levelup instance
    fieldedSearch?: boolean;
    fieldOptions?: boolean;
    preserveCase?: boolean;
    keySeparator?: string;
    storeable?: boolean;
    searchable?: boolean;
    indexPath?: string;
    logLevel?: string;
    nGramLength?: number | number[] | {gte: number, lte: number};
    nGramSeparator?: string;
    separator?: string;
    stopwords?: string[];
  }
  export type SearchTerm = string | { gte?: string, lte?: string, limit?: number };
  export type ANDQuery<T> = { AND: {[K in keyof T]?: SearchTerm[]} & { '*'?: SearchTerm[] } } & { BOOST?: number };
  export type NOTQuery<T> = { NOT: {[K in keyof T]?: SearchTerm[]} & { '*'?: SearchTerm[] } };
  export type QueryOptions<T> = (ANDQuery<T> | NOTQuery<T> | (ANDQuery<T> & NOTQuery<T>)) | ((ANDQuery<T> | NOTQuery<T> | (ANDQuery<T> & NOTQuery<T>))[]);
  export interface BucketsOptions<T> {
    query: QueryOptions<T>;
    buckets: {
      field: keyof T;
      gte?: string;
      lte?: string;
      set?: boolean;
      limit?: number;
    }[]
  }
  export interface CategorizeOptions<T> {
    query: QueryOptions<T>;
    category: {
      field: keyof T;
      limit?: number;
      set?: boolean;
    }
  }
  export interface MatchOptions<T> {
    beginsWith?: string;
    field?: keyof T;
    threshold?: number;
    limit?: number;
    type?: "simple"
  }
  export interface SearchOptions<T> {
    query: QueryOptions<T>;
    filters?: QueryOptions<T>;
    offset?: number;
    pageSize?: number;
  }
  export interface FieldOptions {
    fieldedSearch?: boolean;
    nGramLength?: number;
    preserveCase?: boolean;
    searchable?: boolean;
    separator?: string | RegExp;
    sortable?: boolean;
    stopwords?: string[];
    storeable?: string[];
    weight?: number;
  }
  export type IndexingOptions<T> = FieldOptions & {
      fieldOptions: {
        [K in keyof T]?: FieldOptions;
      };
  };
  export interface Index<T> {
    close(cb: (err: any) => void): void;
    buckets(opts: BucketsOptions<T>): NodeJS.EventEmitter;
    categorize(opts: CategorizeOptions<T>): NodeJS.EventEmitter;
    countDocs(cb: (err: any, count: number) => void): void;
    get(ids: string[]): NodeJS.EventEmitter;
    match(opts: MatchOptions<T>): NodeJS.EventEmitter;
    search(opts: SearchOptions<T>): NodeJS.EventEmitter;
    totalHits(opts?: SearchOptions<T>, cb?: (err: any, count: number) => void): void;
    add(): NodeJS.WritableStream;
    concurrentAdd(opts: IndexingOptions<T>, items: T[], cb: (err: any) => void): void;
    defaultPipeline(opts?: IndexingOptions<T>): NodeJS.WritableStream;
    del(ids: string[], cb: (err: any) => void): void;
    flush(cb: (err: any) => void): void;
    
    dbReadStream(opts?: {gzip?: boolean}): NodeJS.ReadableStream;
    dbWriteStream(opts?: {merge?: boolean}): NodeJS.WritableStream;
  }
}
declare function SearchIndex<T>(opts: SearchIndex.Options, cb: SearchIndex.Callback<T>): void;
declare function SearchIndex(opts: SearchIndex.Options, cb: SearchIndex.Callback<any>): void;
export = SearchIndex;
