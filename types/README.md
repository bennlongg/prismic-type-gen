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

## GETTING STARTED
1. Globally install the package `npm i prismic-type-gen -g` or `yarn global add prismic-type-gen`

2. Add the file `prismicTypeGen.config.json` to the root of your project
```
// prismicTypeGen.config.json

{
  "repo": "my-cool-repo",
  "token": "ey...", Found in prismic dashboard - API & Security
  "outputPath": "../types/prismic.ts" // optional - defaults to prismicTypes.ts
}
```
3. Run `prismic-type-gen`


### Worth mentioning

- Everything is optional - https://prismic.io/blog/required-fields
- RelationalFields can only have a subset of fields types - https://prismic.io/docs/technologies/fetch-linked-document-fields-rest-api


### TODO
Handle shared slices