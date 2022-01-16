import Case from "case";
import {
  createPrinter,
  createSourceFile,
  EmitHint,
  factory,
  NewLineKind,
  NodeArray,
  PropertySignature,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  TypeAliasDeclaration,
  TypeElement,
  TypeNode,
  Node,
} from "typescript";

export const createType = (
  name: string,
  properties: TypeElement[]
): TypeAliasDeclaration => {
  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(createTypeName(name)),
    undefined,
    factory.createTypeLiteralNode(properties)
  );
};

export const createProperty = (
  name: string,
  type: TypeNode,
  mandatory?: boolean
): PropertySignature => {
  return factory.createPropertySignature(
    undefined,
    factory.createIdentifier(name),
    mandatory ? undefined : factory.createToken(SyntaxKind.QuestionToken),
    type
  );
};

export const createTypeName = (name: string) => {
  return `${Case.pascal(name)}`;
};

export const createProperties = <T>(
  obj: Record<string, T>,
  transformFunc: (element: T) => TypeNode
): TypeElement[] => {
  return Object.keys(obj).map((key) =>
    createProperty(key, transformFunc(obj[key]))
  );
};

export const createImport = (packageName: string, imports: string[] = []) => {
  return factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(
        imports.map((im) =>
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier(im)
          )
        )
      )
    ),
    factory.createStringLiteral(packageName),
    undefined
  );
};

export function printTSNodes(nodes: Node[] | NodeArray<Node>): string {
  const resultFile = createSourceFile(
    "",
    "",
    ScriptTarget.Latest,
    false,
    ScriptKind.TS
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const result: string[] = [];

  nodes.forEach((node) => {
    if (!node) {
      result.push("");
      return;
    }
    result.push(printer.printNode(EmitHint.Unspecified, node, resultFile));
  });
  return result.join("\n\n");
}
