//
//  ShareViewController.swift
//  peerioshare
//
//  Created by work on 31/07/2018.
//

import UIKit
import Social
import MobileCoreServices

class ShareViewController: UIViewController {
  var sharedFolderPath = ""
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    let containerURL = FileManager().containerURL(forSecurityApplicationGroupIdentifier: "group.peerio.share")!
    sharedFolderPath = "\(containerURL.path)/sharedData"
    
    do {
      try FileManager.default.createDirectory(atPath: sharedFolderPath, withIntermediateDirectories: true, attributes: nil)
    } catch let error as NSError {
      print("Could not create the directory \(error)")
    } catch {
      fatalError()
    }
    
    let files = try! FileManager.default.contentsOfDirectory(atPath: sharedFolderPath)
    for file in files {
      try? FileManager.default.removeItem(at: URL(fileURLWithPath: "\(sharedFolderPath)/\(file)"))
    }
  }
  
  override func viewDidAppear(_ animated: Bool) {
//    self.openURL(URL(string: "peerioshare://hello")!)
    print(sharedFolderPath)
    let group = DispatchGroup()

    for item: Any in self.extensionContext!.inputItems {
      let inputItem = item as! NSExtensionItem
      for provider: Any in inputItem.attachments! {
        let itemProvider = provider as! NSItemProvider

        group.enter()
        itemProvider.loadItem(forTypeIdentifier: kUTTypeData as String, options: nil) { data, error in
//          if error == nil {
              print(data, error)
////            let url = data as! URL
////            let path = "\(self.docPath)/\(url.pathComponents.last ?? "")"
////            print(">>> sharepath: \(String(describing: url.path))")
////
////            try? FileManager.default.copyItem(at: url, to: URL(fileURLWithPath: path))
//
//          } else {
//            NSLog("\(error)")
//          }
          group.leave()
        }
      }
    }
    
    self.dismiss(animated: false) {
      self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
    }
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
