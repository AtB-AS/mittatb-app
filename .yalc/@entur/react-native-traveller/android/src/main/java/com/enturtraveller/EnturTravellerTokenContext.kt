package com.enturtraveller

import no.entur.abt.android.token.Token
import no.entur.abt.android.token.TokenContext
import no.entur.abt.android.token.TokenRenewer
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.locks.Lock
import java.util.concurrent.locks.ReentrantLock

class EnturTravellerTokenContext<T>(private val id: String) : TokenContext<T> {
  // simple helper for detecting that an old token already has superseded
  private val strainNumber = AtomicInteger()
  private val lock: ReentrantLock = ReentrantLock()

  override fun getId(): String {
    return id
  }

  override fun getStrainNumber(): Int {
    return strainNumber.toInt()
  }

  override fun incrementStrainNumber(): Int {
    return strainNumber.incrementAndGet()
  }

  override fun isLatestStrain(strainNumber: Int): Boolean {
    return strainNumber == strainNumber.toInt()
  }

  private var token: Token<*>? = null

  override fun getToken(): Token<*>? {
    return token
  }

  override fun setToken(newToken: Token<*>?) {
    token = newToken;
  }

  override fun getTokenRenewer(): TokenRenewer<T>? {
    return null
  }

  override fun setTokenRenewer(renewer: TokenRenewer<T>) {}

  override fun getLock(): Lock {
    return lock
  }
}
