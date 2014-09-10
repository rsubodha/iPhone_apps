//
//  ViewController.h
//  DFP_Sample
//
//  Created by Raghuveer Subodha on 09/09/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "PageContentViewController.h"

@interface ViewController : UIViewController <UIPageViewControllerDataSource>

- (IBAction)startWalkThrough:(id)sender;
@property (strong,nonatomic) UIPageViewController *pageViewController;
@property (strong,nonatomic) NSArray *pageTitles;
@property (strong,nonatomic) NSArray *pageImages;

@end

