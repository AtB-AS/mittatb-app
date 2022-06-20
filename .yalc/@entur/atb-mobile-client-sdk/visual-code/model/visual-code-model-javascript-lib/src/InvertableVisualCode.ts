import { calculateVisualCodeConfig, InvalidVisualCodeError } from './VisualCode'

const HASH_ALGORITHM = 'SHA-256'
const SALT = new TextEncoder().encode('SALT_AND_PEPPER_MAKES_FOOD_MORE_TASTY')

function split(input: Int8Array) {
    const middle = Math.floor(input.length / 2)
    const left = input.slice(0, middle)
    const right = input.slice(middle)
    return [left, right]
}

function fromBase64(input: string) {
    const data = atob(input)
        .split('')
        .map(c => c.charCodeAt(0))

    return new Int8Array(data)
}

function concat(a: Int8Array | Uint8Array, b: Int8Array | Uint8Array) {
    const combined = new Int8Array(a.length + b.length)
    combined.set(a)
    combined.set(b, a.length)
    return combined
}

async function createDigest(input: Int8Array) {
    const dataAndSalt = concat(SALT, input)
    const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, dataAndSalt)
    return new Int8Array(hashBuffer)
}

export async function createInvertableVisualCode(visualInspectionNonceAsBase64: string) {
    try {
        // Create 256 bit hash using SHA-256
        const visualInspectionNonce = fromBase64(visualInspectionNonceAsBase64)
        const digest = await createDigest(visualInspectionNonce)
        const [standardFigureBasis, invertedFigureBasis] = split(digest)

        const standard = calculateVisualCodeConfig(standardFigureBasis)
        const inverted = calculateVisualCodeConfig(invertedFigureBasis)

        return { standard, inverted }
    } catch (error) {
        if (error instanceof Error && error.name === 'NotSupportedError') {
            throw new InvalidVisualCodeError(`Hashing algorithm not supported: ${HASH_ALGORITHM}`)
        }
        throw error
    }
}
/*
public class InvertableVisualCode {

	public static InvertableVisualCode create(byte[] visualInspectionNonce) throws InvalidVisualCodeException {
		return create(visualInspectionNonce, SALT);
	}

	public static InvertableVisualCode create(byte[] visualInspectionNonce, byte[] salt) throws InvalidVisualCodeException {


	}

	private final VisualCode standardView;
	private final VisualCode invertedView;
	private VisualCode currentView;

	public InvertableVisualCode(VisualCode standardView, VisualCode invertedView) {
		this.standardView = standardView;
		this.invertedView = invertedView;

		this.currentView = standardView;
	}

	public void invertedView() {
		currentView = invertedView;
	}

	public void standardView() {
		currentView = standardView;
	}

	public InvertableVisualCode withYellowFrame() {
		standardView.setFrame(true, 0xFFFFFF00);
		invertedView.setFrame(true, 0xFFFFFF00);
		return this;
	}

	public boolean isReversed() {
		return currentView == invertedView;
	}

	public VisualCode getCurrent() {
		return currentView;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		InvertableVisualCode that = (InvertableVisualCode) o;
		return standardView.equals(that.standardView) && invertedView.equals(that.invertedView);
	}

	@Override
	public int hashCode() {
		return Objects.hash(standardView, invertedView);
	}

	public VisualCode getInvertedView() {
		return invertedView;
	}

	public VisualCode getStandardView() {
		return standardView;
	}
}
*/
