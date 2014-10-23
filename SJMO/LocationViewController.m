//
//  LocationViewController.m
//  SJMO
//
//  Created by ShriHarsha on 10/22/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import "LocationViewController.h"
#import "ATKVision.h"

@interface LocationViewController ()

@end

@implementation LocationViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSDictionary* mainViewDict = @{
                                   @"id": @"webView1",
                                   @"name": @"Web View Widget",
                                   @"class": @"ATKWebView",
                                   @"notificationId":@"",
                                   @"style":@{
                                           @"landscape": @{
                                                   @"x":@"0",
                                                   @"y":@"0",
                                                   @"width":@"100%",
                                                   @"height":@"100%"
                                                   },
                                           @"portrait": @{
                                                   @"x":@"0",
                                                   @"y":@"0",
                                                   @"width":@"100%",
                                                   @"height":@"100%"
                                                   },
                                           @"backgroundColor":@""
                                           },
                                   @"properties":@{
                                           @"scrollable": @"NO"
                                           },
                                   @"data":@{
                                           @"callbackFunction": @"onComplete",
                                           @"source":@"carouselView.html",
                                           @"type":@"local"
                                           }
                                   };
    
    UIViewController * viewController = (UIViewController *)[ATKShelfManager presentComponentInView: self.view withDictionary:mainViewDict];
    
    [self addChildViewController:viewController];

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
