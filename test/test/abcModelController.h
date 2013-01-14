//
//  abcModelController.h
//  test
//
//  Created by Raghuveer Subodha on 14/01/13.
//  Copyright (c) 2013 Raghuveer Subodha. All rights reserved.
//

#import <UIKit/UIKit.h>

@class abcDataViewController;

@interface abcModelController : NSObject <UIPageViewControllerDataSource>

- (abcDataViewController *)viewControllerAtIndex:(NSUInteger)index storyboard:(UIStoryboard *)storyboard;
- (NSUInteger)indexOfViewController:(abcDataViewController *)viewController;

@end
