import Foundation

public enum TokenPayloadAction: Int {
    case unspecified = 0
    case ticketTransfer = 1
    case addRemoveToken = 2
    case identification = 3
    case ticketInspection = 4
    case getFarecontracts = 5
    case travelcard = 6
    // case consumeAccessRights = 7

    var action: Uk_Org_Netex_Www_Netex_TokenAction {
        switch self {
        case .unspecified:
            return Uk_Org_Netex_Www_Netex_TokenAction.unspecified
        case .ticketTransfer:
            return Uk_Org_Netex_Www_Netex_TokenAction.ticketTransfer
        case .addRemoveToken:
            return Uk_Org_Netex_Www_Netex_TokenAction.addRemoveToken
        case .identification:
            return Uk_Org_Netex_Www_Netex_TokenAction.identification
        case .ticketInspection:
            return Uk_Org_Netex_Www_Netex_TokenAction.ticketInspection
        case .getFarecontracts:
            return Uk_Org_Netex_Www_Netex_TokenAction.getFarecontracts
        case .travelcard:
            return Uk_Org_Netex_Www_Netex_TokenAction.travelcard
        }
    }
}
