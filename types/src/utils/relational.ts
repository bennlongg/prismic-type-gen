import {
  CustomTypeModelField,
  CustomTypeModelFieldType,
} from "@prismicio/types";
import { factory, SyntaxKind } from "typescript";
import { createTypeName } from "./ts";

// Embed
// GeoPoint
// Link
// Link to Media
// Rich Text (anything other than the first element)
// Any field in a Group or Slice

export const prismicRelationalField = (
  id: string,
  model: Record<string, CustomTypeModelField>
) => {
  const disallowedFields = [
    CustomTypeModelFieldType.Embed,
    CustomTypeModelFieldType.GeoPoint,
    CustomTypeModelFieldType.Link,
    CustomTypeModelFieldType.Group,
    CustomTypeModelFieldType.Slices,
  ];

  const filteredProperties = Object.keys(model).reduce<string[]>(
    (arr, field) => {
      if (
        disallowedFields.findIndex(
          (disallowedField) => disallowedField === model[field].type
        ) === -1
      ) {
        arr.push(field);
      }
      return arr;
    },
    []
  );

  return factory.createTypeReferenceNode(
    factory.createIdentifier("RelationField"),
    [
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
      factory.createTypeReferenceNode(factory.createIdentifier("Partial"), [
        factory.createTypeReferenceNode(factory.createIdentifier("Pick"), [
          factory.createTypeReferenceNode(
            factory.createIdentifier(createTypeName(id)),
            undefined
          ),
          factory.createUnionTypeNode(
            filteredProperties.map((property) =>
              factory.createLiteralTypeNode(
                factory.createStringLiteral(property)
              )
            )
          ),
        ]),
      ]),
    ]
  );
};
