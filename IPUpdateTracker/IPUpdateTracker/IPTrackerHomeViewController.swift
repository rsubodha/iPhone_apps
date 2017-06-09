//
//  IPTrackerHomeViewController.swift
//  IPUpdateTracker
//
//  Created by Raghuveer Subodha on 08/06/17.
//  Copyright © 2017 Raghuveer Subodha. All rights reserved.
//

import UIKit

class IPTrackerHomeViewController: UIViewController {

    //MARK : Outlets defined here
    @IBOutlet weak var backgroundImageView: UIImageView!
    @IBOutlet weak var collectionView: UICollectionView!
    
    
    //MARK: UICollectionView DataSource Handler
    var dataRead = ReadData.dataCollector()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    struct Storyboard
    {
        static let CellIdentifier = "PlaceHolderCell"
    }

}



extension IPTrackerHomeViewController : UICollectionViewDataSource
{
    func numberOfSections(in collectionView: UICollectionView) -> Int
    {
        return 1
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int
    {
        return dataRead.count
    }
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell
    {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Storyboard.CellIdentifier, for: indexPath) as! IPUpdateCollectionViewCell
        cell.DataforUI = self.dataRead[indexPath.item]
        
        return cell;
    }
}
