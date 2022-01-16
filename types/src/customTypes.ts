import {
  CustomTypeModel,
  CustomTypeModelField,
  CustomTypeModelFieldType,
} from "@prismicio/types";

import { Node } from "typescript";
import { createProperties, createType } from "./utils/ts";
import { propertyTypeMap } from "./utils/typeMap";
import { createSliceType } from "./utils/slices";
type ModelFields = Record<string, CustomTypeModelField>;

const stripData = (models: CustomTypeModel[]) => {
  return models.reduce((dict, model) => {
    const tabs = Object.values(model.json).map((tab) => tab);
    const merged = Object.assign({}, ...tabs) as Record<
      string,
      CustomTypeModelField
    >;
    dict[model.id] = merged;
    return dict;
  }, {} as Record<string, ModelFields>);
};

const gen = (models: Record<string, ModelFields>) => {
  const nodes: Node[] = [];
  const generatedSlices: string[] = [];

  const getModel = (modelId: string) => {
    return models[modelId];
  };

  // generate slice types
  // remove duplicates
  Object.keys(models).forEach((modelId) => {
    const model = getModel(modelId);
    const body = model?.body;

    if (body?.type === CustomTypeModelFieldType.Slices) {
      Object.entries(body.config.choices).forEach(([sliceId, choice]) => {
        if (generatedSlices.findIndex((s) => s === sliceId) > -1) {
          return;
        }
        if (choice.type === "Slice") {
          nodes.push(createSliceType(sliceId, choice, models));
          generatedSlices.push(sliceId);
        }

        // TODO: handle shared slices
      });
    }
  });

  // generate document types
  Object.keys(models).forEach((modelId) => {
    nodes.push(
      createType(
        modelId,
        createProperties(models[modelId], (p) => propertyTypeMap(p, models))
      )
    );
  });

  return nodes;
};

export const generate = (models: CustomTypeModel[]) => gen(stripData(models));
