//
//  homeView.m
//  iPayTribute
//
//  Created by Raghuveer Subodha on 09/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "homeView.h"


@implementation homeView


- (id)initWithStyle:(UITableViewStyle)style {
    // Override initWithStyle: if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
    if (self = [super initWithStyle:style]) {
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
	
    [super setSelected:selected animated:animated];
	
    // Configure the view for the selected state
}

- (void)setLabelText:(NSString *)_text;
{
	cellText.text = _text;
}

- (void)setDescpText:(NSString *)_text;
{
	descriptionText.text = _text;
}

- (void)setartifactImage:(NSString *)_text;
{
	artifactImg.image = [UIImage imageNamed:_text];
}


- (void)dealloc {
    [super dealloc];
}


@end

