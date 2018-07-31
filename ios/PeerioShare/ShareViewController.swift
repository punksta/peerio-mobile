//
//  ShareViewController.swift
//  peerioshare
//
//  Created by work on 31/07/2018.
//

import UIKit
import Social

class ShareViewController: UIViewController {

  override func viewDidLoad() {
    super.viewDidLoad()
  }
  
  override func viewDidAppear(_ animated: Bool) {
    self.openURL(URL(string: "peerioshare://hello")!)
  }

  @objc
  func openURL(_ url: URL) -> Bool {
    var responder: UIResponder? = self
    while responder != nil {
      if let application = responder as? UIApplication {
        return application.perform(#selector(openURL(_:)), with: url) != nil
      }
      responder = responder?.next
    }
    return false
  }
}
