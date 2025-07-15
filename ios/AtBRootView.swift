import React

@objc(AtBRootView)
class AtBRootView: RCTRootView {

    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
     
        print("traitCollectionDidChange");
        print(traitCollection.displayScale);
        print(traitCollection.userInterfaceStyle);
      
        if #available(iOS 13.0, *) {
            if traitCollection.userInterfaceStyle != previousTraitCollection?.userInterfaceStyle {
                setBackgroundByTrait()
            }
        }
    }

    func setBackgroundByTrait() {
        if #available(iOS 13.0, *) {
            if traitCollection.userInterfaceStyle == .dark {
                backgroundColor = UIColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 1.0)
            } else {
                backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)
            }
        } else {
            backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)
        }
    }
}
