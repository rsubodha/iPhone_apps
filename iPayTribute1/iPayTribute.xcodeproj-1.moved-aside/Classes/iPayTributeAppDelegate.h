//
//  iPayTributeAppDelegate.h
//  iPayTribute
//
//  Created by Raghuveer Subodha on 06/10/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//

#import <UIKit/UIKit.h>

@class iPayTributeViewController;

@interface iPayTributeAppDelegate : NSObject <UIApplicationDelegate> {
    UIWindow *window;
    iPayTributeViewController *viewController;
}

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) IBOutlet iPayTributeViewController *viewController;

@end

