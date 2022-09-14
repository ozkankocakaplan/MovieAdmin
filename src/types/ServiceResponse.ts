export default interface ServiceResponse<T> {
    hasExceptionError: boolean,
    exceptionMessage: null,
    list: Array<T>,
    entity: T,
    count: number,
    isSuccessful: boolean
}