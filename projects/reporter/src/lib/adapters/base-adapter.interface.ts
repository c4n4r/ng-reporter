export default interface BaseAdapter<I, O> {
    adapt(input: I): O;
}
