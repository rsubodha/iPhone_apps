
//
//  IPUpdateCollectionViewCell.swift
//  IPUpdateTracker
//
//  Created by Raghuveer Subodha on 08/06/17.
//  Copyright © 2017 Raghuveer Subodha. All rights reserved.
//

import UIKit

class IPUpdateCollectionViewCell: UICollectionViewCell
{
    //MARK - Data Handles
    var DataforUI: ReadData! {
        didSet {
            UpdateUI()
        }
    }
    
    //MARK - IBOutlets
    @IBOutlet weak var featuredImageView: UIImageView!
    @IBOutlet weak var IPtitleLable: UILabel!

    private func UpdateUI()
    {
        IPtitleLable?.text=DataforUI.IPtitle
        featuredImageView?.image=DataforUI.featuredImage
    }

}

