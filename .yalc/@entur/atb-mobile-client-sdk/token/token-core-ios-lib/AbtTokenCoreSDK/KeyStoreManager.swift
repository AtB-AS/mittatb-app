import Foundation

public enum KeyStoreManager {
    case attribute(_ key: String)

    private var query: CFDictionary? {
        guard case let .attribute(key) = self else {
            return nil
        }

        guard let tag = key.data(using: .utf8) else {
            return nil
        }

        return [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: tag,
            kSecReturnData as String: true,
        ] as CFDictionary
    }

    public var value: String? {
        guard let query = query else {
            return nil
        }

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query, &item)
        guard status == errSecSuccess else {
            return nil
        }

        guard let data = item as? Data, let value = String(data: data, encoding: .utf8) else {
            return nil
        }

        return value
    }

    public func save(_ value: String) -> Bool {
        guard case let .attribute(key) = self else {
            return false
        }

        guard let tag = key.data(using: .utf8), let valueData = value.data(using: .utf8) else {
            return false
        }

        let addquery = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: tag,
            kSecValueData as String: valueData,
        ] as CFDictionary

        let status = SecItemAdd(addquery, nil)
        guard status == errSecSuccess else {
            debugPrint(status.error.debugDescription)
            return false
        }

        return true
    }

    public func remove() -> Bool {
        guard let query = query else {
            return false
        }

        let status = SecItemDelete(query)

        guard status == errSecSuccess else {
            return false
        }

        return true
    }
}
