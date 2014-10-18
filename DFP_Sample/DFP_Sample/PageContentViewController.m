//
//  PageContentViewController.m
//  DFP_Sample
//
//  Created by Raghuveer Subodha on 10/09/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import "PageContentViewController.h"
#import "webViewViewController.h"

@interface PageContentViewController ()

@end

@implementation PageContentViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    self.backgroundImageView.image = [UIImage imageNamed:self.imageFile];
    self.titleLabel.text = self.titleText;
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)startWalkThrough:(id)sender {
    
    webViewViewController *loadWebViewViewController = [[webViewViewController alloc] init];
    [self.navigationController pushViewController:loadWebViewViewController animated:YES];
}
@end
