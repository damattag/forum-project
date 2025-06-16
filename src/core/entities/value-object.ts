export abstract class ValueObject<T> {
	protected props: T;

	protected constructor(props: T) {
		this.props = props;
	}

	public equals(valueObject: ValueObject<unknown>): boolean {
		if (valueObject === null || valueObject === undefined) {
			return false;
		}

		if (valueObject.props === undefined) {
			return false;
		}

		return JSON.stringify(valueObject.props) === JSON.stringify(this.props);
	}
}
