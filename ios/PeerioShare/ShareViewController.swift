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
    let group = DispatchGroup()

    for item: Any in self.extensionContext!.inputItems {
      let inputItem = item as! NSExtensionItem
      for provider: Any in inputItem.attachments! {
        let itemProvider = provider as! NSItemProvider

        group.enter()
        itemProvider.loadItem(forTypeIdentifier: kUTTypeData as String, options: nil) { data, error in
          if error == nil {
            let sharedItemUri = data as! URL
            let pathToCopyTo = "\(self.sharedFolderPath)/\(sharedItemUri.pathComponents.last ?? "")"
            try? FileManager.default.copyItem(at: sharedItemUri, to: URL(fileURLWithPath: pathToCopyTo))
          } else {
            NSLog("\(error)")
          }
          group.leave()
        }
      }
    }
    
    group.notify(queue: DispatchQueue.main) {
      let files = try! FileManager.default.contentsOfDirectory(atPath: self.sharedFolderPath)
      
      do {
        let jsonData : Data = try JSONSerialization.data(
          withJSONObject: [
            "incoming-files" : files
          ],
          options: JSONSerialization.WritingOptions.init(rawValue: 0))
        let jsonString = (NSString(data: jsonData, encoding: String.Encoding.utf8.rawValue)! as String).addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
        print("peerioshare://shared?\(jsonString!)")
        let result = self.openURL(URL(string: "peerioshare://shared?\(jsonString!)")!)
      } catch let error {
        NSLog("\(error)")
      }
      
      self.dismiss(animated: false) {
        self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
      }
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
