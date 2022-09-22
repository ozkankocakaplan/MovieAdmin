export default interface ServiceResponse<T> {
    hasExceptionError: boolean,
    exceptionMessage: string,
    list: Array<T>,
    entity: T,
    count: number,
    isSuccessful: boolean
}