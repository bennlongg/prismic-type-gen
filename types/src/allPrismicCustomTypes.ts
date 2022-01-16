import {
  CustomTypeModelFieldType,
  BooleanField,
  RichTextField,
  ImageField,
  IntegrationFields,
  LinkField,
  EmbedField,
  SelectField,
  GeoPointField,
  KeyTextField,
  NumberField,
  ColorField,
  DateField,
  TimestampField,
} from "@prismicio/types";

interface IFieldType<
  TFieldType extends keyof typeof CustomTypeModelFieldType,
  TFields = {}
> {
  field: TFields;
  type: TFieldType;
}

type BooleanFieldType = IFieldType<"Boolean", BooleanField>;
type StructuredTextFieldType = IFieldType<"StructuredText", RichTextField>;
type ImageFieldType = IFieldType<"Image", ImageField>;
type IntegrationFieldsType = IFieldType<"IntegrationFields", IntegrationFields>;
type LinkFieldType = IFieldType<"Link", LinkField>;
type EmbedFieldType = IFieldType<"Embed", EmbedField>;
type SelectFieldType = IFieldType<"Select", SelectField>;
type GeoPointFieldType = IFieldType<"GeoPoint", GeoPointField>;
type TextFieldType = IFieldType<"Text", KeyTextField>;
type NumberFieldType = IFieldType<"Number", NumberField>;
type ColorFieldType = IFieldType<"Color", ColorField>;
type DateFieldType = IFieldType<"Date", DateField>;
type TimestampFieldType = IFieldType<"Timestamp", TimestampField>;

export type FieldTypes =
  | BooleanFieldType
  | StructuredTextFieldType
  | ImageFieldType
  | IntegrationFieldsType
  | LinkFieldType
  | EmbedFieldType
  | SelectFieldType
  | GeoPointFieldType
  | TextFieldType
  | NumberFieldType
  | ColorFieldType
  | DateFieldType
  | TimestampFieldType;

export const Fields: Record<keyof typeof CustomTypeModelFieldType, string> = {
  Boolean: "BooleanField",
  StructuredText: "RichTextField",
  Image: "ImageField",
  IntegrationFields: "IntegrationFields",
  Link: "LinkField",
  Embed: "EmbedField",
  Select: "SelectField",
  GeoPoint: "GeoPointField",
  Text: "TextField",
  Number: "NumberField",
  Color: "ColorField",
  Date: "DateField",
  Timestamp: "TimestampField",
  Group: "Group",
  Slices: "Slices",
  UID: "UID",
};

export type FieldByType<
  E extends FieldTypes["field"],
  T = FieldTypes
> = T extends { type: E } ? T : never;
