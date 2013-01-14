//
//  PerfectValentineAppDelegate.h
//  PerfectValentine
//
//  Created by Meenakshi Subodha on 08/02/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import <UIKit/UIKit.h>

@class PerfectValentineViewController;

@interface PerfectValentineAppDelegate : NSObject <UIApplicationDelegate> {
    UIWindow *window;
    PerfectValentineViewController *viewController;
}

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) IBOutlet PerfectValentineViewController *viewController;

@end

