/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { JSONSchema7 } from "json-schema";

import type { AnyObject } from "../types/types";
import { set } from "lodash";

/**
 * For a path like 'requests.1.request_type':
 *
 * obj = {
 *   requests: [
 *     { address: "", amount: "", request_type: "" },
 *     { address: "", amount: "", request_type: "" }
 *   ]
 * }
 *
 * path = "requests.1.request_type"
 * val = e.target.value
 *
 * This will update the value of requests[1].request_type
 */
const setDeepValue = (
  obj: AnyObject,
  path: string,
  val: AnyObject,
): AnyObject => {
  if (!obj) return {};
  const newObj = JSON.parse(JSON.stringify(obj));
  return set(newObj, path, val);
};

const isTaggedUnion = (schema: JSONSchema7): boolean => {
  return Boolean(
    schema.properties?.tag &&
      schema.properties?.values &&
      schema.required?.includes("tag") &&
      schema.required?.includes("values"),
  );
};

const getNestedItemLabel = (path: string): string => {
  const keys = parsePath(path);

  return keys[keys.length - 1] ? keys[keys.length - 1].toString() : "";
};

const parsePath = (path: string): (string | number)[] =>
  path.split(".").map((key) => {
    const parsed = Number(key);

    return isNaN(parsed) ? key : parsed;
  });

const getSchemaType = (prop: AnyObject) => {
  if (!prop) return undefined;

  if (prop.$ref) {
    return (prop.$ref as string).replace("#/definitions/", "");
  }

  if (prop.oneOf) {
    return "oneOf";
  }

  return prop.type;
};

const isSchemaObject = (
  schema: JSONSchema7 | AnyObject,
): schema is JSONSchema7 =>
  schema && typeof schema === "object" && !Array.isArray(schema);

const getSchemaItems = (schema: JSONSchema7 | AnyObject) => {
  if (schema.items && typeof schema.items !== "boolean") {
    if ((schema.items as AnyObject).properties) {
      return (schema.items as AnyObject).properties;
    }
    return schema.items;
  }
  return {};
};

const getSchemaProperty = (
  schema: JSONSchema7 | AnyObject,
  key: string,
): JSONSchema7 | undefined => {
  if (!isSchemaObject(schema) || !schema.properties) return undefined;
  const prop = schema.properties[key];
  return isSchemaObject(prop as JSONSchema7)
    ? (prop as JSONSchema7)
    : undefined;
};

const isTuple = (schema: AnyObject) => {
  return schema.type === "array" && Array.isArray(schema.items);
};

const hasAnyValidationPassed = (errors: (string | false)[]): boolean =>
  errors.some((error) => error === false);

const deleteNestedItemError = (
  nestedKey: string[],
  formError: AnyObject,
  nameIndex: string,
) => {
  const newFormError = { ...formError };

  for (const item of nestedKey) {
    const deletedPath = [nameIndex, item].join(".");
    delete newFormError[deletedPath];
  }

  return newFormError;
};

export const jsonSchema = {
  setDeepValue,
  isSchemaObject,
  getNestedItemLabel,
  getSchemaType,
  getSchemaItems,
  getSchemaProperty,
  isTuple,
  isTaggedUnion,
  hasAnyValidationPassed,
  deleteNestedItemError,
};
