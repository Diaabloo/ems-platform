const codes = new Map(); // userId -> { code, expiresAt }

// Stores a temporary OTP code for a user with an expiration time (TTL)
export function setOTP(userId, code, ttl = 300000) {
  codes.set(userId, { code, expiresAt: Date.now() + ttl });
  console.log(`[DEBUG] Set OTP for userId ${userId}: ${code}, expires at ${new Date(Date.now() + ttl).toISOString()}`);
}

export function verifyOTP(userId, code) {
  const data = codes.get(userId);
  console.log(`[DEBUG] Verify OTP for userId ${userId}: stored=${data?.code}, provided=${code}, expired=${data ? Date.now() > data.expiresAt : 'no data'}`);
  if (!data || data.code !== code || Date.now() > data.expiresAt) {
    codes.delete(userId);
    return false;
  }
  codes.delete(userId);
  return true;
}