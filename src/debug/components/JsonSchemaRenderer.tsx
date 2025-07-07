/* eslint-disable react-x/no-array-index-key */
import React from "react";
import { Card, Text } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";

import { jsonSchema } from "../util/jsonSchema";

import { Box } from "../../components/layout/Box";
import { LabelHeading } from "./LabelHeading";

import { AnyObject, JsonSchemaFormProps } from "../types/types";

import { renderPrimitivesType } from "./RenderPrimitivesType";
import { renderArrayType } from "./RenderArrayType";
import { renderOneOf } from "./RenderOneOf";

export const JsonSchemaRenderer = ({
  name,
  schema,
  path = [],
  onChange,
  parsedSorobanOperation,
  formError,
  setFormError,
}: JsonSchemaFormProps) => {
  const schemaType = jsonSchema.getSchemaType(schema as AnyObject);

  // function schema always starts with an object type
  if (!schemaType) {
    return null;
  }

  if (schemaType === "object") {
    return (
      <Box gap="md" key={`${name}-${path.join(".")}`}>
        {Object.entries(schema.properties || {}).map(
          ([key, propertySchema], index) => {
            const propertySchemaType = jsonSchema.getSchemaType(
              propertySchema as AnyObject,
            );
            const propertySchemaObject = jsonSchema.isSchemaObject(
              propertySchema as AnyObject,
            )
              ? propertySchema
              : undefined;

            if (propertySchemaType === "object" && propertySchemaObject) {
              return (
                <React.Fragment key={`${key}-${index}`}>
                  <LabelHeading size="md" infoText={schema.description}>
                    {key}
                  </LabelHeading>

                  {(propertySchemaObject as AnyObject)?.description ? (
                    <Text as="div" size="xs">
                      {
                        (propertySchemaObject as AnyObject)
                          .description as string
                      }
                    </Text>
                  ) : null}

                  <Box gap="md">
                    <Card>
                      <JsonSchemaRenderer
                        name={path.length > 0 ? path.join(".") : key}
                        path={[...path, key]}
                        schema={propertySchema as JSONSchema7}
                        onChange={onChange}
                        parsedSorobanOperation={parsedSorobanOperation}
                        formError={formError}
                        setFormError={setFormError}
                      />
                    </Card>
                  </Box>
                </React.Fragment>
              );
            }

            return (
              <JsonSchemaRenderer
                key={`${key}-${index}`}
                name={key}
                schema={propertySchema as JSONSchema7}
                path={[...path, key]}
                onChange={onChange}
                parsedSorobanOperation={parsedSorobanOperation}
                formError={formError}
                setFormError={setFormError}
              />
            );
          },
        )}
      </Box>
    );
  }

  if (schemaType === "array") {
    return renderArrayType({
      schema,
      path,
      parsedSorobanOperation,
      onChange,
      renderer: JsonSchemaRenderer,
      formError,
      setFormError,
    });
  }

  if (schemaType === "oneOf") {
    return renderOneOf({
      name,
      schema,
      path,
      parsedSorobanOperation,
      onChange,
      renderer: JsonSchemaRenderer,
      formError,
      setFormError,
    });
  }

  // Recursion Base Case
  return renderPrimitivesType({
    name,
    path,
    schema,
    parsedSorobanOperation,
    onChange,
    formError,
    setFormError,
  });
};
