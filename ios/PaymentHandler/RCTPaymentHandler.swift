import Foundation
import PassKit

typealias PaymentCompletionHandler = (String?) -> Void

@objcMembers public class PaymentHandler: NSObject {

  var paymentController: PKPaymentAuthorizationController?
  var paymentSummaryItems = [PKPaymentSummaryItem]()
  var paymentStatus = PKPaymentAuthorizationStatus.failure
  var completionHandler: PaymentCompletionHandler!
  var paymentData: Data?

  static let supportedNetworks: [PKPaymentNetwork] = [
      .amex,
      .masterCard,
      .visa
  ]

  public func startPayment(for price: Float, completionHandler: @escaping (String?) -> Void) -> Void {
    self.completionHandler = completionHandler;

    let singleTicket = PKPaymentSummaryItem(label: "Single ticket", amount: NSDecimalNumber(string: "47.00"), type: .final)
    let mva = PKPaymentSummaryItem(label: "Hvorav MVA", amount: NSDecimalNumber(string: "12.00"), type: .final)
    let total = PKPaymentSummaryItem(label: "AtB", amount: 47.00)
    paymentSummaryItems = [singleTicket, mva, total]

    // Create a payment request.
    let paymentRequest = PKPaymentRequest()
    paymentRequest.paymentSummaryItems = paymentSummaryItems
    paymentRequest.merchantIdentifier = "merchant.no.mittatb.atb"
    paymentRequest.merchantCapabilities = .threeDSecure
    paymentRequest.countryCode = "NO"
    paymentRequest.currencyCode = "NOK"
    paymentRequest.supportedNetworks = PaymentHandler.supportedNetworks

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
}

extension PaymentHandler: PKPaymentAuthorizationControllerDelegate {
  public func paymentAuthorizationController(_ controller: PKPaymentAuthorizationController, didAuthorizePayment payment: PKPayment, handler completion: @escaping (PKPaymentAuthorizationResult) -> Void) {
      let errors = [Error]()
      let status = PKPaymentAuthorizationStatus.success
      self.paymentData = payment.token.paymentData
      debugPrint("paymentData", String(data: payment.token.paymentData, encoding: .utf8)!)
      completion(PKPaymentAuthorizationResult(status: status, errors: errors))
  }

  public func paymentAuthorizationControllerDidFinish(_ controller: PKPaymentAuthorizationController) {
    controller.dismiss {
      // The payment sheet doesn't automatically dismiss once it has finished. Dismiss the payment sheet.
      DispatchQueue.main.async {
        var paymentDataString: String? = nil
        if let paymentData = self.paymentData {
          paymentDataString = String(data: paymentData, encoding: .utf8)
        }

        debugPrint(self.paymentStatus.rawValue);
        debugPrint("TOKEN", self.paymentData as Any)

        if self.paymentStatus == .success {
          self.completionHandler!(paymentDataString)
        } else {
          self.completionHandler!(nil)
        }
      }
    }
  }
}
