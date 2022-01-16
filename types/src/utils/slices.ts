import {
  CustomTypeModelSlice,
  CustomTypeModelFieldForGroup,
  CustomTypeModelField,
} from "@prismicio/types";
import { factory } from "typescript";
import {
  createProperties,
  createType,
  createProperty,
  createTypeName,
} from "./ts";
import { propertyTypeMap } from "./typeMap";
type ModelFields = Record<string, CustomTypeModelField>;

export const createSliceType = (
  name: string,
  fields: CustomTypeModelSlice<
    Record<string, CustomTypeModelFieldForGroup>,
    Record<string, CustomTypeModelFieldForGroup>
  >,
  models: Record<string, ModelFields>
) => {
  const nonRepeatFields = fields["non-repeat"];
  const repeatFields = fields.repeat;

  const nonRepeatProperties = createProperties(nonRepeatFields, (p) =>
    propertyTypeMap(p, models)
  );
  const repeatProperties = createProperties(repeatFields, (p) =>
    propertyTypeMap(p, models)
  );

  return createType(createTypeName(name + "Slice"), [
    createProperty(
      "slice_type",
      factory.createLiteralTypeNode(factory.createStringLiteral(name)),
      true
    ),
    createProperty(
      "primary",
      factory.createTypeLiteralNode(nonRepeatProperties)
    ),
    createProperty(
      "items",
      factory.createArrayTypeNode(
        factory.createTypeLiteralNode(repeatProperties)
      )
    ),
  ]);
};
