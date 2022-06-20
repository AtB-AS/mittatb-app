package no.entur.abt.android.token;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;

import uk.org.netex.www.netex.TokenAction;

public class TokenEncodingRequest implements Serializable {

	private final Collection<byte[]> challenges;
	private final TokenAction[] tokenActions;
	private final boolean includeCertificate;

	public TokenEncodingRequest(TokenAction... tokenActions) {
		this(Collections.emptyList(), tokenActions);
	}

	public TokenEncodingRequest(Collection<byte[]> challenges, TokenAction[] tokenActions) {
		this(challenges, tokenActions, false);
	}

	public TokenEncodingRequest(Collection<byte[]> challenges, TokenAction[] tokenActions, boolean includeCertificate) {
		this.challenges = challenges;
		this.tokenActions = tokenActions;
		this.includeCertificate = includeCertificate;
	}

	public Collection<byte[]> getChallenges() {
		return challenges;
	}

	public TokenAction[] getTokenActions() {
		return tokenActions;
	}

	public boolean isIncludeCertificate() {
		return includeCertificate;
	}
}
