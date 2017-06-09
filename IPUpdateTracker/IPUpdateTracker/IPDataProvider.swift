//
//  IPDataProvider.swift
//  IPUpdateTracker
//
//  Created by Raghuveer Subodha on 08/06/17.
//  Copyright © 2017 Raghuveer Subodha. All rights reserved.
//

import UIKit

class ReadData
{
    //MARK - Hold data varialbles
    var IPtitle = ""
    var featuredImage: UIImage!
    
    
    //MARK - Initializers
    init(IPtitle: String, featuredImage: UIImage!)
    {
        self.IPtitle=IPtitle
        self.featuredImage=featuredImage
    }
    
    //MARK - Private functions
    static func dataCollector() -> [ReadData]
    {
        return [
            ReadData (IPtitle: "This is a Image #1", featuredImage: UIImage(named:"beautifulRose_bigger")!),
            ReadData (IPtitle: "This is a Image #2", featuredImage: UIImage(named:"bloomingRose_bigger")!),
            ReadData (IPtitle: "This is a Image #3", featuredImage: UIImage(named:"comboRose")!),
            ReadData (IPtitle: "This is a Image #4", featuredImage: UIImage(named:"solitareRose_bigger")!),
        ]
    }
}
