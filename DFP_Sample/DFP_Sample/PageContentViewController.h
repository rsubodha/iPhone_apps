//
//  PageContentViewController.h
//  DFP_Sample
//
//  Created by Raghuveer Subodha on 10/09/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PageContentViewController : UIViewController
@property (weak, nonatomic) IBOutlet UIImageView *backgroundImageView;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property NSInteger pageIndex;
@property NSString *titleText;
@property NSString *imageFile;
@end
