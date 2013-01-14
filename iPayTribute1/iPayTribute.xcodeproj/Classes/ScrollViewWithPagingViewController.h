//
//  ScrollViewWithPagingViewController.h
//  iPayTribute
//
//  Created by Raghuveer Subodha on 07/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface ScrollViewWithPagingViewController : UIViewController <UIScrollViewDelegate> {
UIScrollView *scrollView;
UIPageControl *pageControl;
NSMutableArray *viewControllers;


BOOL pageControlUsed;
}

@property (nonatomic, retain) IBOutlet UIScrollView *scrollView;
@property (nonatomic, retain) NSMutableArray *viewControllers;

- (IBAction)changePage:(id)sender;

}

@end
