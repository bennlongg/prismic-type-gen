# Prismic type gen

## WORK IN PROGRESS

This package uses the prismic custom types api to generate a typescript file from your repo

```
// prismicTypes.ts

export type BlogPost = {
    uid?: string;
    title?: RichTextField;
    cover_image?: ImageField;
    author?: RelationField<string, string, Partial<Pick<People, "name" | "role" | "illustration" | "bio">>>;
    published_date?: string;
    read_time?: NumberField;
    body?: (RichTextSlice | ImagesSlice | SquareSlice | QuoteSlice | VideoSlice)[];
};

...
```

This can be used with @prismico/client to have complete type safety when requesting data from their REST api

```
await prismicClient.getByType<PrismicDocument<BlogPost>>("blog_post")
```

### Worth mentioning

Everything is optional - https://prismic.io/blog/required-fields
RelationalFields can only have a subset of fields types - https://prismic.io/docs/technologies/fetch-linked-document-fields-rest-api


### TODO
Handle shared slices
