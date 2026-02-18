import Foundation
import PassKit

typealias PaymentCompletionHandler = (String?) -> Void

@objc(PaymentHandlerImpl)
class PaymentHandlerImpl: NSObject {

  var paymentController: PKPaymentAuthorizationController?
  var paymentSummaryItems = [PKPaymentSummaryItem]()
  var paymentStatus = PKPaymentAuthorizationStatus.failure
  var completionHandler: PaymentCompletionHandler!
  var paymentData: Data?

  private let merchantIdentifier: String?

  static let supportedNetworks: [PKPaymentNetwork] = [
    .amex,
    .masterCard,
    .visa
  ]

  override init() {
    if let id = Bundle.main.object(forInfoDictionaryKey: "ApplePayMerchantId") as? String, !id.isEmpty {
      self.merchantIdentifier = id
    } else {
      debugPrint("Missing Apple Pay merchant identifier")
      self.merchantIdentifier = nil
    }
    super.init()
  }

  @objc func startPayment(items: [[String: Any]], completionHandler: @escaping (String?) -> Void) -> Void {
    if self.merchantIdentifier == nil { return }

    self.completionHandler = completionHandler;

    var paymentSummaryItems: [PKPaymentSummaryItem] = []
    for item in items {
      if let label = item["label"] as? String,
         let itemPrice = item["price"] as? Double {
        paymentSummaryItems.append(PKPaymentSummaryItem(label: label, amount: NSDecimalNumber(value: itemPrice)))
      }
    }

    // Create a payment request.
    let paymentRequest = PKPaymentRequest()
    paymentRequest.paymentSummaryItems = paymentSummaryItems
    paymentRequest.merchantIdentifier = self.merchantIdentifier!
    paymentRequest.merchantCapabilities = .threeDSecure
    paymentRequest.countryCode = "NO"
    paymentRequest.currencyCode = "NOK"
    paymentRequest.supportedNetworks = PaymentHandlerImpl.supportedNetworks

    // Display the payment request.
    paymentController = PKPaymentAuthorizationController(paymentRequest: paymentRequest)
    paymentController?.delegate = self
    paymentController?.present(completion: { (presented: Bool) in
      if presented {
        debugPrint("Presented payment controller")
      } else {
        debugPrint("Failed to present payment controller")
      }
    })
  }

  @objc func canMakePayments() -> Bool {
    if self.merchantIdentifier == nil { return false }
    return PKPaymentAuthorizationController.canMakePayments()
  }
}

extension PaymentHandlerImpl: PKPaymentAuthorizationControllerDelegate {
  public func paymentAuthorizationController(_ controller: PKPaymentAuthorizationController, didAuthorizePayment payment: PKPayment, handler completion: @escaping (PKPaymentAuthorizationResult) -> Void) {
    let errors = [Error]()
    let status = PKPaymentAuthorizationStatus.success
    self.paymentData = payment.token.paymentData

    completion(PKPaymentAuthorizationResult(status: status, errors: errors))
  }

  public func paymentAuthorizationControllerDidFinish(_ controller: PKPaymentAuthorizationController) {
    controller.dismiss {
      // The payment sheet doesn't automatically dismiss once it has finished. Dismiss the payment sheet.
      DispatchQueue.main.async {
        var paymentDataString: String? = nil
        if let paymentData = self.paymentData {
          paymentDataString = paymentData.base64EncodedString()
        }

        self.completionHandler!(paymentDataString)
      }
    }
  }
}
