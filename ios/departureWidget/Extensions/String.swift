import CryptoKit

extension String {
    func md5() -> String? {
        guard let encodedData = data(using: .utf8) else {
            return nil
        }

        return Insecure.MD5.hash(data: encodedData).map { String(format: "%02hhx", $0) }.joined()
    }
}
