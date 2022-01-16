import {
  CustomTypeModelField,
  CustomTypeModelFieldType,
  CustomTypeModelLinkSelectType,
} from "@prismicio/types";
import { TypeNode, factory, SyntaxKind } from "typescript";
import { createTypeName, createProperties } from "./ts";
import { prismicRelationalField } from "./relational";
import { Fields } from "../allPrismicCustomTypes";
type ModelFields = Record<string, CustomTypeModelField>;

export const propertyTypeMap = (
  property: CustomTypeModelField,
  models: Record<string, ModelFields>
): TypeNode => {
  if (property.type === CustomTypeModelFieldType.Slices) {
    return factory.createArrayTypeNode(
      factory.createParenthesizedType(
        factory.createUnionTypeNode(
          Object.keys(property.config.choices).map((slice) =>
            factory.createTypeReferenceNode(
              factory.createIdentifier(createTypeName(`${slice}Slice`)),
              undefined
            )
          )
        )
      )
    );
  }

  if (property.type === CustomTypeModelFieldType.Group) {
    const p = createProperties(property.config.fields, (p) =>
      propertyTypeMap(p, models)
    );
    return factory.createArrayTypeNode(factory.createTypeLiteralNode(p));
  }

  if (property.type === CustomTypeModelFieldType.Link) {
    if (property.config.select === CustomTypeModelLinkSelectType.Document) {
      const docId = property.config["customtypes"]![0];
      return prismicRelationalField(docId, models[docId]);
    }
  }

  if (property.type === CustomTypeModelFieldType.Select) {
    return factory.createUnionTypeNode(
      property.config.options.map((option) =>
        factory.createLiteralTypeNode(factory.createStringLiteral(option))
      )
    );
  }

  switch (property.type) {
    case CustomTypeModelFieldType.Boolean:
      return factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword);
    case CustomTypeModelFieldType.UID:
    case CustomTypeModelFieldType.Date:
    case CustomTypeModelFieldType.Text:
      return factory.createKeywordTypeNode(SyntaxKind.StringKeyword);
    default:
      return Fields[property.type]
        ? factory.createTypeReferenceNode(Fields[property.type])
        : factory.createKeywordTypeNode(SyntaxKind.AnyKeyword);
  }
};
