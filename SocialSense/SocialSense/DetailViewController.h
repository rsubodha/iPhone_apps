//
//  DetailViewController.h
//  SocialSense
//
//  Created by Raghuveer Subodha on 04/09/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DetailViewController : UIViewController

@property (strong, nonatomic) id detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@end

