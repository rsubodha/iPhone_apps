//
//  aboutUSViewController.m
//  SJMO
//
//  Created by Raghuveer Subodha on 06/10/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import "aboutUSViewController.h"

@interface aboutUSViewController ()

@end

@implementation aboutUSViewController
@synthesize webView;


- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSLog(@"I'm in webview");
    
    [webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"1" ofType:@"html"]isDirectory:NO]]];
    // Do any additional setup after loading the view.
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
