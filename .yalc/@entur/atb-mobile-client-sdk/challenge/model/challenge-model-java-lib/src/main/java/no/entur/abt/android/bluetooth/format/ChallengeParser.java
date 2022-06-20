package no.entur.abt.android.bluetooth.format;

import java.util.Arrays;
import java.util.List;

public class ChallengeParser {

	private static final String TAG = ChallengeParser.class.getName();

	public static Builder newBuilder() {
		return new Builder();
	}

	public static class Builder {

		private List<ChallengeBinaryParser> parsers;

		/**
		 * In prioritized order.
		 *
		 * @param parsers list of builders
		 * @return this builder
		 */
		public Builder withParsers(ChallengeBinaryParser... parsers) {
			return withParsers(Arrays.asList(parsers));
		}

		/**
		 * In prioritized order.
		 *
		 * @param parsers list of builders
		 * @return this builder
		 */
		public Builder withParsers(List<ChallengeBinaryParser> parsers) {
			this.parsers = parsers;

			return this;
		}

		public ChallengeParser build() {
			if (parsers == null || parsers.isEmpty()) {
				throw new IllegalStateException("Expected more than one parser");
			}

			return new ChallengeParser(parsers);
		}
	}

	private final ChallengeBinaryParser[] parsers;

	protected ChallengeParser(List<ChallengeBinaryParser> parsers) {
		this.parsers = parsers.toArray(new ChallengeBinaryParser[parsers.size()]);
	}

	public Challenge parse(byte[] challenge) {
		for (ChallengeBinaryParser parser : parsers) {
			if (parser.supports(challenge)) {
				return parser.parse(challenge);
			}
		}
		return null;
	}

	public ChallengeBinaryParser[] getParsers() {
		return parsers;
	}
}
