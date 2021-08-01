/**
 * test data assertion types
 */
export type TResDataAssertionType = 'object' | 'array';

/**
 * test data assertion props
 */
export interface IResDataAssertionProps {
    check?: 'exists' | 'type' | 'equal' | 'notEqual' | 'length' | '+props' | '-props' | null;
    value?: string | number | boolean | string[];
}

/**
 * test assertion options
 */
export interface IResDataAssertions {
    [key: string]: IResDataAssertionProps;
}