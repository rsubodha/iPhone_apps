//
//  tributeAppDelegate.m
//  tribute
//
//  Created by Raghuveer Subodha on 07/10/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//

#import "tributeAppDelegate.h"

@implementation tributeAppDelegate

@synthesize window;


- (void)applicationDidFinishLaunching:(UIApplication *)application {    

    // Override point for customization after application launch
    [window makeKeyAndVisible];
}


- (void)dealloc {
    [window release];
    [super dealloc];
}


@end
