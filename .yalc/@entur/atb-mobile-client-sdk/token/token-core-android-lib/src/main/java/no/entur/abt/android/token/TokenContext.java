package no.entur.abt.android.token;

import java.util.concurrent.locks.Lock;

public interface TokenContext<T> {

	String getId();

	Token getToken();

	void setToken(Token token);

	int getStrainNumber();

	int incrementStrainNumber();

	boolean isLatestStrain(int strainNumber);

	Lock getLock();
}
