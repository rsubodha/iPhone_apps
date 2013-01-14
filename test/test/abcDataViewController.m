//
//  abcDataViewController.m
//  test
//
//  Created by Raghuveer Subodha on 14/01/13.
//  Copyright (c) 2013 Raghuveer Subodha. All rights reserved.
//

#import "abcDataViewController.h"

@interface abcDataViewController ()

@end

@implementation abcDataViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    self.dataLabel.text = [self.dataObject description];
}

@end
