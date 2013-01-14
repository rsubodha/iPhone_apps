//
//  iPayTributeAppDelegate.m
//  iPayTribute
//
//  Created by Raghuveer Subodha on 07/10/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//

#import "iPayTributeAppDelegate.h"


@implementation iPayTributeAppDelegate

@synthesize window;
@synthesize tabBarController;

@synthesize webView;

- (void)applicationDidFinishLaunching:(UIApplication *)application {
    
	
	[webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://ww31.1800flowers.com/template.do?id=template8&page=2000&conversionTag=true"]]];
    // Add the tab bar controller's current view as a subview of the window
    [window addSubview:tabBarController.view];
	[window makeKeyAndVisible];
}


/*
// Optional UITabBarControllerDelegate method
- (void)tabBarController:(UITabBarController *)tabBarController didSelectViewController:(UIViewController *)viewController {
}
*/

/*
// Optional UITabBarControllerDelegate method
- (void)tabBarController:(UITabBarController *)tabBarController didEndCustomizingViewControllers:(NSArray *)viewControllers changed:(BOOL)changed {
}
*/


- (void)dealloc {
    [tabBarController release];
    [window release];
    [super dealloc];
}

@end

