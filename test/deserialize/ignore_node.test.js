import u from "unist-builder";
import Serializer from "../../src";

const rules = [
  {
    deserialize(node, next) {
      if (node.type === "root") {
        return {
          object: "document",
          nodes: next(node.children)
        };
      }

      if (node.type === "skip") {
        return null;
      }

      if (node.type === "paragraph") {
        return {
          object: "block",
          type: "paragraph",
          nodes: next(node.children)
        };
      }

      if (node.type === "text") {
        return {
          object: "text",
          leaves: [{ object: "leaf", text: node.value }]
        };
      }
    }
  }
];

const input = u("root", [
  u("skip"),
  u("paragraph", [u("text", "Hello world!")])
]);

test("ignore node", () => {
  const serializer = new Serializer({ rules });
  const output = serializer.deserialize(input).toJSON();
  expect(output).toMatchSnapshot();
});
