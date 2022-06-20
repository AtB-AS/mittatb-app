// To get the KEY of an object that is disguised as an enum type.
// This is needed because all enums from `abt-protobuf-js-grpc-node` are actually objects!
export const getEnumObjectKeyAsString = <EnumValue>(
    enumAsObject: Record<string, EnumValue>,
    value: EnumValue,
): string =>
    Object.keys(enumAsObject).find((key: string) => {
        const enumValue = enumAsObject[key] as EnumValue

        return enumValue === value
    }) || ''
