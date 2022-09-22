export type Order = 'asc' | 'desc';
export type Align = 'left' | 'right' | 'center';
export interface HeadCell<T> {
    disablePadding: boolean;
    id: keyof string;
    label: string;
    align: Align;
}
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => any) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, any]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: any | string },
    b: { [key in Key]: any | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}


