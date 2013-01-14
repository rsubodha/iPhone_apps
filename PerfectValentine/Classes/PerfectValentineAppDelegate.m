//
//  PerfectValentineAppDelegate.m
//  PerfectValentine
//
//  Created by Meenakshi Subodha on 08/02/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import "PerfectValentineAppDelegate.h"
#import "PerfectValentineViewController.h"

@implementation PerfectValentineAppDelegate

@synthesize window;
@synthesize viewController;


- (void)applicationDidFinishLaunching:(UIApplication *)application {    
    
	UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:viewController];
    // Override point for customization after app launch  
	
	[window addSubview:navController.view];
    [window makeKeyAndVisible];
	
}


- (void)dealloc {
    [viewController release];
    [window release];
    [super dealloc];
}


@end
